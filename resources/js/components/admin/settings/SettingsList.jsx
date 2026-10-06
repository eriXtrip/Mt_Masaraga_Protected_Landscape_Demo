import { CalendarX, Compass, FileText, Globe2, History, Phone, LifeBuoy, Mountain, ShieldAlert, SlidersHorizontal, Wrench } from 'lucide-react';
import SettingsCard from './SettingsCard';

function formatDate(value) {
    if (!value) return 'No date set';

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

function formatDateTime(value) {
    if (!value) return 'Unknown time';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Unknown time';

    return new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

function getItems(activeSection, settings) {
    if (activeSection === 'general') {
        return [{
            key: 'site',
            group: 'general',
            icon: Globe2,
            eyebrow: 'General',
            title: 'Site identity',
            description: 'The public name and office details shown across the park website.',
            value: settings.general?.siteName || 'Site name not set',
            detail: settings.general?.officeHours || 'Office hours not set',
            status: 'Configured',
            statusTone: 'success',
        }];
    }

    if (activeSection === 'booking') {
        return [
            {
                key: 'fees',
                group: 'booking',
                icon: SlidersHorizontal,
                eyebrow: 'Booking defaults',
                title: 'Fees',
                description: 'Default amounts used when a new booking or schedule is prepared.',
                value: `₱${settings.booking?.baseFeePerPax ?? 0} base fee / pax`,
                detail: `₱${settings.booking?.environmentalFee ?? 0} environmental · ₱${settings.booking?.processingFee ?? 0} processing`,
                status: 'Configured',
                statusTone: 'success',
            },
            {
                key: 'capacity',
                group: 'booking',
                icon: Mountain,
                eyebrow: 'Booking defaults',
                title: 'Capacity and guide ratio',
                description: 'Default daily capacity and staffing limits for newly published schedules.',
                value: `${settings.booking?.defaultDailyCapacity ?? 0} slots per day`,
                detail: `1 guide : ${settings.booking?.guideRatio ?? 0} hikers · max ${settings.booking?.maxGroupSize ?? 0} per group`,
                status: 'Configured',
                statusTone: 'success',
            },
        ];
    }

    if (activeSection === 'legal') {
        return Object.entries(settings.legal || {}).map(([key, page]) => ({
            key,
            group: 'legal',
            itemKey: key,
            icon: FileText,
            eyebrow: 'Legal page',
            title: page.label,
            description: 'Control publication, footer visibility, policy metadata, and visitor-facing content.',
            value: page.title,
            detail: `${page.sections?.length || 0} editable sections · Updated ${formatDate(page.lastUpdated)}`,
            status: page.enabled ? 'Published' : 'Hidden',
            statusTone: page.enabled ? 'success' : 'neutral',
            href: `/legal/${key}`,
        }));
    }

    if (activeSection === 'utility') {
        return [
            {
                key: 'maintenance',
                group: 'maintenance',
                icon: Wrench,
                eyebrow: 'Utility page',
                title: 'Maintenance mode',
                description: 'Set the public maintenance notice and estimated restoration window.',
                value: settings.maintenance?.enabled ? 'Maintenance active' : 'Site available',
                detail: settings.maintenance?.estimatedCompletion || 'No estimate set',
                status: settings.maintenance?.enabled ? 'Active' : 'Off',
                statusTone: settings.maintenance?.enabled ? 'warning' : 'success',
                href: '/maintenance',
            },
            {
                key: 'bookingSuspended',
                group: 'utility',
                itemKey: 'bookingSuspended',
                icon: CalendarX,
                eyebrow: 'Utility page',
                title: 'Booking suspension',
                description: 'Pause new reservations with a public notice while existing hiker tools remain available.',
                value: settings.utility?.bookingSuspended?.enabled ? 'New bookings suspended' : 'New bookings open',
                detail: settings.utility?.bookingSuspended?.reopenNote || 'No reopening guidance set',
                status: settings.utility?.bookingSuspended?.enabled ? 'Suspended' : 'Open',
                statusTone: settings.utility?.bookingSuspended?.enabled ? 'warning' : 'success',
                href: '/booking-suspended',
            },
            {
                key: 'notFound',
                group: 'utility',
                itemKey: 'notFound',
                icon: Compass,
                eyebrow: 'Utility page',
                title: 'Page not found',
                description: 'Guide visitors who reach an unavailable route back to useful destinations.',
                value: settings.utility?.notFound?.title || 'Not configured',
                detail: settings.utility?.notFound?.message || 'No message set',
                status: settings.utility?.notFound?.enabled ? 'Enabled' : 'Disabled',
                statusTone: settings.utility?.notFound?.enabled ? 'success' : 'neutral',
            },
            {
                key: 'accessDenied',
                group: 'utility',
                itemKey: 'accessDenied',
                icon: ShieldAlert,
                eyebrow: 'Utility page',
                title: 'Access denied',
                description: 'Explain why a restricted page needs clearance and where visitors can go next.',
                value: settings.utility?.accessDenied?.title || 'Not configured',
                detail: settings.utility?.accessDenied?.message || 'No message set',
                status: settings.utility?.accessDenied?.enabled ? 'Enabled' : 'Disabled',
                statusTone: settings.utility?.accessDenied?.enabled ? 'success' : 'neutral',
                href: '/access-denied',
            },
        ];
    }

    if (activeSection === 'contact') {
        return [{
            key: 'contact',
            group: 'contact',
            icon: Phone,
            eyebrow: 'Public contact',
            title: 'Contact channels and map',
            description: 'Keep the contact page, footer, emergency details, and map destination aligned.',
            value: settings.contact?.supportEmail || 'Support email not set',
            detail: `${settings.contact?.officePhone || 'Office phone not set'} · ${settings.contact?.emergencyPhone || 'Emergency phone not set'}`,
            status: settings.contact?.supportEmail ? 'Configured' : 'Needs attention',
            statusTone: settings.contact?.supportEmail ? 'success' : 'warning',
            href: '/contact',
        }];
    }

    return [];
}

function AuditList({ auditLog }) {
    if (auditLog.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest px-6 py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <History className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-on-surface">No settings changes yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-on-surface-variant">
                    Updates made in this admin session will appear here with the section, fields, administrator, and time.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <History className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                    <h3 className="text-base font-bold text-on-surface">Settings change history</h3>
                    <p className="mt-1 text-xs text-on-surface-variant">Newest changes appear first.</p>
                </div>
            </div>
            <ol className="divide-y divide-outline-variant/20">
                {auditLog.map((entry) => (
                    <li key={entry.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-surface">{entry.section}</p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                                Changed: {entry.changedFields.join(', ')}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">By {entry.actor}</p>
                        </div>
                        <time className="shrink-0 text-xs text-on-surface-variant" dateTime={entry.createdAt}>
                            {formatDateTime(entry.createdAt)}
                        </time>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default function SettingsList({ activeSection, settings = {}, auditLog = [], onEdit }) {
    const items = getItems(activeSection, settings);

    return (
        <section id="settings-panel" role="tabpanel" aria-label={`${activeSection} settings`} className="space-y-4">
            {activeSection === 'audit' ? (
                <AuditList auditLog={auditLog} />
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {items.map((item) => (
                        <SettingsCard key={`${item.group}-${item.key}`} item={item} onEdit={onEdit} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest px-6 py-12 text-center">
                    <h3 className="text-base font-bold text-on-surface">No settings available</h3>
                    <p className="mt-2 text-sm text-on-surface-variant">This section does not have any configurable fields yet.</p>
                </div>
            )}
        </section>
    );
}
