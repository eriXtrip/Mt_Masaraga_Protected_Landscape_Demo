import React from 'react';

const STATUS_CONFIG = {
    Confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    Completed: { label: 'Completed', dot: 'bg-on-surface-variant/40', text: 'text-on-surface-variant' },
    Cancelled: { label: 'Cancelled', dot: 'bg-red-600', text: 'text-red-700' },
};

export default function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, dot: 'bg-on-surface-variant/40', text: 'text-on-surface-variant' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
