/**
 * Single source of truth for everything that leaves the browser: canonical
 * URLs, Open Graph tags, JSON-LD `@id` values, sitemap.xml, and the Sitemap
 * line in robots.txt.
 *
 * This module is imported by `vite.config.js` as well as by the app, so it must
 * stay free of asset imports and browser-only globals.
 *
 * Contact details mirror `ADMIN_SETTINGS` in `resources/js/mockData.js`. That
 * file imports images and icon components, which Node cannot resolve, so the
 * values are repeated here instead of imported. Update both together.
 */

/**
 * THE ONE VALUE TO SET BEFORE DEPLOYING.
 *
 * Empty by default on purpose. An empty origin degrades every absolute URL back
 * to a site-relative path rather than publishing a canonical tag that points at
 * a domain this build does not own. A development-only warning fires while it
 * is blank.
 *
 * Example: 'https://masaraga.example.gov.ph' (no trailing slash)
 */
export const SITE_ORIGIN = '';

export const SITE_NAME = 'Mt. Masaraga Protected Landscape';
export const SITE_SHORT_NAME = 'Mt. Masaraga';
export const SITE_TAGLINE = 'Permits, trail schedules, and visitor information for Mt. Masaraga, Ligao City, Albay.';
export const SITE_DESCRIPTION =
    'Permits, trail schedules, and park updates for Mt. Masaraga Protected Landscape in Ligao City, Albay, managed by DENR and the PAMB.';

// BCP 47 tag for the document, Open Graph locale for the page.
export const SITE_LANG = 'en-PH';
export const SITE_LOCALE = 'en_PH';

export const TITLE_TEMPLATE = '%s | Mt. Masaraga Protected Landscape';

// Shown as og:image when a page has no better one. 1200x630 is the size
// Facebook, LinkedIn, and Slack crop to, so it is the size to author.
export const DEFAULT_OG_IMAGE = '/images/home/MtMasaraga.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'Mt. Masaraga rising above the Albay plain, seen from the lower slopes.';

/**
 * The publishing entity. Values come from ADMIN_SETTINGS in mockData.js.
 * `sameAs` is the official-profile list that search engines use to confirm the
 * organization is the one it already knows. Only non-empty profiles belong
 * here; ADMIN_SETTINGS ships empty Instagram and X strings, and an empty
 * sameAs entry is worse than a missing one.
 */
export const ORGANIZATION = {
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    officeName: 'DENR/PAMB Local Office',
    streetAddress: 'Brgy. Amtic',
    addressLocality: 'Ligao City',
    addressRegion: 'Albay',
    addressCountry: 'PH',
    supportEmail: 'support@masaraga.gov.ph',
    officePhone: '+63 (52) 123-4567',
    emergencyPhone: '+63 917-EMS-SAFE',
    latitude: 13.31859,
    longitude: 123.59756,
    mapUrl: 'https://maps.app.goo.gl/393u11nnWZpdLjB69',
    sameAs: ['https://m.me/MtMasaragaProtectedLandscape'],
    parentOrganization: 'Department of Environment and Natural Resources (DENR)',
    parentOrganizationUrl: 'https://denr.gov.ph/',
};

/**
 * Paths listed in sitemap.xml. Only routes that are indexable, have a stable
 * URL, and are reachable by a link from another page belong here.
 *
 * Deliberately absent: `/trail` (redirects to `/`), `/admin/*` and `/staff/*`
 * (noindex), and the transactional or per-visitor routes (`/login`,
 * `/signup`, `/forgot-password`, `/booking*`, `/lookup`, `/hiker/passes`).
 *
 * The `news` and `awards` entries duplicate ids from `NEWS` and `AWARDS` in
 * mockData.js for the same import reason as ORGANIZATION above. A new article
 * or award needs its id added here or it will not be submitted for indexing.
 */
export const SITEMAP_PATHS = [
    '/',
    '/about',
    '/trail/amtic',
    '/trail/ligao',
    '/help',
    '/contact',
    '/news/scheduled-trail-maintenance',
    '/news/favorable-climbing-conditions',
    '/news/new-online-permit-system',
    '/awards/denr-pamb-recognition-2023',
    '/awards/eco-tourism-excellence',
    '/awards/iso-14001-certified',
    '/legal/privacy-policy',
    '/legal/cookie-policy',
    '/legal/ecotourism-policy',
    '/legal/wildlife-protection',
    '/legal/terms-conditions',
    '/legal/disclaimer',
    '/legal/refund-policy',
];