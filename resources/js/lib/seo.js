import {
    DEFAULT_OG_IMAGE,
    SITE_LOCALE,
    SITE_NAME,
    SITE_ORIGIN,
    TITLE_TEMPLATE,
} from '../site.config';

/**
 * Runtime document metadata for a client-rendered site.
 *
 * The three HTML entries can only carry one fixed set of tags, but every route
 * needs its own title, description, canonical, and JSON-LD graph. This module
 * upserts those tags as the route changes. No helmet-style dependency: the
 * surface needed here is about twenty tags and one script element.
 *
 * Tags are only ever created or updated, never removed, because the SPA shell
 * always wants the same fixed baseline (description, og:site_name, og:locale,
 * twitter:card) on every route. Only the JSON-LD block is replaced wholesale,
 * since a new route's graph must not inherit the previous route's entities.
 */

const JSON_LD_ATTR = 'data-seo-jsonld';

const warned = new Set();

function warnOnce(key, message) {
    if (!import.meta.env?.DEV) return;
    if (warned.has(key)) return;
    warned.add(key);
    console.warn(`[seo] ${message}`);
}

/**
 * Resolve a path against SITE_ORIGIN. Returns the path untouched when the origin
 * is unset, which is the failure mode that leaks nothing and claims nothing.
 */
export function absoluteUrl(path = '/') {
    if (!SITE_ORIGIN) return path;
    if (/^https?:\/\//i.test(path)) return path;
    try {
        return new URL(path, SITE_ORIGIN).toString();
    } catch {
        return path;
    }
}

export function hasSiteOrigin() {
    return Boolean(SITE_ORIGIN);
}

function upsertMeta(attribute, key, content) {
    if (content === undefined || content === null || content === '') return;

    const selector = `meta[${attribute}="${key}"]`;
    let tag = document.head.querySelector(selector);

    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }

    tag.setAttribute('content', String(content));
}

function upsertLink(rel, href) {
    if (!href) return;

    let tag = document.head.querySelector(`link[rel="${rel}"]`);

    if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
    }

    tag.setAttribute('href', href);
}

function formatTitle(title) {
    if (!title) return SITE_NAME;
    return TITLE_TEMPLATE.replace('%s', title);
}

function checkLength(label, value, min, max) {
    if (!value) return;
    if (value.length < min || value.length > max) {
        warnOnce(
            `${label}:${value.length}`,
            `${label} is ${value.length} characters, outside the ${min}-${max} range search engines tend to display.`
        );
    }
}

/**
 * Apply one route's metadata. Called by RouteSeo on every navigation.
 *
 * @param {object} options
 * @param {string} [options.title]        Page title without the site suffix.
 * @param {string} [options.description]  Meta description, 50-160 characters.
 * @param {string} [options.canonical]    Absolute URL of this page.
 * @param {string} [options.image]        Absolute or site-relative share image.
 * @param {string} [options.imageAlt]
 * @param {string} [options.type]         Open Graph type, default 'website'.
 * @param {string} [options.robots]       Defaults to index,follow.
 * @param {string} [options.publishedTime] ISO date, for article pages.
 * @param {Array}  [options.jsonLd]       JSON-LD objects, or one @graph.
 */
export function applySeo({
    title,
    description,
    canonical,
    image,
    imageAlt,
    type = 'website',
    robots = 'index, follow, max-image-preview:large, max-snippet:-1',
    publishedTime,
    jsonLd,
} = {}) {
    if (typeof document === 'undefined') return;

    const formattedTitle = formatTitle(title);
    const canonicalUrl = canonical ? absoluteUrl(canonical) : absoluteUrl(window.location.pathname);
    const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);

    checkLength('title', formattedTitle, 15, 60);
    checkLength('description', description, 50, 160);

    document.title = formattedTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);

    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:title', formattedTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', SITE_LOCALE);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:image:alt', imageAlt);

    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMeta('name', 'twitter:title', formattedTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    if (publishedTime) upsertMeta('property', 'article:published_time', publishedTime);

    renderJsonLd(jsonLd);
}

function renderJsonLd(graph) {
    document.head.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((node) => node.remove());
    if (!graph) return;

    // A single node with @graph is valid and keeps the head short, but a bare
    // list is what most validators expect, so only wrap when asked to.
    const payload = Array.isArray(graph) ? graph : [graph];

    payload.filter(Boolean).forEach((entry) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute(JSON_LD_ATTR, '');
        script.textContent = JSON.stringify(entry);
        document.head.appendChild(script);
    });
}

/**
 * Keep the consoles out of the index. Both consoles read the signed-in role from
 * localStorage, so a crawler that executes nothing would otherwise land on
 * whatever the HTML shell says.
 */
export function applyNoindex(title, description) {
    applySeo({ title, description, robots: 'noindex, nofollow, noarchive' });
}