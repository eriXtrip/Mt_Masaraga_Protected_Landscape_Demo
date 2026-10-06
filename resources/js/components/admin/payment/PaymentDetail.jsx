import { useEffect, useRef } from 'react';
import {
    X, Hash, Calendar, Users, MapPin, CreditCard, CheckCircle2,
    Receipt, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { formatter, STATUS_CONFIG } from '../booking/bookingUtils';

function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

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

export default function PaymentDetail({ booking, onClose }) {
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

    if (!booking) return null;

    const processingFee = booking.feeBreakdown?.find((f) => f.label === 'Processing fee')?.amount ?? 50;

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
                aria-label={`Payment ${booking.reference}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            <CreditCard className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">Payment Details</p>
                            <p className="truncate text-xs text-on-surface-variant flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {booking.reference}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <StatusPill status={booking.status} />
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={requestClose}
                            aria-label="Close payment details"
                            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    <DetailSection title="Transaction">
                        <div className="space-y-2">
                            <DetailRow icon={Receipt} label="Reference" value={booking.reference} />
                            <DetailRow icon={CreditCard} label="Method" value={booking.paymentMethod} />
                            <DetailRow icon={Calendar} label="Date" value={booking.date} />
                        </div>
                    </DetailSection>

                    <DetailSection title="Hiker & Booking">
                        <div className="space-y-2">
                            <DetailRow icon={Users} label="Lead hiker" value={booking.leadHiker} />
                            <DetailRow icon={MapPin} label="Trail" value={booking.trail} />
                            <DetailRow icon={Users} label="Group size" value={`${booking.participants} pax`} />
                        </div>
                    </DetailSection>

                    <DetailSection title="Fee Breakdown">
                        <div className="rounded-2xl border border-outline-variant/40 p-4">
                            <div className="space-y-2">
                                {booking.feeBreakdown?.map((fee, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-on-surface-variant">{fee.label}</span>
                                        <span className="font-semibold text-on-surface">{formatter.format(fee.amount)}</span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between gap-3 border-t border-outline-variant/20 pt-2 text-sm">
                                    <span className="font-semibold text-on-surface">Total Paid</span>
                                    <span className="text-lg font-extrabold text-primary">{formatter.format(booking.totalPaid)}</span>
                                </div>
                            </div>
                            <p className="mt-3 text-[11px] text-on-surface-variant">
                                Ref {booking.reference} · {booking.paymentMethod}. Processing fee is non-refundable.
                            </p>
                        </div>
                    </DetailSection>

                    <DetailSection title="Refund Policy">
                        <div className="rounded-2xl border border-outline-variant/40 p-4 text-sm leading-relaxed text-on-surface-variant">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p>
                                        Cancellations <strong>2+ days before</strong> the hike receive a full base fee refund minus the non-refundable <strong>{formatter.format(processingFee)}</strong> processing fee.
                                    </p>
                                    <p>
                                        Cancellations <strong>1 day before</strong> receive 50% of the base fee minus the processing fee.
                                    </p>
                                    <p>
                                        Cancellations <strong>less than 24 hours</strong> before the hike are non-refundable.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DetailSection>
                </div>

                {/* Footer */}
                <div className="border-t border-outline-variant/20 px-5 py-4">
                    {booking.status === 'Refunded' ? (
                        <p className="text-center text-xs text-on-surface-variant">
                            This payment has been refunded.
                        </p>
                    ) : (
                        <p className="text-center text-xs text-on-surface-variant">
                            Processed via {booking.paymentMethod} · Ref {booking.reference}
                        </p>
                    )}
                </div>
            </aside>
        </div>
    );
}
