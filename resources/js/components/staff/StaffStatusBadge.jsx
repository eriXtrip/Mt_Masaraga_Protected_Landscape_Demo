const STATUS_CLASSES = {
    Available: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Limited: 'border-amber-200 bg-amber-50 text-amber-800',
    Full: 'border-red-200 bg-red-50 text-red-800',
    Upcoming: 'border-amber-200 bg-amber-50 text-amber-800',
    Pending: 'border-amber-200 bg-amber-50 text-amber-800',
    Confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    'Checked in': 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Completed: 'border-outline-variant/50 bg-surface-container-high text-on-surface-variant',
    Cancelled: 'border-red-200 bg-red-50 text-red-800',
    Rejected: 'border-red-200 bg-red-50 text-red-800',
    'Pending check-in': 'border-amber-200 bg-amber-50 text-amber-800',
    'Needs follow-up': 'border-amber-200 bg-amber-50 text-amber-800',
    Open: 'border-red-200 bg-red-50 text-red-800',
    Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
};

export default function StaffStatusBadge({ status, label }) {
    const value = label || status || 'Unknown';
    return (
        <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_CLASSES[status] || STATUS_CLASSES.Completed}`}>
            {value}
        </span>
    );
}
