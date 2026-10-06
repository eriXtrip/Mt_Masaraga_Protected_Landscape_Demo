import { useState } from 'react';
import { CalendarClock, CalendarPlus, ChevronRight, Layers, ChevronDown, ChevronUp, History, RotateCcw, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SCHEDULE_STATUS_BADGE } from './bookingUtils';

const INITIAL_LIMIT = 5;

function IconButton({ icon: Icon, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

function ScheduleRow({ schedule, label, detail, bookingCount, active, onClick, onReschedule }) {
    const fillPct = schedule ? Math.min(100, Math.round((schedule.booked / schedule.capacity) * 100)) : 0;
    const badge = schedule ? SCHEDULE_STATUS_BADGE[schedule.status] || SCHEDULE_STATUS_BADGE.Available : null;

    return (
        <div
            className={`group relative flex items-stretch border-b border-outline-variant/15 transition-all ${active ? 'bg-primary/5' : 'hover:bg-surface-container-low/70'
                }`}
        >

            {/* Main Click Area */}
            <button
                type="button"
                onClick={onClick}
                aria-pressed={active}
                className="flex flex-1 min-w-0 items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary cursor-pointer"
            >
                {/* Status Icon */}
                <span
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${schedule?.isPast
                        ? 'bg-surface-container-high text-on-surface-variant'
                        : active
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-primary/10 text-primary'
                        }`}
                >
                    {schedule ? <CalendarClock className="h-4 w-4 sm:h-5 sm:w-5" /> : <Layers className="h-4 w-4 sm:h-5 sm:w-5" />}
                </span>

                {/* Content Block */}
                <div className="min-w-0 flex-1 space-y-1">
                    {/* Top Line: Trail Title & Status */}
                    <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-xs sm:text-sm font-bold leading-snug ${active ? 'text-primary' : 'text-on-surface'}`}>
                            {schedule ? schedule.trail : label}
                        </p>

                        {schedule && (
                            <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge}`}>
                                {schedule.status}
                            </span>
                        )}
                    </div>

                    {/* Sub Line: Date, Guide & Bookings */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-on-surface-variant">
                        <span className="font-semibold text-on-surface/90">
                            {schedule ? schedule.date : detail}
                        </span>

                        {schedule && (
                            <>
                                <span className="text-outline/50">•</span>
                                <span className="inline-flex items-center gap-1 truncate max-w-27.5 sm:max-w-none">
                                    <UserCog className="h-3 w-3 shrink-0 text-primary/80" />
                                    <span className="truncate">{schedule.guide}</span>
                                </span>
                            </>
                        )}

                        <span className="text-outline/50">•</span>
                        <span className="whitespace-nowrap">
                            <strong className="text-on-surface font-semibold">{bookingCount}</strong> {bookingCount === 1 ? 'booking' : 'bookings'}
                        </span>
                    </div>

                    {/* Capacity Progress Bar (Always visible) */}
                    {schedule && (
                        <div className="pt-1 flex items-center gap-2 max-w-xs">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${fillPct >= 90 ? 'bg-amber-500' : 'bg-primary'
                                        }`}
                                    style={{ width: `${fillPct}%` }}
                                />
                            </div>
                            <span className="shrink-0 text-[10px] font-semibold text-on-surface-variant">
                                {schedule.booked}/{schedule.capacity} slots
                            </span>
                        </div>
                    )}
                </div>
            </button>

            {/* Quick Action Button Area */}
            {schedule && onReschedule && (
                <div className="flex shrink-0 items-center border-l border-outline-variant/15 px-2">
                    <IconButton
                        icon={RotateCcw}
                        label="Reschedule date / change guide"
                        onClick={() => onReschedule(schedule)}
                    />
                </div>
            )}
        </div>
    );
}

export default function ScheduleList({ schedules, bookings, activeScheduleId, onSelect, onCreate, onReschedule }) {
    const [showAll, setShowAll] = useState(false);
    const [filterTab, setFilterTab] = useState('upcoming');
    const todayStr = new Date().toISOString().split('T')[0];

    const bookingCountFor = (scheduleId) => bookings.filter((b) => b.scheduleId === scheduleId).length;

    const processedSchedules = schedules
        .map((s) => ({
            ...s,
            isPast: s.dateKey < todayStr || s.status === 'Completed' || s.status === 'Expired',
        }))
        .sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));

    const filteredSchedules = processedSchedules.filter((s) => {
        if (filterTab === 'upcoming') return !s.isPast;
        if (filterTab === 'past') return s.isPast;
        return true;
    });

    const upcomingCount = processedSchedules.filter((s) => !s.isPast).length;
    const pastCount = processedSchedules.filter((s) => s.isPast).length;

    const visibleSchedules = showAll ? filteredSchedules : filteredSchedules.slice(0, INITIAL_LIMIT);
    const hasMore = filteredSchedules.length > INITIAL_LIMIT;

    return (
        <section
            aria-labelledby="schedules-heading"
            className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs flex flex-col min-w-0"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant/20 p-4 sm:px-6 sm:py-4">
                <div className="min-w-0 flex-1">
                    <h2 id="schedules-heading" className="truncate text-xs sm:text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Trail schedules
                    </h2>
                    <p className="mt-0.5 truncate text-[11px] sm:text-xs text-on-surface-variant">
                        Published climb dates hikers can book.
                    </p>
                </div>

                <Button onClick={onCreate} size="sm" className="shrink-0 cursor-pointer h-9 px-3 sm:px-4">
                    <CalendarPlus className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">New schedule</span>
                    <span className="sm:hidden text-xs">New</span>
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-outline-variant/20 bg-surface-container-low/40 p-1.5 sm:px-5 sm:py-2">
                {/* Grid Segmented Control on Mobile (< sm), Flex Chips on Desktop (>= sm) */}
                <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-1.5 text-xs">
                    <button
                        type="button"
                        onClick={() => { setFilterTab('upcoming'); setShowAll(false); }}
                        className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${filterTab === 'upcoming'
                            ? 'bg-primary text-inverse-on-surface shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        <span>Upcoming</span>
                        <span className="opacity-80">({upcomingCount})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setFilterTab('past'); setShowAll(false); }}
                        className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${filterTab === 'past'
                            ? 'bg-primary text-inverse-on-surface shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        <History className="hidden h-3.5 w-3.5 sm:inline-block shrink-0" />
                        <span>Past</span>
                        <span className="opacity-80">({pastCount})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => { setFilterTab('all'); setShowAll(false); }}
                        className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-center text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${filterTab === 'all'
                            ? 'bg-primary text-inverse-on-surface shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                    >
                        <span>All</span>
                        <span className="opacity-80">({schedules.length})</span>
                    </button>
                </div>
            </div>

            {/* List View */}
            {filteredSchedules.length === 0 ? (
                <div className="px-4 py-8 sm:px-5 sm:py-10 text-center">
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant">
                        <CalendarClock className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-on-surface">No {filterTab} schedules</h3>
                    <p className="mx-auto mt-1 max-w-xs text-xs text-on-surface-variant">
                        {filterTab === 'upcoming'
                            ? 'There are no active or upcoming climb dates scheduled.'
                            : 'No past climb records found.'}
                    </p>
                </div>
            ) : (
                <div>
                    <div className={`divide-y divide-outline-variant/20 ${showAll ? 'max-h-120 overflow-y-auto' : ''}`}>
                        {filterTab === 'all' && (
                            <ScheduleRow
                                label="All schedules"
                                detail="Every trail and date"
                                bookingCount={bookings.length}
                                active={activeScheduleId === null}
                                onClick={() => onSelect(null)}
                            />
                        )}

                        {visibleSchedules.map((schedule) => (
                            <ScheduleRow
                                key={schedule.id}
                                schedule={schedule}
                                bookingCount={bookingCountFor(schedule.id)}
                                active={activeScheduleId === schedule.id}
                                onClick={() => onSelect(schedule.id)}
                                onReschedule={onReschedule}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="border-t border-outline-variant/20 p-2 sm:p-2.5 text-center bg-surface-container-lowest">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAll(!showAll)}
                                className="w-full text-xs font-semibold text-primary hover:bg-primary/5 cursor-pointer"
                            >
                                {showAll ? (
                                    <>
                                        <span>Collapse view</span>
                                        <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
                                    </>
                                ) : (
                                    <>
                                        <span>Show all ({filteredSchedules.length} schedules)</span>
                                        <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}