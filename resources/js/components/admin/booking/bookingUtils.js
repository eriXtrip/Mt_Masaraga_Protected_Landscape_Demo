export const STATUS_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled', 'Refunded'];

export const SCHEDULE_STATUS_BADGE = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Limited: 'bg-amber-50 text-amber-700 border-amber-200',
    Full: 'bg-red-50 text-red-700 border-red-200',
};

export const STATUS_CONFIG = {
    Upcoming: { label: 'Upcoming', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    Completed: { label: 'Completed', text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' },
    Cancelled: { label: 'Cancelled', text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
    Refunded: { label: 'Refunded', text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

export const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const getInitials = (name) => {
    if (!name) return 'B';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatDateLabel = (date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const getDateKey = (date) => new Date(date).toLocaleDateString('en-CA');

export function getRefundNotice(hikeDate) {
    const climb = new Date(hikeDate);
    if (!Number.isNaN(climb.getTime())) {
        const daysUntil = Math.ceil((climb.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        if (daysUntil >= 2) {
            return 'Full base fee refunded, minus the non-refundable ₱50 processing fee.';
        }
        if (daysUntil === 1) {
            return '50% of the base fee refunded, minus the non-refundable ₱50 processing fee.';
        }
    }
    return 'No refund applies less than 24 hours before the scheduled climb.';
}

export function getRefundAmount(booking) {
    const processingFee = booking.feeBreakdown?.find((fee) => fee.label === 'Processing fee')?.amount ?? 50;
    const baseFee = booking.totalPaid - processingFee;
    const climb = new Date(booking.date);
    if (Number.isNaN(climb.getTime())) return 0;
    const daysUntil = Math.ceil((climb.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    if (daysUntil >= 2) return baseFee;
    if (daysUntil === 1) return Math.round(baseFee / 2);
    return 0;
}