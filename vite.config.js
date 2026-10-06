import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { SITE_ORIGIN, SITEMAP_PATHS } from './resources/js/site.config.js';

/**
 * The three front-end entry points, mirroring the Laravel blade layouts that
 * were removed during extraction:
 *
 *   index.html   -> public site    (resources/js/app.jsx)   -> mount #app
 *   admin.html   -> admin console  (resources/js/admin.jsx) -> mount #admin-app
 *   staff.html   -> staff console  (resources/js/staff.jsx) -> mount #staff-app
 */
const CONSOLE_ROUTES = [
    { prefix: '/admin', entry: '/admin.html' },
    { prefix: '/staff', entry: '/staff.html' },
];

/**
 * Laravel used to route `/admin/{path?}` and `/staff/{path?}` to their own
 * blade layouts. A static host has no router, so deep links such as
 * `/admin/dashboard` are mapped back onto the matching HTML entry here for
 * both the dev server and `vite preview`.
 *
 * The trailing path is dropped rather than appended: the browser address bar
 * keeps `/admin/dashboard`, which is exactly what React Router reads to pick
 * the route. Only the query string is carried over.
 */
function consoleRouting() {
    const rewrite = (req, _res, next) => {
        const rawUrl = req.url || '/';
        const [path, query] = rawUrl.split('?');

        const match = CONSOLE_ROUTES.find(
            ({ prefix }) => path === prefix || path.startsWith(`${prefix}/`)
        );

        if (match) {
            req.url = query ? `${match.entry}?${query}` : match.entry;
        }

        next();
    };

    return {
        name: 'demo-console-routing',
        configureServer(server) {
            server.middlewares.use(rewrite);
        },
        configurePreviewServer(server) {
            server.middlewares.use(rewrite);
        },
    };
}

/**
 * Static hosts differ in how they fall back to the SPA shell. Emit the two
 * conventions that cover most of them:
 *   404.html    - GitHub Pages (serves this for any unmatched path)
 *   _redirects  - Netlify / Cloudflare Pages (200 rewrites, console-aware)
 */
function staticHostFallback(outDir) {
    return {
        name: 'demo-static-host-fallback',
        apply: 'build',
        closeBundle() {
            const shell = readFileSync(resolve(outDir, 'index.html'), 'utf8');

            writeFileSync(resolve(outDir, '404.html'), shell);

            writeFileSync(
                resolve(outDir, '_redirects'),
                [
                    '/admin/*  /admin.html  200',
                    '/staff/*  /staff.html  200',
                    '/*        /index.html  200',
                    '',
                ].join('\n')
            );
        },
    };
}

/**
 * sitemap.xml and the robots.txt Sitemap directive.
 *
 * Both are skipped while SITE_ORIGIN is empty. A sitemap has to carry absolute
 * URLs, so an unconfigured build would either advertise the wrong domain or
 * emit relative <loc> values, which is worse than shipping nothing.
 *
 * The Disallow rules stay in public/robots.txt where they can be read and edited
 * without running a build.
 */
function crawlFiles(outDir) {
    const robotsPath = resolve(outDir, 'robots.txt');

    function appendSitemapDirective() {
        if (!existsSync(robotsPath)) return;

        // Strip any previous directive so repeated builds cannot stack them.
        const rules = readFileSync(robotsPath, 'utf8')
            .split('\n')
            .filter((line) => !/^\s*Sitemap:/i.test(line))
            .join('\n')
            .replace(/\n{3,}/g, '\n\n')
            .trimEnd();

        const directive = SITE_ORIGIN
            ? `\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
            : '\n';

        writeFileSync(robotsPath, `${rules}${directive}`);
    }

    function writeSitemap() {
        const entries = SITEMAP_PATHS.map(
            (path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`
        ).join('\n');

        writeFileSync(
            resolve(outDir, 'sitemap.xml'),
            [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                entries,
                '</urlset>',
                '',
            ].join('\n')
        );
    }

    /**
     * The shell advertises <link rel="sitemap"> so the sitemap is discoverable
     * without reading robots.txt. Without an origin no sitemap is emitted, so
     * the link is removed rather than left pointing at a 404. 404.html is a copy
     * of the shell, and it is patched too so the two do not disagree.
     */
    function dropSitemapLink() {
        for (const file of ['index.html', '404.html']) {
            const shellPath = resolve(outDir, file);
            if (!existsSync(shellPath)) continue;

            writeFileSync(
                shellPath,
                readFileSync(shellPath, 'utf8').replace(/[ \t]*<link rel="sitemap"[^>]*>\r?\n/g, '')
            );
        }
    }

    return {
        name: 'demo-crawl-files',
        apply: 'build',
        closeBundle() {
            appendSitemapDirective();

            if (!SITE_ORIGIN) {
                dropSitemapLink();
                this.warn(
                    'SITE_ORIGIN is empty in resources/js/site.config.js: skipped sitemap.xml, the robots.txt Sitemap line, ' +
                        'and the sitemap link in the HTML shell. Canonical URLs, Open Graph URLs, and JSON-LD ids also stay ' +
                        'relative until it is set.'
                );
                return;
            }

            writeSitemap();
        },
    };
}

function absoluteUrl(path) {
    return new URL(path, SITE_ORIGIN).toString().replace(/&/g, '&amp;');
}

export default defineConfig(({ command }) => {
    const outDir = resolve(__dirname, 'dist');

    return {
        resolve: {
            alias: {
                '@': resolve(__dirname, 'resources/js'),
            },
        },
        plugins: [
            react({ include: /\.(js|jsx|ts|tsx)$/ }),
            tailwindcss(),
            consoleRouting(),
            ...(command === 'build' ? [staticHostFallback(outDir), crawlFiles(outDir)] : []),
        ],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            hmr: {
                host: 'localhost',
            },
        },
        preview: {
            host: '0.0.0.0',
            port: 4173,
            strictPort: true,
        },
        build: {
            outDir,
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    admin: resolve(__dirname, 'admin.html'),
                    staff: resolve(__dirname, 'staff.html'),
                },
            },
        },
    };
});
