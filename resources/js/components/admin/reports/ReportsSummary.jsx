import { Users, Mountain, CalendarCheck, CircleDollarSign, Leaf, UserCheck, Receipt } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useState, useMemo } from 'react';
import { RevenueTwoLevelPieChart } from '@/components/charts';

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function StatCard({ icon: Icon, value, label, sub, trend, trendLabel }) {
    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-5">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col">
                    <p className="text-xl font-bold tracking-tight text-on-surface md:text-2xl">{value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
                </div>

                {trend !== undefined && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {trend >= 0 ? '+' : ''}{trend}% {trendLabel || 'vs last period'}
                    </span>
                )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{sub}</p>
        </div>
    );
}

export default function ReportsSummary({ bookings, schedules, quota, dateRange = 'all' }) {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [selectedTrail, setSelectedTrail] = useState('all');
    const allTrails = useMemo(() => [...new Set(schedules.map((s) => s.trail))].sort(), [schedules]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);
    const totalBookings = bookings.length;
    const totalHikers = bookings.reduce((sum, b) => sum + (b.participants || 0), 0);

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

    const totalCapacity = schedules.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const totalBooked = schedules.reduce((sum, s) => sum + (s.booked || 0), 0);
    const fillRate = totalCapacity ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    const trailStats = {};
    schedules.forEach((schedule) => {
        if (!trailStats[schedule.trail]) {
            trailStats[schedule.trail] = { capacity: 0, booked: 0 };
        }
        trailStats[schedule.trail].capacity += schedule.capacity || 0;
        trailStats[schedule.trail].booked += schedule.booked || 0;
    });

    const trailFillRates = Object.entries(trailStats).map(([trail, stats]) => ({
        trail,
        fillRate: stats.capacity ? Math.round((stats.booked / stats.capacity) * 100) : 0,
        booked: stats.booked,
        capacity: stats.capacity,
    }));

    const kpis = [
        {
            icon: CircleDollarSign,
            value: formatter.format(totalRevenue),
            label: 'Total Revenue',
            sub: 'Fees Collected',
        },
        {
            icon: CalendarCheck,
            value: String(totalBookings),
            label: 'Total Bookings',
            sub: `${totalHikers} total hikers`,
        },
        {
            icon: Mountain,
            value: `${fillRate}%`,
            label: 'Overall Fill Rate',
            sub: `${totalBooked} of ${totalCapacity} slots booked across trails`,
        },
        {
            icon: Users,
            value: String(totalHikers),
            label: 'Total Hikers',
            sub: `Avg ${totalBookings ? Math.round(totalHikers / totalBookings) : 0} hikers per booking`,
        },
    ];

    return (
        <section ref={sectionRef} aria-label="Reports summary" className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {/* Revenue Two Level Pie Chart */}
            <div
                style={{ transitionDelay: '500ms' }}
                className={`col-span-full grid grid-cols-1 lg:grid-cols-2 transition-all gap-3 duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h3 className="text-lg font-bold text-on-surface">Revenue by Trail & Payment Method</h3>
                        <select
                            value={selectedTrail}
                            onChange={(e) => setSelectedTrail(e.target.value)}
                            aria-label="Filter revenue by trail"
                            className="cursor-pointer min-h-11 px-3 py-1.5 text-sm border border-outline-variant/40 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Trails</option>
                            {allTrails.map((trail) => (
                                <option key={trail} value={trail}>{trail}</option>
                            ))}
                        </select>
                    </div>
                    <RevenueTwoLevelPieChart bookings={bookings} selectedTrail={selectedTrail} />
                </div>

                {/* Combined Revenue Breakdown & Trail Fill Rates Card */}
                <div className="space-y-3">
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2'>
                        {kpis.map((kpi) => (
                            <StatCard key={kpi.label} {...kpi} />
                        ))}
                    </div>

                    {/* Top Section: Revenue Breakdown */}
                    <div className='rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-6'>
                        <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Revenue Breakdown</p>
                        <p className="mt-1 text-xs text-on-surface-variant">Breakdown by fee type for {dateRange === 'all' ? 'all time' : dateRange}</p>

                        <div className="mt-5 space-y-3">
                            {[
                                { label: 'Environmental Fee', amount: feeBreakdown.environmental || 0, color: 'bg-emerald-500', icon: Leaf },
                                { label: 'Guide Fee', amount: feeBreakdown.guide || 0, color: 'bg-blue-500', icon: UserCheck },
                                { label: 'Processing Fee', amount: feeBreakdown.processing || 0, color: 'bg-amber-500', icon: Receipt },
                            ].map((fee) => (
                                <div key={fee.label} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <fee.icon className="h-3.5 w-3.5" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-on-surface">{fee.label}</p>
                                            <p className="text-xs text-on-surface-variant">
                                                {(fee.amount / (totalRevenue || 1) * 100).toFixed(1)}% of total
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-on-surface">{formatter.format(fee.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section: Trail Fill Rates */}
                    <div className='rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-6'>
                        <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Trail Fill Rates</p>
                        <p className="mt-1 text-xs text-on-surface-variant">Capacity utilization per trail</p>

                        <div className="mt-5 space-y-3">
                            {trailFillRates.length > 0 ? (
                                trailFillRates.map((trail) => {
                                    const badge = trail.fillRate >= 90 ? 'bg-red-50 text-red-700 border-red-200' : trail.fillRate >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                    return (
                                        <div key={trail.trail} className="flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-bold text-on-surface">{trail.trail}</p>
                                            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge}`}>
                                                {trail.fillRate}%
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="py-4 text-center text-sm text-on-surface-variant">No trail data available.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>


        </section>
    );
}