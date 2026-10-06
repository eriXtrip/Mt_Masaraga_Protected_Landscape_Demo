import { Link } from 'react-router-dom';
import { LEGAL_PAGES } from '../../mockData';
import { useAdminStore } from '../../state/adminStore';

function formatLastUpdated(value) {
    if (!value) return '';

    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-PH', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

function getLegalPage(settings, pageKey) {
    const fallbackPage = LEGAL_PAGES[pageKey];
    const currentPage = settings?.legal?.[pageKey];

    if (!currentPage) return fallbackPage;

    return {
        ...fallbackPage,
        ...currentPage,
        introductoryContent: Array.isArray(currentPage.introductoryContent)
            ? currentPage.introductoryContent
            : fallbackPage?.introductoryContent ?? [],
        sections: Array.isArray(currentPage.sections)
            ? currentPage.sections
            : fallbackPage?.sections ?? [],
    };
}

export function LegalContent({ pageKey }) {
    const { settings } = useAdminStore();
    const page = getLegalPage(settings, pageKey);

    if (!page) return null;

    return (
        <>
            {page.introductoryContent.map((item, itemIndex) => {
                if (item.type === 'paragraph') {
                    return (
                        <p
                            key={`intro-paragraph-${itemIndex}`}
                            className="text-body-md leading-relaxed text-on-surface-variant"
                        >
                            {item.text}
                        </p>
                    );
                }

                if (item.type === 'list') {
                    return <PolicyList key={`intro-list-${itemIndex}`} items={Array.isArray(item.items) ? item.items : []} />;
                }

                return null;
            })}
            {page.sections.map((section, sectionIndex) => (
                <PolicySection key={`section-${sectionIndex}`} title={section.title}>
                    {(Array.isArray(section.content) ? section.content : []).map((item, itemIndex) => {
                        if (item.type === 'paragraph') {
                            return <p key={`paragraph-${itemIndex}`}>{item.text}</p>;
                        }

                        if (item.type === 'list') {
                            return <PolicyList key={`list-${itemIndex}`} items={Array.isArray(item.items) ? item.items : []} />;
                        }

                        return null;
                    })}
                </PolicySection>
            ))}
        </>
    );
}

export default function LegalPageLayout({ pageKey, title, subtitle, eyebrow, lastUpdated, children }) {
    const { settings } = useAdminStore();
    const page = getLegalPage(settings, pageKey);
    const resolvedTitle = page?.title || title;
    const resolvedSubtitle = page && page.subtitle !== undefined ? page.subtitle : subtitle;
    const resolvedLastUpdated = page?.lastUpdated ? formatLastUpdated(page.lastUpdated) : lastUpdated;
    const content = children ?? (pageKey ? <LegalContent pageKey={pageKey} /> : null);

    if (page?.enabled === false) {
        return (
            <section className="relative w-full px-6 pt-10 pb-6 md:px-5 lg:px-10">
                <div className="mx-auto max-w-3xl pt-16 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Policy notice</p>
                    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">{resolvedTitle}</h1>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant md:text-base">
                        This policy is temporarily unavailable. Please contact the park office if you need information about this topic.
                    </p>
                    <Link
                        to="/contact"
                        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-on-secondary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        Contact the park office
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full px-6 pt-10 pb-6 md:px-5 lg:px-10">
            <div className="mx-auto max-w-4xl pt-5">
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
                    {resolvedTitle}
                </h1>

                {resolvedSubtitle && (
                    <p className="mt-3 text-lg font-medium text-primary">
                        {resolvedSubtitle}
                    </p>
                )}

                {resolvedLastUpdated && (
                    <p className="mt-3 text-sm text-on-surface-variant">
                        Last updated: {resolvedLastUpdated}
                    </p>
                )}

                <div className="mt-8 border-t border-outline-variant/40" />

                <div className="mt-8 space-y-8 text-on-surface">
                    {content}
                </div>

                <div className="mt-12 border-t border-outline-variant/40" />

                <div className="mt-8 flex justify-center pb-16">
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </section>
    );
}

/* Reusable subcomponents for consistent policy sectioning */

export function PolicySection({ title, children }) {
    return (
        <div>
            {title && (
                <h2 className="mb-3 text-headline-lg font-bold text-on-surface sm:text-2xl">
                    {title}
                </h2>
            )}
            <div className="space-y-4 text-body-md leading-relaxed text-on-surface-variant">
                {children}
            </div>
        </div>
    );
}

export function PolicyList({ items }) {
    return (
        <ul className="ml-5 list-outside list-disc space-y-2 text-body-md leading-relaxed text-on-surface-variant">
            {items.map((item, i) => (
                <li key={i} className="pl-1">
                    {item}
                </li>
            ))}
        </ul>
    );
}
