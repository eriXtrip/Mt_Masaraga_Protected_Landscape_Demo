import { TRAILS } from '../mockData';
import {
    DEFAULT_OG_IMAGE,
    DEFAULT_OG_IMAGE_ALT,
    ORGANIZATION,
    SITE_DESCRIPTION,
} from '../site.config';
import { findAward, findNews, isoDate, schema } from './schema';

/**
 * Per-route metadata for the public site.
 *
 * This is a table rather than a `<Seo>` call inside every page because the site
 * has three HTML entries and around thirty routes: keeping metadata here gives
 * one place to audit coverage, and a route nobody remembered to write down still
 * resolves to something correct instead of inheriting the previous page's
 * canonical.
 *
 * Breadcrumbs only ever name pages that exist. `/trail`, `/news`, and `/awards`
 * have no index page, so their trails and articles hang directly off Home rather
 * than off a crumb that would 404.
 */

const NOINDEX = 'noindex, follow, max-image-preview:large';
const NOT_FOUND_INDEX = 'noindex, follow';

const org = () => schema.organization();
const site = () => schema.webSite();
const landscape = () => schema.protectedLandscape();
const crumbs = (...list) => schema.breadcrumbs([{ name: 'Home', path: '/' }, ...list]);

const home = () => ({
    description: SITE_DESCRIPTION,
    canonical: '/',
    image: DEFAULT_OG_IMAGE,
    imageAlt: DEFAULT_OG_IMAGE_ALT,
    jsonLd: [org(), site(), landscape(), schema.trailList()],
});

const legalRoutes = {
    '/legal/privacy-policy': [
        'Privacy Notice',
        'How the park handles personal data, visitor registration, and payment records under DENR record-keeping requirements.',
    ],
    '/legal/cookie-policy': ['Cookie Terms', 'What this site stores in your browser, why it stores it, and how to clear it.'],
    '/legal/ecotourism-policy': [
        'Ecotourism Notice',
        'The low-impact visitor practices the protected area asks hikers to follow on trail and at camp.',
    ],
    '/legal/wildlife-protection': [
        'Wildlife Protection',
        'The rules that keep flora and fauna inside the protected landscape protected by law.',
    ],
    '/legal/terms-conditions': [
        'Terms and Conditions',
        'The agreement between visitors and the Protected Area Management Board when using this platform.',
    ],
    '/legal/disclaimer': [
        'Disclaimer',
        'The limits of the information published here, and how to report something inaccurate.',
    ],
    '/legal/refund-policy': [
        'Refund Policy',
        'When registration fees are refunded or credited, including weather closures and cancellations.',
    ],
};

/** Ordered most specific first; the first match wins. */
const ROUTES = [
    {
        // `/trail` redirects to `/` in trail.jsx, so it inherits home metadata
        // rather than flashing a not-found title before the redirect lands.
        match: (path) => path === '/' || path === '/trail',
        seo: home,
    },
    {
        match: (path) => path === '/about',
        seo: () => ({
            title: 'About the Protected Landscape',
            description:
                "Mt. Masaraga's summit, campsite, natural springs, and Vanishing Falls, inside a protected landscape in Ligao City, Albay.",
            canonical: '/about',
            jsonLd: [org(), landscape(), crumbs({ name: 'About', path: '/about' })],
        }),
    },
    {
        match: (path) => path.startsWith('/trail/'),
        seo: (path) => {
            const id = path.split('/').filter(Boolean)[1];
            const trail = TRAILS[id];

            if (!trail) return { ...home(), canonical: path, robots: NOT_FOUND_INDEX };

            return {
                // trail.name already reads 'Sabluyon Trail'; appending another
                // 'Trail' here produced 'Sabluyon Trail Trail'.
                title: trail.name,
                description: describeTrail(trail),
                canonical: path,
                image: trail.image,
                imageAlt: `The ${trail.name} route on Mt. Masaraga`,
                jsonLd: [org(), schema.trail(trail), crumbs({ name: trail.name })],
            };
        },
    },
    {
        match: (path) => path === '/help',
        seo: () => ({
            title: 'Visitor Help and FAQ',
            description:
                'Permits, mandatory documents, payment methods, guide ratios, weather closures, and refund rules for hiking Mt. Masaraga.',
            canonical: '/help',
            image: DEFAULT_OG_IMAGE,
            jsonLd: [org(), schema.faqPage(), crumbs({ name: 'Help', path: '/help' })],
        }),
    },
    {
        match: (path) => path === '/contact',
        seo: () => ({
            title: 'Contact the Park Office',
            description: `Reach the DENR/PAMB local office in ${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} for permit support at ${ORGANIZATION.supportEmail}.`,
            canonical: '/contact',
            jsonLd: [org(), crumbs({ name: 'Contact', path: '/contact' })],
        }),
    },
    {
        match: (path) => path.startsWith('/news/'),
        seo: (path) => {
            const id = path.split('/').filter(Boolean)[1];
            const article = findNews(id);

            if (!article) return { ...home(), canonical: path, robots: NOT_FOUND_INDEX };

            return {
                title: article.title,
                description: article.leadParagraph,
                canonical: path,
                image: article.leadImage,
                imageAlt: article.leadImageAlt,
                type: 'article',
                publishedTime: isoDate(article.date),
                jsonLd: [org(), schema.newsArticle(article), crumbs({ name: article.title })],
            };
        },
    },
    {
        match: (path) => path.startsWith('/awards/'),
        seo: (path) => {
            const id = path.split('/').filter(Boolean)[1];
            const award = findAward(id);

            if (!award) return { ...home(), canonical: path, robots: NOT_FOUND_INDEX };

            return {
                title: award.name,
                description: pickDescription(award.summary, award.description),
                canonical: path,
                image: award.image,
                imageAlt: award.imageAlt,
                jsonLd: [org(), schema.awardArticle(award), crumbs({ name: award.name })],
            };
        },
    },
    {
        match: (path) => Boolean(legalRoutes[path]),
        seo: (path) => {
            const [label, description] = legalRoutes[path];

            return {
                title: label,
                description,
                canonical: path,
                jsonLd: [org(), crumbs({ name: label })],
            };
        },
    },

    /** A schedule lookup is a form, not a page anyone links to. */
    {
        match: (path) => path === '/lookup',
        seo: () => ({
            title: 'Look Up a Climb Schedule',
            description:
                'Check whether a climb date still has slots on Sabluyon Trail or Balogo Trail before you reserve.',
            canonical: '/lookup',
            jsonLd: [org(), schema.trailList()],
        }),
    },

    /** Authenticated or per-visitor routes: crawlable, not indexable. */
    {
        match: (path) => ['/login', '/signup', '/forgot-password'].includes(path),
        seo: (path) => ({
            title: path === '/login' ? 'Sign In' : path === '/signup' ? 'Create an Account' : 'Reset Your Password',
            description: 'Sign in to manage permits, schedules, and digital hike passes for Mt. Masaraga.',
            canonical: path,
            robots: NOINDEX,
        }),
    },
    {
        match: (path) => path === '/booking' || path.startsWith('/booking/'),
        seo: (path) => ({
            title: 'Book a Climb',
            description: 'Reserve a slot on an authorized Mt. Masaraga trail schedule and pay the permit fees.',
            canonical: path,
            robots: NOINDEX,
        }),
    },
    {
        match: (path) => path.startsWith('/hiker/'),
        seo: (path) => ({
            title: 'My Digital Hike Passes',
            description: 'View and download the digital passes issued for your Mt. Masaraga bookings.',
            canonical: path,
            robots: NOINDEX,
        }),
    },
    {
        match: () => true,
        seo: (path) => ({
            title: 'Page Not Found',
            description: 'That page is not part of the Mt. Masaraga Protected Landscape portal.',
            canonical: path,
            robots: NOT_FOUND_INDEX,
        }),
    },
];

/**
 * Resolve metadata for a pathname. Always returns a full object, so a route with
 * no entry still gets a title, a description, and a self-referencing canonical.
 */
export function resolveRouteSeo(pathname) {
    const path = pathname || '/';
    const route = ROUTES.find((candidate) => candidate.match(path));
    const resolved = route.seo(path);

    return {
        ...resolved,
        canonical: resolved.canonical || path,
        description: clampDescription(resolved.description),
    };
}

/** Search engines truncate a meta description past roughly this length. */
const DESCRIPTION_LIMIT = 160;

/**
 * Trail descriptions are assembled from the stats the page already shows rather
 * than reusing trail.description, which runs past 280 characters and would be
 * cut off mid-sentence in every result listing.
 */
function describeTrail(trail) {
    const stat = (id) => trail.stats?.find((entry) => entry.id === id)?.value;
    const elevation = Number.parseFloat(String(stat('elevation')).replace(/[^0-9.]/g, ''));

    return pickDescription(
        `${trail.name}: ${trail.trailClass}. ${trail.difficulty} hike, ${stat('distance')} over ${stat('duration')} to the ${elevation.toLocaleString('en-US')} m summit of Mt. Masaraga.`,
        trail.description
    );
}

/** Use the richer text when it fits, otherwise the shorter one already on hand. */
function pickDescription(preferred, fallback) {
    if (preferred && preferred.length <= DESCRIPTION_LIMIT) return preferred;
    if (fallback && fallback.length <= DESCRIPTION_LIMIT) return fallback;

    return clampDescription(preferred || fallback);
}

/**
 * Final guard for every route, so a long copy edit in mockData can never push a
 * description past the limit unnoticed. Cuts back to the last full sentence when
 * there is one inside the budget.
 */
function clampDescription(text) {
    if (!text || text.length <= DESCRIPTION_LIMIT) return text;

    const clipped = text.slice(0, DESCRIPTION_LIMIT);
    const lastStop = Math.max(
        clipped.lastIndexOf('. '),
        clipped.lastIndexOf('! '),
        clipped.lastIndexOf('? ')
    );

    return lastStop > 0 ? clipped.slice(0, lastStop + 1) : clipped.trimEnd();
}