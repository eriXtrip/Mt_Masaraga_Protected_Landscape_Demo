import { useEffect, useRef } from 'react';
import {
    X, Mail, CalendarClock, Users, MapPin, Receipt, ShieldCheck,
    Undo2, CircleOff, User, PhoneCall, Calendar, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import StatusPill from './StatusPill';
import { getInitials, formatter } from './bookingUtils';
import { HEALTH_QUESTIONS } from '../../../mockData';

function DetailSection({ title, children }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{title}</p>
            <div className="mt-3">{children}</div>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-on-surface-variant">{label}</span>
            <span className="ml-auto text-right font-semibold text-on-surface">{value}</span>
        </div>
    );
}

/* Redesigned Card-Style Block to Fix Crowded Layout in Side Drawers */
function InfoCard({ icon: Icon, label, value, className = "" }) {
    return (
        <div className={`flex items-start gap-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3 transition-colors hover:bg-surface-container-low ${className}`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {label}
                </p>
                <p className="mt-0.5 text-xs font-semibold leading-snug text-on-surface wrap-break-word">
                    {value || 'Not provided'}
                </p>
            </div>
        </div>
    );
}

function HikerDetail({ hiker, index }) {
    return (
        <section className="rounded-2xl border border-outline-variant/40 p-4 bg-surface-container-lowest shadow-xs">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Hiker {index + 1}
                    </p>
                    <h3 className="mt-0.5 truncate text-sm font-bold text-on-surface">{hiker.fullName}</h3>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${hiker.agreeWaiver
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                    {hiker.agreeWaiver ? 'Waiver agreed' : 'Waiver missing'}
                </span>
            </div>

            {/* Structured Card Grid */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <InfoCard icon={Calendar} label="Date of birth" value={hiker.dateOfBirth} />
                <InfoCard icon={MapPin} label="Complete address" value={hiker.address} />
                <InfoCard icon={User} label="Emergency contact" value={hiker.emergencyName} />
                <InfoCard icon={Heart} label="Relationship" value={hiker.emergencyRelationship} />
                <InfoCard icon={PhoneCall} label="Contact number" value={hiker.emergencyContact} className="sm:col-span-2" />
            </div>

            {/* Health Declaration */}
            <div className="mt-4 border-t border-outline-variant/20 pt-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Health declaration</h4>
                <div className="mt-2 space-y-1.5">
                    {HEALTH_QUESTIONS.map((question) => {
                        const answer = hiker.healthAnswers?.[question.id];
                        return (
                            <div key={question.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low/60 px-3 py-2 text-xs">
                                <p className="leading-snug text-on-surface-variant">{question.question}</p>
                                <span className="shrink-0 font-bold capitalize text-primary">
                                    {answer || 'Not answered'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ActionButton({ icon: Icon, label, variant = 'outline', onClick }) {
    return (
        <Button variant={variant} onClick={onClick} className="w-full gap-2 cursor-pointer">
            <Icon className="h-4 w-4" />
            {label}
        </Button>
    );
}

export default function BookingDetail({ booking, guideOptions, scheduleGuide, onAction, onClose }) {
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

    const actions = [];

    if (booking.status === 'Upcoming') {
        actions.push(
            { key: 'cancel', label: 'Cancel booking', variant: 'outline', icon: CircleOff, action: () => onAction('cancel') }
        );
    }

    if (booking.status === 'Cancelled' || booking.status === 'Cancel') {
        actions.push(
            { key: 'refund', label: 'Process refund', variant: 'outline', icon: Undo2, action: () => onAction('refund') }
        );
    }

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
                aria-label={`Booking ${booking.reference}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <h1 className="truncate text-lg font-bold text-on-surface">{booking.reference}</h1>
                    <div className="flex shrink-0 items-center gap-2">
                        <StatusPill status={booking.status} />
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={requestClose}
                            aria-label="Close booking details"
                            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    <DetailSection title="Lead hiker">
                        <div className="space-y-2">
                            <DetailRow icon={Mail} label="Contact" value={booking.contact} />
                            <DetailRow icon={ShieldCheck} label="Guide" value={scheduleGuide || booking.guide || 'Not assigned'} />
                        </div>
                    </DetailSection>

                    <DetailSection title="Hikers">
                        <div className="space-y-3">
                            {booking.hikers?.length ? booking.hikers.map((hiker, index) => (
                                <HikerDetail key={hiker.fullName} hiker={hiker} index={index} />
                            )) : (
                                <p className="text-xs text-on-surface-variant">No hiker details available.</p>
                            )}
                        </div>
                    </DetailSection>

                    <DetailSection title="Climb">
                        <div className="space-y-2">
                            <DetailRow icon={MapPin} label="Trail" value={booking.trail} />
                            <DetailRow icon={CalendarClock} label="Date" value={booking.date} />
                            <DetailRow icon={Users} label="Group" value={`${booking.participants} pax`} />
                        </div>
                    </DetailSection>

                    <DetailSection title="Payment">
                        <div className="rounded-2xl border border-outline-variant/40 p-4">
                            <div className="space-y-2">
                                {booking.feeBreakdown.map((fee) => (
                                    <div key={fee.label} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-on-surface-variant">{fee.label}</span>
                                        <span className="font-semibold text-on-surface">{formatter.format(fee.amount)}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between gap-3 border-t border-outline-variant/20 pt-2 text-sm">
                                    <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                                        <Receipt className="h-4 w-4 text-primary" />
                                        {booking.paymentMethod}
                                    </span>
                                    <span className="font-bold text-on-surface">{formatter.format(booking.totalPaid)}</span>
                                </div>
                            </div>
                            <p className="mt-3 text-[11px] text-on-surface-variant">
                                Ref {booking.reference} · {booking.paymentMethod}. Processing fee is non-refundable.
                            </p>
                        </div>
                    </DetailSection>

                    <DetailSection title="On the day">
                        <div className="rounded-2xl border border-outline-variant/40 p-4 text-sm leading-relaxed text-on-surface-variant">
                            <p>
                                Booking {booking.reference} will be verified at the jump-off point on {booking.date}.
                            </p>
                            <p className="mt-2">
                                Physical documents (valid IDs and signed waivers for all members) are presented on the day, not uploaded in advance.
                            </p>
                        </div>
                    </DetailSection>
                </div>

                <div className="border-t border-outline-variant/20 px-5 py-4">
                    {actions.length > 0 ? (
                        <div className={`grid gap-3 ${actions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {actions.map((action) => (
                                <ActionButton key={action.key} icon={action.icon} label={action.label} variant={action.variant} onClick={action.action} />
                            ))}
                        </div>
                    ) : booking.status === 'Completed' ? (
                        <p className="text-center text-xs text-on-surface-variant">
                            This booking has completed its climb.
                        </p>
                    ) : booking.status === 'Refunded' ? (
                        <p className="text-center text-xs text-on-surface-variant">
                            This booking has been refunded.
                        </p>
                    ) : (
                        <p className="text-center text-xs text-on-surface-variant">
                            This booking is closed and can no longer be changed.
                        </p>
                    )}
                </div>
            </aside>
        </div>
    );
}