import { Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingModal from './BookingModal';
import { formatter } from './bookingUtils';

export default function RefundBookingModal({ booking, onConfirm, onClose }) {
    const processingFee = booking.feeBreakdown.find((fee) => fee.label === 'Processing fee')?.amount ?? 0;
    const refundable = booking.totalPaid - processingFee;

    return (
        <BookingModal
            title="Process refund"
            subtitle={`${booking.reference} · refund to the original payment method`}
            onClose={onClose}
        >
            {({ requestClose }) => (
                <div className="space-y-4">
                    <div className="space-y-1.5 rounded-2xl bg-surface-container-low p-4 text-sm">
                        <p className="flex items-center gap-2 text-on-surface-variant">
                            <Receipt className="h-4 w-4 text-primary" />
                            {booking.paymentMethod}
                        </p>
                        <p className="flex items-center justify-between text-on-surface-variant">
                            Amount paid
                            <span className="font-bold text-on-surface">{formatter.format(booking.totalPaid)}</span>
                        </p>
                        <p className="flex items-center justify-between text-on-surface-variant">
                            Non-refundable processing fee
                            <span className="font-semibold text-on-surface">-{formatter.format(processingFee)}</span>
                        </p>
                        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2">
                            <span className="font-semibold text-on-surface">Refundable amount</span>
                            <span className="font-bold text-primary">{formatter.format(refundable)}</span>
                        </div>
                    </div>

                    <p className="text-xs leading-relaxed text-on-surface-variant">
                        Releasing this refund marks the booking as Refunded and returns {formatter.format(refundable)} to {booking.leadHiker}'s {booking.paymentMethod} account within 7 to 14 banking days.
                    </p>

                    <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
                        <Button variant="ghost" onClick={requestClose} className="cursor-pointer">
                            Keep booking
                        </Button>
                        <Button variant="destructive" onClick={onConfirm} className="cursor-pointer">
                            Process refund
                        </Button>
                    </div>
                </div>
            )}
        </BookingModal>
    );
}