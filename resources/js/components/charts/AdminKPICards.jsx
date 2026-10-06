import { useMemo } from 'react';
import { CalendarCheck, Wallet, Mountain, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const ICON_COLOR_MAP = {
    primary: 'text-primary bg-primary/10',
    emerald: 'text-[var(--chart-1)] bg-[var(--chart-1)]/10',
    red: 'text-[var(--destructive)] bg-[var(--destructive)]/10',
    amber: 'text-[var(--chart-5)] bg-[var(--chart-5)]/10',
    blue: 'text-[var(--chart-3)] bg-[var(--chart-3)]/10',
};

export default function AdminKPICards({ bookings, quota, users, schedules }) {
    const kpis = useMemo(() => {
        const now = new Date();
        const todayKey = now.toISOString().split('T')[0];

        const upcomingBookings = bookings.filter((b) => b.status === 'Upcoming');
        const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');

        const todayQuota = quota.find((q) => q.dateKey === todayKey);
        const totalSlots = quota.reduce((sum, q) => sum + q.capacity, 0);
        const bookedSlots = quota.reduce((sum, q) => sum + q.booked, 0);
        const usagePct = totalSlots ? Math.round((bookedSlots / totalSlots) * 100) : 0;

        const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);
        const thisMonthRevenue = bookings
            .filter((b) => new Date(b.date).getMonth() === now.getMonth())
            .reduce((sum, b) => sum + (b.totalPaid || 0), 0);

        const hikerCount = users.filter((u) => u.role === 3).length;
        const staffCount = users.filter((u) => u.role === 2).length;
        const activeGuides = users.filter((u) => u.role === 2 && u.status === 'Active').length;

        const fullSchedules = schedules.filter((s) => s.status === 'Full').length;
        const limitedSchedules = schedules.filter((s) => s.status === 'Limited').length;

        return [
            {
                id: 'today-bookings',
                icon: CalendarCheck,
                value: String(upcomingBookings.length),
                label: "Today's Upcoming Hikes",
                sub: confirmedBookings.length > 0 ? `${confirmedBookings.length} confirmed` : 'No confirmed hikes',
                trend: upcomingBookings.length > 0 ? '+0%' : null,
                color: 'primary',
            },
            {
                id: 'revenue',
                icon: Wallet,
                value: formatter.format(totalRevenue),
                label: 'Total Revenue Collected',
                sub: `₱${thisMonthRevenue.toLocaleString()} this month`,
                trend: thisMonthRevenue > 0 ? `+${Math.round((thisMonthRevenue / totalRevenue) * 100)}% this month` : null,
                color: 'primary',
            },
            {
                id: 'quota-usage',
                icon: Mountain,
                value: totalSlots ? `${usagePct}%` : '0%',
                label: 'Overall Quota Usage',
                sub: totalSlots ? `${bookedSlots} of ${totalSlots} slots booked` : 'No quota set',
                trend: usagePct > 80 ? 'High utilization' : usagePct > 50 ? 'Moderate utilization' : 'Low utilization',
                color: 'primary',
            },
            {
                id: 'users',
                icon: Users,
                value: String(users.length),
                label: 'Registered Users',
                sub: `${hikerCount} hikers · ${staffCount} staff · ${activeGuides} active guides`,
                trend: hikerCount > 0 ? `${hikerCount} active hikers` : 'No hikers yet',
                color: 'primary',
            },
            {
                id: 'schedule-status',
                icon: TrendingUp,
                value: String(schedules.length),
                label: 'Published Schedules',
                sub: `${fullSchedules} full · ${limitedSchedules} limited`,
                trend: fullSchedules > 0 ? 'Some dates fully booked' : 'Availability open',
                color: 'primary',
            },
            {
                id: 'capacity-alert',
                icon: AlertTriangle,
                value: String(fullSchedules + limitedSchedules),
                label: 'Dates Needing Attention',
                sub: fullSchedules > 0 ? `${fullSchedules} full, consider adding slots` : 'All dates have availability',
                trend: fullSchedules > 0 ? 'Action recommended' : 'No action needed',
                color: 'primary',
            },
        ];
    }, [bookings, quota, users, schedules]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const iconBg = ICON_COLOR_MAP[kpi.color] || ICON_COLOR_MAP.primary;
                return (
                    <div
                        key={kpi.id}
                        className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                                    {kpi.label}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-on-surface truncate">{kpi.value}</p>
                                <p className="mt-1.5 text-sm text-on-surface-variant">{kpi.sub}</p>
                                {kpi.trend && (
                                    <p className="mt-2 text-xs text-on-surface-variant flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {kpi.trend}
                                    </p>
                                )}
                            </div>
                            <div className={`shrink-0 p-2 rounded-xl ${iconBg}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}