import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Wallet, TrendingUp, ChevronRight } from 'lucide-react';

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function RevenueRow({ trail, bookings, isTotal = false }) {
    const revenue = bookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);
    const count = bookings.length;
    const hikers = bookings.reduce((sum, b) => sum + (b.participants || 0), 0);

    const feeBreakdown = bookings.reduce((acc, booking) => {
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

    if (isTotal) {
        return (
            <tr className="border-t border-outline-variant/40 bg-surface-container-low/30 font-bold">
                <td className="px-4 py-3 text-sm text-on-surface">Total</td>
                <td className="px-4 py-3 text-sm text-on-surface">{count}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{hikers}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{formatter.format(revenue)}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{formatter.format(feeBreakdown.environmental || 0)}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{formatter.format(feeBreakdown.guide || 0)}</td>
                <td className="px-4 py-3 text-sm text-on-surface">{formatter.format(feeBreakdown.processing || 0)}</td>
            </tr>
        );
    }

    return (
        <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
            <td className="px-4 py-3 text-sm font-medium text-on-surface">{trail}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{count}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{hikers}</td>
            <td className="px-4 py-3 text-sm font-semibold text-on-surface">{formatter.format(revenue)}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{formatter.format(feeBreakdown.environmental || 0)}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{formatter.format(feeBreakdown.guide || 0)}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{formatter.format(feeBreakdown.processing || 0)}</td>
        </tr>
    );
}

function FillRateRow({ trail, capacity, booked }) {
    const fillRate = capacity ? Math.round((booked / capacity) * 100) : 0;
    const badge = fillRate >= 90 ? 'bg-red-50 text-red-700 border-red-200' : fillRate >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

    return (
        <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
            <td className="px-4 py-3 text-sm font-medium text-on-surface">{trail}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{capacity}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{booked}</td>
            <td className="px-4 py-3 text-sm text-on-surface-variant">{capacity - booked}</td>
            <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {fillRate}%
                </span>
            </td>
            <td className="px-4 py-3 text-sm">
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${fillRate}%` }} />
                </div>
            </td>
        </tr>
    );
}

export default function ReportsList({ bookings, schedules, selectedTrail = 'all' }) {
    const trailBookings = {};
    bookings.forEach((booking) => {
        if (!trailBookings[booking.trail]) {
            trailBookings[booking.trail] = [];
        }
        trailBookings[booking.trail].push(booking);
    });

    const trails = selectedTrail === 'all' ? Object.keys(trailBookings) : [selectedTrail];

    const trailStats = {};
    schedules.forEach((schedule) => {
        if (!trailStats[schedule.trail]) {
            trailStats[schedule.trail] = { capacity: 0, booked: 0 };
        }
        trailStats[schedule.trail].capacity += schedule.capacity || 0;
        trailStats[schedule.trail].booked += schedule.booked || 0;
    });

    const filteredTrails = selectedTrail === 'all' ? Object.keys(trailStats) : [selectedTrail];

    return (
        <div className="space-y-6">
            <section aria-labelledby="revenue-heading" className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
                <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6 border-b border-outline-variant/20">
                    <p id="revenue-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Revenue by Trail
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                        <thead>
                            <tr className="border-b border-outline-variant/40 bg-surface-container-low/50 text-left">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Trail</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Bookings</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Hikers</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Revenue</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Environmental Fee</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Guide Fee</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Processing Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trails.length > 0 ? (
                                <>
                                    {trails.map((trail) => (
                                        <RevenueRow key={trail} trail={trail} bookings={trailBookings[trail] || []} />
                                    ))}
                                    <RevenueRow isTotal bookings={bookings} />
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-on-surface-variant">
                                        No revenue data for the selected trail.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section aria-labelledby="fillrate-heading" className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
                <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6 border-b border-outline-variant/20">
                    <p id="fillrate-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Trail Fill Rates
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                        <thead>
                            <tr className="border-b border-outline-variant/40 bg-surface-container-low/50 text-left">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Trail</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Capacity</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Booked</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Remaining</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fill Rate</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Visual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrails.length > 0 ? (
                                filteredTrails.map((trail) => (
                                    <FillRateRow
                                        key={trail}
                                        trail={trail}
                                        capacity={trailStats[trail]?.capacity || 0}
                                        booked={trailStats[trail]?.booked || 0}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-on-surface-variant">
                                        No fill rate data for the selected trail.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}