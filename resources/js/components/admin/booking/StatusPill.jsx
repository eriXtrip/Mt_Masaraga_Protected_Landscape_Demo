import { STATUS_CONFIG } from './bookingUtils';

function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

export default StatusPill;