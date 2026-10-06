export const PASS_STATUS = {
    Valid: { label: 'Valid', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    Used: { label: 'Used', dot: 'bg-on-surface-variant/40', text: 'text-on-surface-variant' },
    Cancelled: { label: 'Cancelled', dot: 'bg-red-600', text: 'text-red-700' },
};

export function StatusPill({ status }) {
    const config = PASS_STATUS[status] || { label: status, dot: 'bg-on-surface-variant/40', text: 'text-on-surface-variant' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
