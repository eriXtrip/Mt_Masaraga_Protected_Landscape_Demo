import { parse } from 'date-fns';
import { AWARDS, FAQ_CATEGORIES, NEWS, TRAILS } from '../mockData';
import {
    DEFAULT_OG_IMAGE,
    ORGANIZATION,
    SITE_DESCRIPTION,
    SITE_LANG,
    SITE_NAME,
} from '../site.config';
import { absoluteUrl } from './seo';

/**
 * schema.org builders.
 *
 * These nodes exist for two readers: crawlers that rank, and answer engines that
 * quote. Both need the same thing, which is a claim traceable to a value already
 * in the app. Every field below is read from mockData.js or site.config.js.
 * Nothing is invented here, including coordinates.
 *
 * Deliberate omissions, because the data does not support them:
 *   - aggregateRating: TRAILS carries five mock reviews per trail. Averaging
 *     them would publish a star rating no visitor ever gave.
 *   - openingHoursSpecification and priceRange: neither is modelled.
 *   - award and hasCredential: AWARDS is seeded demo content, including an
 *     ISO 14001 entry with no audit behind it. Emitting those as credentials
 *     would launder a placeholder into a machine-readable compliance claim.
 */

const ORG_ID = `${absoluteUrl('/')}#organization`;
const SITE_URL = absoluteUrl('/');
const LOGO_URL = absoluteUrl('/assets/icon-512.png');

export const schema = {
    organization() {
        const node = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': ORG_ID,
            name: ORGANIZATION.name,
            alternateName: ORGANIZATION.alternateName,
            description: SITE_DESCRIPTION,
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: LOGO_URL,
                caption: ORGANIZATION.name,
            },
            image: absoluteUrl(DEFAULT_OG_IMAGE),
            address: {
                '@type': 'PostalAddress',
                streetAddress: ORGANIZATION.streetAddress,
                addressLocality: ORGANIZATION.addressLocality,
                addressRegion: ORGANIZATION.addressRegion,
                addressCountry: ORGANIZATION.addressCountry,
            },
            contactPoint: [
                {
                    '@type': 'ContactPoint',
                    contactType: 'permit and booking support',
                    email: ORGANIZATION.supportEmail,
                    telephone: ORGANIZATION.officePhone,
                    areaServed: ORGANIZATION.addressCountry,
                    availableLanguage: ['en', 'fil'],
                },
                {
                    '@type': 'ContactPoint',
                    contactType: 'mountain emergency line',
                    telephone: ORGANIZATION.emergencyPhone,
                    areaServed: ORGANIZATION.addressCountry,
                    availableLanguage: ['en', 'fil'],
                    hoursAvailable: {
                        '@type': 'OpeningHoursSpecification',
                        opens: '00:00',
                        closes: '23:59',
                    },
                },
            ],
            parentOrganization: {
                '@type': 'GovernmentAgency',
                name: ORGANIZATION.parentOrganization,
                url: ORGANIZATION.parentOrganizationUrl,
            },
            hasMap: ORGANIZATION.mapUrl,
        };

        if (ORGANIZATION.sameAs.length > 0) node.sameAs = ORGANIZATION.sameAs;

        return node;
    },

    webSite() {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            inLanguage: SITE_LANG,
            publisher: { '@id': ORG_ID },
        };
    },

    /**
     * The protected area itself. Typed as `Place` because schema.org has no
     * protected-area type, and a wrong specific type is worse than an honest
     * generic one.
     */
    protectedLandscape() {
        return {
            '@context': 'https://schema.org',
            '@type': 'Place',
            '@id': `${SITE_URL}#protected-landscape`,
            name: SITE_NAME,
            alternateName: ORGANIZATION.alternateName,
            description:
                'A protected landscape in Ligao City, Albay covering the 1,328-metre inactive stratovolcano Mt. Masaraga, its mossy forest slopes, natural springs, and the Vanishing Falls.',
            url: SITE_URL,
            image: absoluteUrl(DEFAULT_OG_IMAGE),
            address: {
                '@type': 'PostalAddress',
                addressLocality: ORGANIZATION.addressLocality,
                addressRegion: ORGANIZATION.addressRegion,
                addressCountry: ORGANIZATION.addressCountry,
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: ORGANIZATION.latitude,
                longitude: ORGANIZATION.longitude,
            },
            hasMap: ORGANIZATION.mapUrl,
            publicAccess: true,
            managingOrganization: { '@id': ORG_ID },
        };
    },

    /** One trail page. trail is a TRAILS[id] entry. */
    trail(trail) {
        if (!trail) return null;

        const pageUrl = absoluteUrl(`/trail/${trail.id}`);
        const summit = readStat(trail, 'elevation');

        return {
            '@context': 'https://schema.org',
            '@type': 'TouristAttraction',
            '@id': `${pageUrl}#trail`,
            name: trail.name,
            description: trail.description,
            url: pageUrl,
            image: absoluteUrl(trail.image),
            address: {
                '@type': 'PostalAddress',
                addressLocality: ORGANIZATION.addressLocality,
                addressRegion: ORGANIZATION.addressRegion,
                addressCountry: ORGANIZATION.addressCountry,
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: ORGANIZATION.latitude,
                longitude: ORGANIZATION.longitude,
            },
            // Entry needs a permit and carries a per-hiker fee, so it is not free.
            publicAccess: true,
            isAccessibleForFree: false,
            keywords: [trail.difficulty, trail.trailClass, trail.technicality].filter(Boolean).join(', '),
            additionalProperty: [
                statProperty('Summit elevation', summit, 'M'),
                statProperty('Typical ascent time', trail.stats?.find((s) => s.id === 'duration')?.value),
                statProperty('Route length', trail.stats?.find((s) => s.id === 'distance')?.value),
            ].filter(Boolean),
            provider: { '@id': ORG_ID },
        };
    },

    /** Every trail as one list, for the home page. */
    trailList() {
        const trails = Object.values(TRAILS).filter(Boolean);

        return {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            '@id': `${SITE_URL}#trail-list`,
            name: 'Registered hiking trails in Mt. Masaraga Protected Landscape',
            numberOfItems: trails.length,
            itemListElement: trails.map((trail, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: trail.name,
                url: absoluteUrl(`/trail/${trail.id}`),
            })),
        };
    },

    /**
     * FAQPage built from FAQ_CATEGORIES, which is also what /help renders, so the
     * markup and the visible text cannot drift apart.
     */
    faqPage() {
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${absoluteUrl('/help')}#faq`,
            mainEntity: FAQ_CATEGORIES.flatMap((category) =>
                category.items.map((item) => ({
                    '@type': 'Question',
                    name: item.question,
                    acceptedAnswer: { '@type': 'Answer', text: item.answer },
                }))
            ),
        };
    },

    /** A news article page. article is a NEWS entry. */
    newsArticle(article) {
        if (!article) return null;

        const pageUrl = absoluteUrl(`/news/${article.id}`);
        const published = isoDate(article.date);

        return {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            '@id': `${pageUrl}#article`,
            headline: article.title,
            description: article.leadParagraph,
            mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
            url: pageUrl,
            image: [article.leadImage],
            articleSection: article.category,
            ...(published ? { datePublished: published } : {}),
            author: { '@id': ORG_ID },
            publisher: { '@id': ORG_ID },
        };
    },

    /**
     * An award page. Typed as Article rather than a CreativeWork carrying award
     * metadata: the page text already states the recognition, and AWARDS is
     * seeded demo content.
     */
    awardArticle(award) {
        if (!award) return null;

        const pageUrl = absoluteUrl(`/awards/${award.id}`);
        const received = isoDate(award.dateReceived);

        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${pageUrl}#article`,
            headline: award.name,
            description: award.summary,
            mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
            url: pageUrl,
            image: [award.image],
            ...(received ? { datePublished: received } : {}),
            author: { '@id': ORG_ID },
            publisher: { '@id': ORG_ID },
        };
    },

    /** crumbs is [{ name, path }]; the last entry is the current page. */
    breadcrumbs(crumbs) {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                ...(crumb.path && index < crumbs.length - 1
                    ? { item: absoluteUrl(crumb.path) }
                    : {}),
            })),
        };
    },
};

/** Shared by the route resolvers so they do not each walk the arrays. */
export const findNews = (id) => NEWS.find((item) => item.id === id);
export const findAward = (id) => AWARDS.find((item) => item.id === id);

function statProperty(name, value, unitText) {
    if (!value) return null;

    return {
        '@type': 'PropertyValue',
        name,
        value,
        ...(unitText ? { unitText } : {}),
    };
}

/** Pull a value out of a TRAILS stats array by id, e.g. 'elevation'. */
function readStat(trail, statId) {
    const stat = trail.stats?.find((entry) => entry.id === statId);
    if (!stat) return null;

    const parsed = Number.parseFloat(String(stat.value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Convert the 'Oct 24, 2024' display strings used across mockData into the ISO
 * 8601 timestamps JSON-LD and article:published_time require. Returns null
 * rather than guessing, because an unparseable date must not become a wrong
 * published date.
 */
export function isoDate(value) {
    if (!value) return null;

    const parsed = parse(value, 'MMM d, yyyy', new Date());
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.toISOString();
}
