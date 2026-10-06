import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, ClipboardList, MapPin, MessageSquare, ShieldCheck, UsersRound } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useStaffStore } from '../../state/staffStore';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffPageHeader from '../../components/staff/StaffPageHeader';
import StaffStatusBadge from '../../components/staff/StaffStatusBadge';

const formatDate = (dateKey) => new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
}).format(new Date(`${dateKey}T00:00:00`));

export default function StaffGroup() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { id } = useParams();
    const { assignedBookings, assignedSchedules, checkIns, passes } = useStaffStore();
    const schedule = assignedSchedules.find((item) => item.id === id);
    const groupBookings = useMemo(() => assignedBookings.filter((booking) => booking.scheduleId === id), [assignedBookings, id]);
    const groupHikers = useMemo(() => groupBookings.flatMap((booking) => (booking.hikers || []).map((hiker) => ({ ...hiker, bookingId: booking.id, bookingReference: booking.reference }))), [groupBookings]);
    const checkedInCount = groupHikers.filter((hiker) => {
        const pass = passes.find((item) => item.bookingId === hiker.bookingId && item.hikerName === hiker.fullName);
        return pass && checkIns[pass.id];
    }).length;

    if (!schedule) {
        return (
            <div ref={sectionRef} className="space-y-6">
                <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <StaffPageHeader eyebrow="Park staff · Group coordination" title="Group roster" description="The requested group is not part of your current duty assignments." />
                </div>
                <div style={{ transitionDelay: '150ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <StaffEmptyState icon={UsersRound} title="Group not found" description="This schedule may have been reassigned or is outside your assigned trail duty." action={<Link to="/staff/schedules" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">View my schedules</Link>} />
                </div>
            </div>
        );
    }

    return (
        <div ref={sectionRef} className="space-y-6 md:space-y-8">
            <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <StaffPageHeader
                    eyebrow="Park staff · Group coordination"
                    title={schedule.trail}
                    description={`${formatDate(schedule.dateKey)} · ${schedule.guide}. Review the roster and check-in state before the safety briefing.`}
                >
                    <Link to="/staff/schedules" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft className="h-4 w-4" />My schedules</Link>
                </StaffPageHeader>
            </div>

            <section style={{ transitionDelay: '150ms' }} aria-label="Group assignment summary" className={`grid gap-4 transition-all duration-700 ease-out sm:grid-cols-2 xl:grid-cols-4 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs"><MapPin className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-bold text-on-surface">{schedule.trail}</p><p className="mt-1 text-xs text-on-surface-variant">Assigned trail</p></div>
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs"><CalendarDays className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-bold text-on-surface">{schedule.date}</p><p className="mt-1 text-xs text-on-surface-variant">Climb date</p></div>
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs"><UsersRound className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-bold text-on-surface">{groupHikers.length} hikers</p><p className="mt-1 text-xs text-on-surface-variant">Across {groupBookings.length} booking{groupBookings.length === 1 ? '' : 's'}</p></div>
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs"><Check className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-bold text-on-surface">{checkedInCount}/{groupHikers.length} checked in</p><p className="mt-1 text-xs text-on-surface-variant">Jump-off status</p></div>
            </section>

            <div style={{ transitionDelay: '250ms' }} className={`grid gap-6 transition-all duration-700 ease-out xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <section aria-labelledby="roster-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Assigned roster</p>
                            <h2 id="roster-heading" className="mt-1 text-lg font-bold text-on-surface">Hiker check-in state</h2>
                        </div>
                        <StaffStatusBadge status={checkedInCount === groupHikers.length && groupHikers.length > 0 ? 'Checked in' : 'Limited'} label={checkedInCount === groupHikers.length && groupHikers.length > 0 ? 'Roster cleared' : 'Roster in progress'} />
                    </div>
                    <div className="mt-5 space-y-3">
                        {groupHikers.length > 0 ? groupHikers.map((hiker, index) => {
                            const pass = passes.find((item) => item.bookingId === hiker.bookingId && item.hikerName === hiker.fullName);
                            const checkedIn = pass && checkIns[pass.id];
                            return (
                                <div key={`${hiker.bookingId}-${hiker.fullName}-${index}`} className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 p-4 sm:flex-row sm:items-center">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">{hiker.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-on-surface">{hiker.fullName}</p>
                                        <p className="mt-1 text-xs text-on-surface-variant">{index === 0 ? 'Lead hiker' : 'Group member'} · {hiker.emergencyName ? `Emergency: ${hiker.emergencyName}` : 'Emergency contact not recorded'}</p>
                                    </div>
                                    <StaffStatusBadge status={checkedIn ? 'Checked in' : 'Pending check-in'} />
                                </div>
                            );
                        }) : (
                            <StaffEmptyState icon={UsersRound} title="No hikers in this roster" description="The assigned schedule has no hiker records yet. Check the booking record before the jump-off briefing." />
                        )}
                    </div>
                </section>

                <aside className="space-y-6">
                    <section aria-labelledby="group-actions-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Guide actions</p><h2 id="group-actions-heading" className="mt-1 text-lg font-bold text-on-surface">Keep the group moving</h2></div></div>
                        <div className="mt-5 space-y-2">
                            <Link to={`/staff/verify?schedule=${encodeURIComponent(schedule.id)}`} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-on-secondary hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Verify jump-off passes</Link>
                            <Link to="/staff/messages" className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant px-3 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><MessageSquare className="h-4 w-4" />Park announcements</Link>
                        </div>
                    </section>
                    <section aria-labelledby="group-bookings-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Linked permits</p>
                        <h2 id="group-bookings-heading" className="mt-1 text-lg font-bold text-on-surface">Booking records</h2>
                        <div className="mt-4 space-y-2">
                            {groupBookings.map((booking) => <Link key={booking.id} to={`/staff/bookings?booking=${encodeURIComponent(booking.id)}`} className="flex min-h-11 items-center gap-3 rounded-xl border border-outline-variant/30 px-3 py-2 transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ClipboardList className="h-4 w-4 shrink-0 text-primary" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-on-surface">{booking.leadHiker}</span><span className="block truncate text-xs text-on-surface-variant">{booking.reference} · {booking.participants} hikers</span></span><StaffStatusBadge status={booking.status} /></Link>)}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
