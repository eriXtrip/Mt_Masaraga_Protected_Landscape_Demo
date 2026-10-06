import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import BookingModal from './BookingModal';
import { formatDateLabel, getDateKey } from './bookingUtils';

function GuideChip({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
        >
            {children}
        </button>
    );
}

export default function RescheduleScheduleModal({ schedule, schedules, guides, onConfirm, onClose }) {
    const [date, setDate] = useState(undefined);
    const [guide, setGuide] = useState(schedule?.guide || '');

    // Other dates already scheduled for this trail are marked and disabled so the
    // admin can only move the climb to a slot that is currently free.
    const blockedDates = schedules
        .filter((s) => s.trailId === schedule?.trailId && s.id !== schedule?.id)
        .reduce((map, s) => {
            map[s.dateKey] = Math.max(0, (s.capacity ?? 0) - (s.booked ?? 0));
            return map;
        }, {});

    return (
        <BookingModal
            title="Reschedule climb date"
            subtitle={`${schedule?.trail} · currently ${schedule?.date} · guide ${schedule?.guide}`}
            onClose={onClose}
        >
            {({ requestClose }) => (
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">New date</p>
                        <div className="mt-3 rounded-md border border-outline-variant/40 p-2">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                slots={blockedDates}
                                allowUnscheduled
                                disableScheduled
                            />
                        </div>
                        <p className="mt-2 text-xs text-on-surface-variant">
                            Dates already scheduled for {schedule?.trail} are marked and cannot be selected.
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Guide</p>
                        {guides.length === 0 ? (
                            <p className="mt-3 text-xs text-on-surface-variant">No guides are available to assign.</p>
                        ) : (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {guides.map((name) => (
                                    <GuideChip key={name} active={guide === name} onClick={() => setGuide(name)}>
                                        {name}
                                    </GuideChip>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
                        <Button variant="ghost" onClick={requestClose} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            disabled={!date}
                            onClick={() => onConfirm({ dateKey: getDateKey(date), date: formatDateLabel(date), guide }, requestClose)}
                            className="cursor-pointer"
                        >
                            Confirm reschedule
                        </Button>
                    </div>
                </div>
            )}
        </BookingModal>
    );
}