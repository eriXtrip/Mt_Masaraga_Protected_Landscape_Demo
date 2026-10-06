import { MapPin, Users, Wallet, TrendingUp, CalendarCheck, ExternalLink } from 'lucide-react';

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const getFillRateBadge = (rate) => {
    if (rate >= 90) return 'bg-red-50 text-red-700 border-red-200';
    if (rate >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

export default function ReportsCard({ trail, bookings, schedules, onViewDetails }) {
    const trailBookings = bookings.filter((b) => b.trail === trail);
    const trailSchedules = schedules.filter((s) => s.trail === trail);

    const totalRevenue = trailBookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);
    const bookingCount = trailBookings.length;
    const hikerCount = trailBookings.reduce((sum, b) => sum + (b.participants || 0), 0);

    const feeBreakdown = trailBookings.reduce((acc, booking) => {
        booking.feeBreakdown?.forEach((fee) => {
            const label = fee.label.toLowerCase();
            if (label.includes('environmental')) {
                acc.environmental = (acc.environmental || 0) + fee.amount;
            } else if (label.includes('guide')) {
                acc.guide = (acc.guide || 0) + fee.amount;
            } else if (label.includes('processing')) {
                acc.processing = (acc.processing || 0) + fee.amount;
            }
        });
        return acc;
    }, {});

    const totalCapacity = trailSchedules.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalBooked = trailSchedules.reduce((sum, s) => sum + (s.booked || 0), 0);
    const fillRate = totalCapacity ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <MapPin className="h-4.5 w-4.5" />
                        </span>
                        <div>
                            <p className="text-sm font-bold text-on-surface">{trail}</p>
                            <p className="text-xs text-on-surface-variant">{bookingCount} bookings · {hikerCount} hikers</p>
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getFillRateBadge(fillRate)}`}>
                        {fillRate}% filled
                    </span>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Revenue</p>
                    <p className="mt-1 text-lg font-bold text-on-surface">{formatter.format(totalRevenue)}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Environmental Fee</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">{formatter.format(feeBreakdown.environmental || 0)}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Guide Fee</p>
                    <p className="mt-1 text-lg font-bold text-blue-600">{formatter.format(feeBreakdown.guide || 0)}</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Processing Fee</p>
                    <p className="mt-1 text-lg font-bold text-amber-600">{formatter.format(feeBreakdown.processing || 0)}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Capacity</p>
                    <p className="mt-1 text-lg font-bold text-on-surface">{totalCapacity} slots</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">{totalBooked} booked · {totalCapacity - totalBooked} left</p>
                </div>
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Fill Rate</p>
                    <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-container-high">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${fillRate}%` }} />
                        </div>
                        <span className={`shrink-0 text-sm font-bold ${fillRate >= 90 ? 'text-red-600' : fillRate >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {fillRate}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => onViewDetails?.(trail)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                >
                    View details
                    <ExternalLink className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}