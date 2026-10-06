# Mt. Masaraga Protected Landscape (Front-end Demo)

A standalone front-end demo of the Mt. Masaraga Protected Landscape eco-tourism portal. It contains three separate interfaces that were originally served by a Laravel application and are now bundled as static assets:

| Interface | Entry file | Mount point | Base path |
| --- | --- | --- | --- |
| Public site | `index.html` | `#app` | `/` |
| Admin console | `admin.html` | `#admin-app` | `/admin/*` |
| Staff console | `staff.html` | `#staff-app` | `/staff/*` |

There is no backend. Every screen runs on mock data held in the browser.

## Project origin and inspiration

Inspired during an interview with DENR CENRO Guinobatan for a Project Support Assistant (IT) position, where the need for a centralized hiking booking system was discussed, I independently created this front-end demo to demonstrate a potential digital solution for Mt. Masaraga Protected Landscape.

Design & UI/UX: Conceptualized and prototyped in Figma using Google Stitch, with a color palette sampled directly from Mt. Masaraga's natural landscape and lush green rainforest canopy.

## Design system

Every token below is defined once and consumed everywhere through Tailwind v4 theme variables, so there is no second place to change a color or a radius. The source of truth is `resources/css/app.css`.

### Logo

The park logo is supplied artwork and lives in `public/assets/logo/` in three variants. Two are needed because the splash screen centers the mark while every other placement is left-aligned, and the printable surfaces need a raster copy.

| Asset | Used by | Why this variant |
| --- | --- | --- |
| `MT. MASARAGA LOGO.svg` | `Navbar.jsx`, `Footer.jsx`, `AdminSidebar.jsx`, `StaffSidebar.jsx` | Scalable lockup for on-screen chrome at any size |
| `MT. MASARAGA Logo Center.svg` | `SplashScreen.jsx` | Centered artwork for the loading splash |
| `MT. MASARAGA LOGO.png` | `HikerTicketPass.jsx`, `PrintableDocument.jsx`, `DigitalPassDownloadModal.jsx` | Rasterized into the output of `lib/printImage.js` |

The PNG choice is deliberate, not an oversight. `downloadElementAsImage()` in `resources/js/lib/printImage.js` renders a live DOM node to a 300 DPI blob through `html-to-image`, which cannot reliably inline an external SVG. A bundled PNG URL survives that rasterization, which matters because these are the passes and documents a hiker actually prints.

`resources/js/components/brandlogo/` is a different thing entirely: it holds third-party payment and social marks (GCash, Maya, Visa, Mastercard, LandBank, Facebook, Instagram, Messenger, X). It does not contain the park logo.

### Color palette

Sampled from the canopy and the slopes. The dark green carries the brand, the desaturated green-greys carry UI structure, and a single blue marks water and information.

| Role | Token | Value | Used for |
| --- | --- | --- | --- |
| Primary | `--color-primary` | `#39670d` | Forest green. Buttons, links, active nav, scrollbar thumbs |
| Primary container | `--color-primary-container` | `#518127` | Hover and pressed fills on primary surfaces |
| Primary fixed | `--color-primary-fixed` | `#bbf38a` | Persistent chips, badges, chart series 5 |
| On primary | `--color-on-primary` | `#98BBA7` | Text and icons sitting on primary fills |
| Secondary | `--color-secondary` | `#456553` | Muted green. Secondary actions, chart series 2 |
| Tertiary | `--color-tertiary` | `#166284` | Water blue. Informational accents, chart series 3 |
| Background | `--color-background` | `#f1fcf2` | Page canvas, a very pale green tint rather than white |
| Foreground | `--color-foreground` | `#1F362B` | Body text, deep green-black rather than pure black |
| Muted | `--color-muted` | `#e5f1e7` | Secondary surfaces, table stripes |
| Accent | `--color-accent` | `#dae5dc` | Hover fills, sidebars |
| Border | `--color-border` | `#c2c9b7` | Hairlines, dividers, input outlines |
| Error | `--color-destructive` | `#ba1a1a` | Validation failures, destructive actions |

The `chart-1` through `chart-10` scale ramps the same greens and blues from darkest to lightest, so a dashboard with four series and one with ten still read as one system.

Two caveats worth knowing before editing `app.css`:

- The `.dark` block is a neutral grayscale ramp, not a dark counterpart sampled from the landscape, and its `--sidebar-primary` is blue (`oklch(0.488 0.243 264.376)`) while the light theme's is green. Dark mode is functional, not designed.
- `--font-sans` is declared twice: once as Inter in the first `@theme` block and again as Geist Variable in `@theme inline`. The later declaration wins, so Geist Variable is what renders, but the Inter line is dead and worth deleting rather than leaving to mislead the next person.

### Typography

One typeface across the entire product: **Geist Variable**, bundled locally through `@fontsource-variable/geist` and wired to both `font-sans` and `font-heading`. There is no webfont request to a third party and no layout shift from a late font swap.

The scalable axis carries the range from body copy to page titles without a separate display cut, which suits an interface whose headings are field labels as much as they are hero text. `downloadElementAsImage()` passes `skipFonts: true`, so printed passes and documents fall back to the document's own styling rather than embedding the family.

### Shape and spacing

`--radius: 0.625rem` is the single base value. Everything else is a multiple of it, declared once:

| Token | Value |
| --- | --- |
| `--radius-sm` | `0.375rem` (0.6×) |
| `--radius-md` | `0.5rem` (0.8×) |
| `--radius-lg` | `0.625rem` (1×) |
| `--radius-xl` | `0.875rem` (1.4×) |
| `--radius-2xl` | `1.125rem` (1.8×) |
| `--radius-3xl` | `1.375rem` (2.2×) |
| `--radius-4xl` | `1.625rem` (2.6×) |

Consoles sit at the tighter end, cards in the middle, dialogs and sheets at the widest.

## Design and technologies

- Conceptualized and prototyped in Figma using Google Stitch, with the palette sampled directly from Mt. Masaraga's natural landscape.
- Built as a standalone front-end web application with no backend. The full library list is under [Stack](#stack).

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 baseline)
- npm 10+

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does | URL |
| --- | --- | --- |
| `npm run dev` | Vite dev server with HMR | http://localhost:5173 |
| `npm run build` | Production build into `dist/` | |
| `npm run preview` | Serves the built `dist/` | http://localhost:4173 |

Both servers bind to `0.0.0.0` with `strictPort`, so a port conflict fails loudly instead of drifting to another port.

## Trying the demo

Open the **Demo** panel in the bottom-right corner of any page. It lists the demo accounts and what the build cannot do.

Go to `/login` and enter one of these emails. The password field is not read by the demo, so anything works, and the email alone decides which console opens.

| Role | Email | Lands on | Extra check |
| --- | --- | --- | --- |
| Administrator (role 1) | `admin@masaraga.gov.ph` | `/admin/dashboard` | 6-digit security PIN: `123456` |
| Park staff / guide (role 2) | `staff@masaraga.gov.ph` | `/staff/dashboard` | none |
| Hiker (role 3) | `hiker@example.com` | not routed, see below | none |

Sign Up and Forgot Password both ask for a 6-digit verification code. There is no mail delivery, so any 6 digits pass.

### What the demo does not do

- Email confirmation and verification codes
- Server-side validation
- Persistent saving. Changes live in `sessionStorage` and are gone on refresh, and they are not shared between browsers
- Real booking, payment, and pass issuance end to end
- Anything else that needs a live server

## How state is kept

| Key | Store | Holds |
| --- | --- | --- |
| `currentUser` | `localStorage` | The signed-in user object read by the access gates |
| `masaraga_admin_store_v3` | `sessionStorage` | Admin settings, schedules, guides, users |
| `masaraga_staff_store_v1` | `sessionStorage` | Check-in state, assigned groups, field reports |
| `masaraga_hiker_store_v1` | `sessionStorage` | Hiker profile, transactions |
| `masaraga_content_store_v1` | `sessionStorage` | News, gallery, FAQ, awards, announcements |
| `masaraga_demo_notice_expanded` | `localStorage` | Whether the demo panel is open |

Seed data lives in `resources/js/mockData.js`. Each store reads its key on init and falls back to that seed when the key is absent or unparseable, so clearing storage restores a clean demo.

Access is checked client-side by reading `currentUser`: `role === 1` for the admin gate, `role === 2` for the staff gate. Anything else is redirected to `/access-denied`, and a missing user to `/login`. This is a demo convenience, not security.

## Routing on a static host

Laravel used to route `/admin/{path?}` and `/staff/{path?}` to their own blade layouts. A static host has no server router, so deep links such as `/admin/dashboard` need to resolve to the matching HTML entry.

**Dev and preview:** the `demo-console-routing` plugin in `vite.config.js` rewrites `/admin/*` to `/admin.html` and `/staff/*` to `/staff.html`, keeping the query string. The path is dropped rather than appended, so the address bar still reads `/admin/dashboard` and React Router picks the route from it.

**Build:** the `demo-static-host-fallback` plugin writes fallback files into `dist/`.

| Host | File | Behavior |
| --- | --- | --- |
| GitHub Pages | `404.html` | Copy of `index.html`, served for any unmatched path |
| Netlify, Cloudflare Pages | `_redirects` | `/admin/*` and `/staff/*` rewrites, then `/*` to `index.html` |
| Apache | `.htaccess` | `mod_rewrite` rules, written by hand in `public/` and copied into `dist/` by Vite |

`404.html` and `_redirects` are generated at build time. `.htaccess` lives in `public/`, so edit it there rather than in `dist/`, which is wiped on every build.

## Project layout

```
index.html, admin.html, staff.html   HTML entries, one per interface
resources/css/app.css                Tailwind entry, theme tokens
resources/js/
  app.jsx                           Public site router
  admin.jsx                         Admin router and access gate
  staff.jsx                         Staff router and access gate
  mockData.js                       All seed data
  site.config.js                    Site name, origin, organization details, sitemap paths
  admin/navConfig.js                Admin nav groups and section titles
  staff/navConfig.js                Staff nav groups and section titles
  components/
    admin/                          Admin console components by domain
    staff/                          Staff console components
    hiker/                          Hiker-facing components
    common/                         Navbar, footer, splash, demo banner, RouteSeo
    features/                       Booking, payment, passes, documents
    forms/                          Hiker details, payment, messaging
    messaging/                      Conversations and group members
    charts/                         Recharts wrappers
    ui/                             shadcn primitives
    brandlogo/                      Payment and social logos
    icons/, lottiefiles/            Inline SVG icons and animation JSON
  hooks/                            In-view, idle timeout, install prompt
  lib/                              Auth, QR scanning, printing, seo, schema, routeSeo, utils
  pages/                            One folder per public section
  state/                            Store modules, one per console
public/                             Copied verbatim into dist/: images, PWA icons,
                                    logos, three manifests, robots.txt, llms.txt,
                                    favicon, and the Apache .htaccess
dist/                               Build output, not committed
```

Imports resolve `@/` to `resources/js/`, configured in both `jsconfig.json` and `vite.config.js`.

## Public routes

`/` home, `/about`, `/trail`, `/trail/:id`, `/help`, `/contact`, `/login`, `/signup`, `/forgot-password`, `/booking`, `/booking/:id`, `/lookup`, `/hiker/passes`, `/news/:id`, `/awards/:id`, and seven `/legal/*` pages. Standalone views: `404`, `/access-denied`, `/maintenance`, `/booking-suspended`.

Two gates change public behavior from admin settings: enabling maintenance sends every page to `/maintenance`, and enabling `bookingSuspended` sends booking pages to `/booking-suspended`.

## Admin and staff routes

Admin: `dashboard`, `bookings`, `payments`, `trails`, `guides`, `content`, `announcements`, `reports`, `users`, `settings`, all under `/admin/`. Any other `/admin/*` path renders the admin not-found view.

Staff: `dashboard`, `schedules`, `verify`, `bookings`, `groups/:id`, `messages`, `reports`, all under `/staff/`. Any other `/staff/*` path renders the staff not-found view.

## Stack

- React 19 with React Router 7, three independent roots
- Vite 8, Tailwind CSS 4 through the Vite plugin, no PostCSS config file needed
- shadcn on `@base-ui/react` with Lucide icons, styled by CSS variables in `app.css`
- Recharts for dashboard charts, `react-day-picker` for the booking calendar
- `jsqr` plus `html-to-image` for pass scanning, `lottie-react` for animation states
- `date-fns` for date math, `@fontsource-variable/geist` for the bundled font

## SEO and AEO

The three HTML shells can only carry one fixed set of tags, so the public site sets
per-route metadata at runtime. `resources/js/lib/routeSeo.js` holds one entry per
route, `lib/schema.js` builds the JSON-LD, and `lib/seo.js` writes the result into
`document.head`. `components/common/RouteSeo.jsx` calls it on every navigation.

### Set the origin first

```js
// resources/js/site.config.js
export const SITE_ORIGIN = 'https://your-domain.example';
```

This is the only value that must change before deploying. While it is empty the
build is still valid and still warns, but URLs stay relative and the sitemap is
skipped, because a sitemap needs absolute `<loc>` values:

| Output | `SITE_ORIGIN` empty | `SITE_ORIGIN` set |
| --- | --- | --- |
| `dist/sitemap.xml` | not written | written from `SITEMAP_PATHS` |
| `robots.txt` `Sitemap:` line | omitted | absolute URL |
| `<link rel="sitemap">` in the shell | stripped from `dist/index.html` and `dist/404.html` | left in place |
| canonical, `og:url`, `og:image`, JSON-LD ids | relative | absolute |

### What each route gets

| Route | Title and description | Structured data | Robots |
| --- | --- | --- | --- |
| `/` | site defaults | `Organization`, `WebSite`, `Place`, trail `ItemList` | index, follow |
| `/trail/:id` | trail name, stats-based summary | `Organization`, `TouristAttraction`, `BreadcrumbList` | index, follow |
| `/help` | FAQ summary | `FAQPage` (all 8 questions), `BreadcrumbList` | index, follow |
| `/news/:id` | article lead | `NewsArticle` with real `datePublished` | index, follow |
| `/awards/:id` | award name and summary | `Organization`, `Article` | index, follow |
| `/about`, `/contact`, `/legal/*` | per-page copy | `Organization`, `Place` or `BreadcrumbList` | index, follow |
| `/login`, `/signup`, `/booking/*`, `/hiker/*` | page copy | none | noindex, follow |
| unknown `/trail/*`, `/news/*`, `/awards/*` | site defaults | home graph | noindex, follow |

Descriptions are clamped to 160 characters at the source, cutting back to the last
full sentence, so a long copy edit in `mockData.js` cannot silently overflow the
snippet budget.

### Consoles

`admin.html` and `staff.html` carry static `noindex, nofollow, noarchive` tags and
call `applyNoindex()` on load, because both consoles read the signed-in role from
`localStorage` and a crawler that executes nothing would otherwise land on the shell.
`robots.txt` disallows `/admin` and `/staff` as a second layer.

### Answer engine optimization

`public/llms.txt` gives answer engines a plain-text summary of the site, its routes,
and an explicit note that the permit system and schedules are demo data. On-page,
the FAQ content is exposed as `FAQPage`, each article carries its real publication
date, and the schema graph connects every page back to one `Organization`.

No structured data is emitted for ratings, review counts, opening hours, prices, or
the ISO 14001 entry, because the values in `mockData.js` are placeholders. Emitting
them would be structured data for claims the demo cannot back.

### Files

| File | Role |
| --- | --- |
| `resources/js/site.config.js` | origin, site defaults, organization details, sitemap paths |
| `resources/js/lib/routeSeo.js` | per-route title, description, canonical, robots, schema |
| `resources/js/lib/schema.js` | `Organization`, `TouristAttraction`, `FAQPage`, `NewsArticle`, `BreadcrumbList` builders |
| `resources/js/lib/seo.js` | meta, canonical, Open Graph, Twitter, JSON-LD writer |
| `resources/js/components/common/RouteSeo.jsx` | applies it on navigation |
| `public/robots.txt` | crawl rules, editable without a build |
| `public/llms.txt` | answer engine summary |
| `vite.config.js` (`crawlFiles`) | writes `sitemap.xml` and the robots `Sitemap:` line |

## Deploying

```bash
npm run build
```

Set `SITE_ORIGIN` in `resources/js/site.config.js` first, then publish the contents
of `dist/` as a static site. Serve it over HTTPS, since camera access for pass
scanning is unavailable on insecure origins outside `localhost`.

For GitHub Pages, deploy `dist/` from a branch and let the `404.html` fallback handle client-side routing.

## Known gaps

- Login as a hiker redirects to `/hiker/dashboard`, but that route is not registered in `app.jsx`, so the request lands on the 404 view. `pages/hiker/Profile.jsx` and `pages/hiker/transaction.jsx` are likewise unrouted; `/lookup` and `/hiker/passes` are the reachable hiker pages.
- `axios` is listed in `package.json` but nothing imports it. It was left in place for the backend wiring that this demo drops.
- Route metadata is applied by JavaScript after hydration. A crawler that does not execute JavaScript sees only the `index.html` defaults, so titles and descriptions for individual routes depend on the crawler rendering the page. Fixing that properly means prerendering each route at build time, which this demo does not do.

## Legal and image usage disclaimer

This project was built on my own initiative solely as a non-commercial UI/UX design and technical proof of concept. It is not an official government platform. All images, logos, and media belong to their respective owners and are used strictly under fair use for educational and demonstration purposes. No real personal data is collected or stored.