import { Activity, FileCheck2, LifeBuoy, Settings2 } from 'lucide-react';

function formatDateTime(value) {
    if (!value) return 'No changes yet';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'No changes yet';

    return new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

export default function SettingsSummary({ settings = {}, auditLog = [] }) {
    const legalPages = Object.values(settings.legal || {});
    const publishedPolicies = legalPages.filter((page) => page.enabled).length;
    const contactChannels = [
        settings.contact?.supportEmail,
        settings.contact?.officePhone,
        settings.contact?.emergencyPhone,
    ].filter(Boolean).length;
    const maintenanceEnabled = Boolean(settings.maintenance?.enabled);
    const bookingSuspended = Boolean(settings.utility?.bookingSuspended?.enabled);
    const latestAudit = auditLog[0];

    const summaries = [
        {
            icon: Activity,
            value: maintenanceEnabled ? 'Maintenance' : bookingSuspended ? 'Booking paused' : 'Live',
            label: 'Public site',
            sub: maintenanceEnabled
                ? 'Maintenance page is active'
                : bookingSuspended
                    ? 'New reservations are paused'
                    : 'Public pages are available',
            tone: maintenanceEnabled || bookingSuspended ? 'warning' : 'success',
        },
        {
            icon: FileCheck2,
            value: `${publishedPolicies}/${legalPages.length}`,
            label: 'Published policies',
            sub: 'Legal pages currently visible',
            tone: 'neutral',
        },
        {
            icon: LifeBuoy,
            value: String(contactChannels),
            label: 'Contact channels',
            sub: 'Email and phone channels configured',
            tone: 'neutral',
        },
        {
            icon: Settings2,
            value: formatDateTime(latestAudit?.createdAt),
            label: 'Last settings change',
            sub: `${auditLog.length} recorded ${auditLog.length === 1 ? 'change' : 'changes'}`,
            tone: 'neutral',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" role="region" aria-label="Settings summary">
            {summaries.map((summary) => {
                const Icon = summary.icon;
                const valueTone = summary.tone === 'warning'
                    ? 'text-amber-700 dark:text-amber-300'
                    : summary.tone === 'success'
                        ? 'text-primary'
                        : 'text-on-surface';

                return (
                    <article key={summary.label} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{summary.label}</p>
                                <p className={`mt-2 truncate text-xl font-bold tracking-tight md:text-2xl ${valueTone}`}>{summary.value}</p>
                                <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{summary.sub}</p>
                            </div>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
