import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Filter, Search, UsersRound } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Input } from '@/components/ui/input';
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

export default function StaffSchedules() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { assignedBookings, assignedSchedules, operationalDate } = useStaffStore();
    const [tab, setTab] = useState('upcoming');
    const [trailFilter, setTrailFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const trailOptions = useMemo(() => [...new Set(assignedSchedules.map((schedule) => schedule.trail))], [assignedSchedules]);
    const filteredSchedules = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return assignedSchedules
            .filter((schedule) => {
                const isPast = schedule.dateKey < operationalDate;
                const matchesTab = tab === 'all' || (tab === 'past' ? isPast : !isPast);
                const matchesTrail = trailFilter === 'all' || schedule.trail === trailFilter;
                const matchesSearch = !term || schedule.trail.toLowerCase().includes(term) || schedule.guide?.toLowerCase().includes(term);
                return matchesTab && matchesTrail && matchesSearch;
            })
            .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
    }, [assignedSchedules, operationalDate, searchTerm, tab, trailFilter]);

    const upcomingCount = assignedSchedules.filter((schedule) => schedule.dateKey >= operationalDate).length;
    const pastCount = assignedSchedules.length - upcomingCount;

    return (
        <div ref={sectionRef} className="space-y-6 md:space-y-8">
            <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <StaffPageHeader
                    eyebrow="Park staff · Field operations"
                    title="My schedules"
                    description="Every assignment is scoped to your guide duty. Open a schedule to review its group roster before the jump-off briefing."
                >
                    <Link to="/staff/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Back to dashboard</Link>
                </StaffPageHeader>
            </div>

            <section style={{ transitionDelay: '150ms' }} aria-label="Schedule filters" className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-container p-1 sm:inline-grid sm:w-fit">
                        {[
                            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
                            { id: 'past', label: 'Past', count: pastCount },
                            { id: 'all', label: 'All', count: assignedSchedules.length },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setTab(filter.id)}
                                aria-pressed={tab === filter.id}
                                className={`min-h-11 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${tab === filter.id ? 'bg-primary text-on-secondary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                            >
                                {filter.label} <span className="ml-1 opacity-75">({filter.count})</span>
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] xl:w-[560px]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search trail or guide" aria-label="Search schedules" className="min-h-11 pl-9" />
                        </div>
                        <div className="relative">
                            <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                            <select value={trailFilter} onChange={(event) => setTrailFilter(event.target.value)} aria-label="Filter schedules by trail" className="min-h-11 w-full rounded-lg border border-outline-variant bg-surface pl-9 pr-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="all">All assigned trails</option>
                                {trailOptions.map((trail) => <option key={trail} value={trail}>{trail}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ transitionDelay: '250ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                {filteredSchedules.length > 0 ? (
                <section aria-label="Assigned schedules" className="grid gap-4 lg:grid-cols-2">
                    {filteredSchedules.map((schedule) => {
                        const scheduleBookings = assignedBookings.filter((booking) => booking.scheduleId === schedule.id);
                        const groupHikers = scheduleBookings.reduce((total, booking) => total + (booking.participants || 0), 0);
                        const fillPercent = schedule.capacity ? Math.min(100, Math.round((schedule.booked / schedule.capacity) * 100)) : 0;
                        return (
                            <article key={schedule.id} className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/40 md:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarDays className="h-5 w-5" /></span>
                                        <div className="min-w-0">
                                            <h2 className="truncate text-base font-bold text-on-surface">{schedule.trail}</h2>
                                            <p className="mt-1 text-sm text-on-surface-variant">{formatDate(schedule.dateKey)}</p>
                                        </div>
                                    </div>
                                    <StaffStatusBadge status={schedule.status} />
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <div className="rounded-xl bg-surface-container-low p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Guide</p>
                                        <p className="mt-1 truncate text-sm font-bold text-on-surface">{schedule.guide}</p>
                                    </div>
                                    <div className="rounded-xl bg-surface-container-low p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Groups</p>
                                        <p className="mt-1 text-sm font-bold text-on-surface">{scheduleBookings.length}</p>
                                    </div>
                                    <div className="rounded-xl bg-surface-container-low p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Hikers</p>
                                        <p className="mt-1 text-sm font-bold text-on-surface">{groupHikers}</p>
                                    </div>
                                    <div className="rounded-xl bg-surface-container-low p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Ratio</p>
                                        <p className="mt-1 text-sm font-bold text-on-surface">1 : 5</p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <span className="font-semibold text-on-surface">Slot utilization</span>
                                        <span className="text-on-surface-variant">{schedule.booked}/{schedule.capacity} · {fillPercent}%</span>
                                    </div>
                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
                                        <div className={`h-full rounded-full ${fillPercent >= 90 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${fillPercent}%` }} />
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20 pt-4">
                                    <p className="flex items-center gap-1.5 text-xs text-on-surface-variant"><UsersRound className="h-4 w-4" /> Lead {scheduleBookings[0]?.leadHiker || 'No lead hiker assigned'}</p>
                                    <Link to={`/staff/groups/${schedule.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                        Open group roster
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </section>
            ) : (
                <StaffEmptyState
                    icon={CalendarDays}
                    title="No schedules match these filters"
                    description="Try another date range, trail, or search term. Your assigned schedules will appear here when the park publishes them."
                    action={<button type="button" onClick={() => { setTab('all'); setTrailFilter('all'); setSearchTerm(''); }} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear filters</button>}
                />
                )}
            </div>
        </div>
    );
}
