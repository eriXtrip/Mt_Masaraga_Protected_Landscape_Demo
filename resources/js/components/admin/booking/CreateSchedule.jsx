import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { TRAILS } from '../../../mockData';
import { useAdminStore } from '../../../state/adminStore';
import { formatDateLabel, getDateKey } from './bookingUtils';

const TRAIL_ORDER = ['amtic', 'ligao'];

function Chip({ active, onClick, children }) {
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

function FieldLabel({ children }) {
    return (
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{children}</p>
    );
}

export default function CreateSchedule({ schedules, guides, onConfirm, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    const [trailId, setTrailId] = useState(null);
    const [date, setDate] = useState(undefined);
    const { settings } = useAdminStore();
    const defaultCapacity = settings?.booking?.defaultDailyCapacity || 20;
    const [capacity, setCapacity] = useState(defaultCapacity);
    const [guide, setGuide] = useState('');

    const trail = trailId ? TRAILS[trailId] : null;
    const dateKey = date ? getDateKey(date) : null;
    const duplicate =
        trailId && dateKey
            ? schedules.some((s) => s.trailId === trailId && s.dateKey === dateKey)
            : false;
    const trailSchedules = trailId ? schedules.filter((s) => s.trailId === trailId) : [];
  const trailScheduleSlots = trailSchedules.reduce((map, s) => {
    map[s.dateKey] = Math.max(0, (s.capacity ?? 0) - (s.booked ?? 0));
    return map;
  }, {});

    const canPublish = Boolean(trailId && date && !duplicate && Number(capacity) > 0 && guide);

    const handlePublish = () => {
        if (!canPublish) return;
        onConfirm({
            id: `sch-${trailId}-${dateKey}`,
            trailId,
            trail: trail.name,
            date: formatDateLabel(date),
            dateKey,
            capacity: Number(capacity),
            guide,
        });
    };

    return (
        <div className="fixed inset-0 z-40">
            <div
                className={`absolute inset-0 bg-inverse-surface/60 ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                onClick={requestClose}
                aria-hidden="true"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="New trail schedule"
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-left animation-duration-300' : 'animate-in slide-in-from-left animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold tracking-tight text-on-surface">New trail schedule</h2>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Pick the trail, the climb date, how many slots to open, and the guide.
                        </p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={requestClose}
                        aria-label="Close new schedule form"
                        className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    <div>
                        <FieldLabel>Trail</FieldLabel>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {TRAIL_ORDER.map((id) => (
                                <Chip key={id} active={trailId === id} onClick={() => setTrailId(id)}>
                                    {TRAILS[id].name}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <div>
                        <FieldLabel>Date</FieldLabel>
                        <div className="mt-3 rounded-md border border-outline-variant/40 p-2">
                            <Calendar mode="single" selected={date} onSelect={setDate} slots={trailScheduleSlots} allowUnscheduled disableScheduled />
                        </div>
                        {duplicate && (
                            <p className="mt-2 text-xs font-semibold text-red-600">
                                A schedule already exists for this trail and date.
                            </p>
                        )}
                        {trailId && trailSchedules.length > 0 && !duplicate && (
                            <p className="mt-2 text-xs text-on-surface-variant">
                                Already scheduled: {trailSchedules.map((s) => s.date).join(', ')}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="schedule-capacity" className="block">
                            <FieldLabel>Open slots</FieldLabel>
                        </label>
                        <Input
                            id="schedule-capacity"
                            type="number"
                            min="1"
                            max="200"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="mt-3 max-w-30"
                        />
                        <p className="mt-1.5 text-xs text-on-surface-variant">
                            Total spots on this date. Bookings fill it until none are left.
                        </p>
                    </div>

                    <div>
                        <FieldLabel>Guide</FieldLabel>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {guides.map((name) => (
                                <Chip key={name} active={guide === name} onClick={() => setGuide(name)}>
                                    {name}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-outline-variant/20 px-5 py-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="lg" className="cursor-pointer" onClick={requestClose}>
                            Cancel
                        </Button>
                        <Button size="lg" className="cursor-pointer" disabled={!canPublish} onClick={handlePublish}>
                            Publish schedule
                        </Button>
                    </div>
                </div>
            </aside>
        </div>
    );
}