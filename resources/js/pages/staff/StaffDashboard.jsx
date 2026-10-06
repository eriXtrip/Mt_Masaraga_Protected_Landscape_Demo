import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CalendarDays,
    ClipboardCheck,
    CloudLightning,
    MessageSquare,
    ScanLine,
    ShieldAlert,
    TriangleAlert,
    UsersRound,
} from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { NEWS } from '../../mockData';
import { useStaffStore } from '../../state/staffStore';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffMetricCard from '../../components/staff/StaffMetricCard';
import StaffPageHeader from '../../components/staff/StaffPageHeader';
import StaffStatusBadge from '../../components/staff/StaffStatusBadge';
import DailySlotQuota from '../../components/admin/dashboard/DailySlotQuota';

const formatOperationalDate = (dateKey) => new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
}).format(new Date(`${dateKey}T00:00:00`));

function StaffAdvisories({ advisories }) {
    return (
        <section aria-labelledby="staff-advisories-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Park advisories</p>
            <p className="mt-1 text-xs text-on-surface-variant">Latest notices that may affect field duties.</p>
            <div className="mt-5 space-y-4">
                {advisories.length > 0 ? advisories.map((item) => (
                    <a key={item.id} href={`/news/${item.id}`} className="block rounded-2xl border border-outline-variant/40 p-5 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <div className="flex items-center gap-2">
                            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.badgeClass}`}>{item.category}</span>
                            <span className="text-xs text-on-surface-variant">{item.date}</span>
                        </div>
                        <h3 className="mt-3 flex items-center gap-2 text-sm font-bold text-on-surface">
                            {item.category === 'Advisory' && <TriangleAlert className="h-4 w-4 shrink-0 text-red-700" />}
                            {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">{item.leadParagraph || 'Open the public advisory for details.'}</p>
                    </a>
                )) : <p className="py-8 text-center text-sm text-on-surface-variant">No advisories right now.</p>}
            </div>
        </section>
    );
}

export default function StaffDashboard() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const {
        assignedBookings,
        assignedSchedules,
        checkIns,
        operationalDate,
        passes,
        quota,
        staff,
    } = useStaffStore();

    const todaySchedules = useMemo(
        () => assignedSchedules.filter((schedule) => schedule.dateKey === operationalDate),
        [assignedSchedules, operationalDate],
    );
    const todayScheduleIds = useMemo(() => new Set(todaySchedules.map((schedule) => schedule.id)), [todaySchedules]);
    const todayBookings = useMemo(
        () => assignedBookings.filter((booking) => todayScheduleIds.has(booking.scheduleId)),
        [assignedBookings, todayScheduleIds],
    );
    const todayPasses = useMemo(
        () => passes.filter((pass) => todayScheduleIds.has(pass.scheduleId)),
        [passes, todayScheduleIds],
    );
    const checkedInCount = todayPasses.filter((pass) => checkIns[pass.id]).length;
    const expectedHikers = todaySchedules.reduce((total, schedule) => total + (schedule.booked || 0), 0);
    const slotAlerts = quota.filter((entry) => entry.status !== 'Available');
    const advisories = NEWS
        .filter((item) => item.category === 'Advisory' || item.category === 'Weather')
        .slice(0, 2)
        .map((item) => ({
            ...item,
            badgeClass: item.category === 'Weather' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-red-200 bg-red-50 text-red-800',
        }));
    const firstName = staff.name?.split(' ')[0] || 'Staff';

    const metrics = [
        {
            icon: CalendarDays,
            value: todaySchedules.length,
            label: 'Climbs today',
            detail: todaySchedules.length > 0 ? formatOperationalDate(operationalDate) : 'No assigned climb today',
            tone: 'primary',
        },
        {
            icon: UsersRound,
            value: expectedHikers,
            label: 'Expected hikers',
            detail: 'Based on assigned schedule capacity',
            tone: 'teal',
        },
        {
            icon: ScanLine,
            value: `${checkedInCount}/${todayPasses.length}`,
            label: 'Pass check-ins',
            detail: todayPasses.length > 0 ? 'Digital passes scanned today' : 'No passes assigned today',
            tone: 'amber',
        },
        {
            icon: ShieldAlert,
            value: slotAlerts.length,
            label: 'Slot alerts',
            detail: slotAlerts.length > 0 ? 'Review limited or full slots' : 'No capacity alerts',
            tone: slotAlerts.length > 0 ? 'amber' : 'neutral',
        },
    ];

    return (
        <div ref={sectionRef} className="space-y-6 md:space-y-8">
            <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <StaffPageHeader
                    eyebrow="Park staff · Field overview"
                    title={`Good day, ${firstName}`}
                    description="Start with the climbs assigned to you, then clear pass checks and document follow-ups before the group reaches jump-off."
                >
                    <Link
                        to="/staff/verify"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-secondary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        <ScanLine className="h-4 w-4" />
                        Verify a pass
                    </Link>
                </StaffPageHeader>
            </div>

            <section style={{ transitionDelay: '150ms' }} aria-label="Staff key figures" className={`grid grid-cols-2 gap-3 transition-all duration-700 ease-out sm:grid-cols-2 xl:grid-cols-4 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                {metrics.map((metric) => <StaffMetricCard key={metric.label} {...metric} />)}
            </section>

            <div style={{ transitionDelay: '250ms' }} className={`grid gap-6 transition-all duration-700 ease-out xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <section aria-labelledby="today-climbs-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Your duty</p>
                            <h2 id="today-climbs-heading" className="mt-1 text-lg font-bold text-on-surface">Today&apos;s climbs</h2>
                            <p className="mt-1 text-sm text-on-surface-variant">Assigned groups and jump-off readiness.</p>
                        </div>
                        <Link to="/staff/schedules" className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            All schedules
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {todaySchedules.length > 0 ? (
                            todaySchedules.map((schedule) => {
                                const scheduleBookings = todayBookings.filter((booking) => booking.scheduleId === schedule.id);
                                const expected = scheduleBookings.reduce((total, booking) => total + (booking.participants || 0), 0);
                                const isLimited = schedule.status === 'Limited' || schedule.status === 'Full';
                                return (
                                    <div key={schedule.id} className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/45 p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-on-surface">{schedule.trail}</p>
                                                <p className="mt-1 text-xs text-on-surface-variant">{schedule.date} · {schedule.guide}</p>
                                            </div>
                                            <StaffStatusBadge status={schedule.status} />
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Booked</p>
                                                <p className="mt-1 text-sm font-bold text-on-surface">{schedule.booked}/{schedule.capacity}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Groups</p>
                                                <p className="mt-1 text-sm font-bold text-on-surface">{scheduleBookings.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Expected</p>
                                                <p className="mt-1 text-sm font-bold text-on-surface">{expected} hikers</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high" aria-label={`${schedule.booked} of ${schedule.capacity} slots booked`}>
                                            <div className={`h-full rounded-full ${isLimited ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (schedule.booked / schedule.capacity) * 100)}%` }} />
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Link to={`/staff/groups/${schedule.id}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                                Open roster
                                            </Link>
                                            <Link to={`/staff/verify?schedule=${encodeURIComponent(schedule.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-3 text-xs font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                                Check jump-off
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <StaffEmptyState
                                icon={CalendarDays}
                                title="No climb assigned today"
                                description="There are no scheduled duties on the current operational day. Review your next assignment below."
                                action={<Link to="/staff/schedules" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View schedules</Link>}
                            />
                        )}
                    </div>
                </section>

                <div className="space-y-6">
                    <DailySlotQuota quota={quota} hikeDay={formatOperationalDate(operationalDate)} />
                    <StaffAdvisories advisories={advisories} />
                </div>
            </div>

            <section style={{ transitionDelay: '350ms' }} aria-labelledby="quick-actions-heading" className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-all duration-700 ease-out md:p-6 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Next actions</p>
                        <h2 id="quick-actions-heading" className="mt-1 text-lg font-bold text-on-surface">Keep the field moving</h2>
                    </div>
                    <p className="text-xs text-on-surface-variant">Choose the task that matches the next hiker interaction.</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                        { to: '/staff/bookings', label: 'Review permit applications', detail: 'Approve or reject submitted groups.', icon: ClipboardCheck },
                        { to: '/staff/messages', label: 'Read park announcements', detail: 'Check trail conditions and safety notices.', icon: MessageSquare },
                        { to: '/staff/reports', label: 'Record a field report', detail: 'Log a trail observation or incident.', icon: CloudLightning },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.to} to={action.to} className="group flex min-h-11 items-start gap-3 rounded-xl border border-outline-variant/30 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-bold text-on-surface">{action.label}</span>
                                    <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">{action.detail}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
