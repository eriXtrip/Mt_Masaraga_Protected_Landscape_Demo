import React, { useState } from 'react';
import { CalendarClock, Users, Receipt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingModal from './BookingModal';
import { formatter, getRefundNotice, getRefundAmount } from './bookingUtils';

const CANCELLATION_REASONS = [
    'Change of plans',
    'Schedule conflict',
    'Weather concerns',
    'Health reasons',
    'Others',
];

export default function CancelBookingModal({ booking, onConfirm, onClose }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const refundAmount = getRefundAmount(booking);

    const handleConfirm = () => {
        const reason = selectedReason === 'Others' ? customReason : selectedReason;
        onConfirm(reason);
    };

    return (
        <BookingModal
            title="Cancel booking"
            subtitle={`${booking.reference} - ${booking.trail}`}
            onClose={onClose}
            side="right"
        >
            {({ requestClose }) => (
                <div className="space-y-4">
                    <div className="space-y-2 rounded-2xl bg-surface-container-low p-4 text-sm">
                        <p className="flex items-center gap-2 text-on-surface-variant">
                            <CalendarClock className="h-4 w-4 text-primary shrink-0" />
                            Climb date: <strong className="text-on-surface">{booking.date}</strong>
                        </p>
                        <p className="flex items-center gap-2 text-on-surface-variant">
                            <Users className="h-4 w-4 text-primary shrink-0" />
                            {booking.participants} participant(s)
                        </p>
                        <p className="flex items-center gap-2 text-on-surface-variant">
                            <Receipt className="h-4 w-4 text-primary shrink-0" />
                            Amount paid: <strong className="text-on-surface">{formatter.format(booking.totalPaid)}</strong>
                        </p>
                    </div>

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p className="font-semibold">Refund estimate</p>
                        <p className="mt-1">{getRefundNotice(booking.date)}</p>
                        {refundAmount > 0 && (
                            <p className="mt-2 font-bold text-base">{formatter.format(refundAmount)}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label htmlFor="cancel-reason" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Reason for Cancellation <span className="text-destructive">*</span>
                            </label>
                            {selectedReason && (
                                <span className="text-xs text-muted-foreground">Select one</span>
                            )}
                        </div>

                        {/* Radio Chip Grid */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {CANCELLATION_REASONS.map((reason) => {
                                const isSelected = selectedReason === reason;
                                return (
                                    <button
                                        key={reason}
                                        type="button"
                                        onClick={() => setSelectedReason(reason)}
                                        className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-all cursor-pointer ${isSelected
                                            ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary'
                                            : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low hover:border-outline-variant'
                                            }`}
                                    >
                                        <span className="truncate">{reason}</span>
                                        <span
                                            className={`ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${isSelected
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-outline-variant/60 bg-transparent'
                                                }`}
                                        >
                                            {isSelected && <Check className="h-2.5 w-2.5 stroke-3" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Expandable Free-Text Area when "Others" is selected */}
                        {selectedReason === 'Others' && (
                            <div className="mt-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <textarea
                                    rows={3}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Please describe your reason for cancelling..."
                                    className="w-full resize-none overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3 text-xs text-on-surface placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        )}
                    </div>

                    <p className="text-xs leading-relaxed text-on-surface-variant">
                        Refunds are processed within 7 to 14 banking days after the cancellation is confirmed, per the Refund and Return Policy.
                    </p>

                    <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
                        <Button variant="ghost" onClick={requestClose} className="cursor-pointer">
                            Keep booking
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} className="cursor-pointer">
                            Cancel booking
                        </Button>
                    </div>
                </div>
            )}
        </BookingModal>
    );
}