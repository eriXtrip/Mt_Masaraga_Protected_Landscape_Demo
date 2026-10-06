import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import BookingModal from './BookingModal';
import { formatDateLabel } from './bookingUtils';

export default function RescheduleBookingModal({ booking, onConfirm, onClose }) {
    const [date, setDate] = useState(null);

    return (
        <BookingModal
            title="Reschedule climb date"
            subtitle={`${booking.reference} · current date ${booking.date}`}
            onClose={onClose}
        >
            {({ requestClose }) => (
                <div className="space-y-5">
                    <Calendar mode="single" selected={date} onSelect={setDate} />

                    <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
                        <Button variant="ghost" onClick={requestClose} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            disabled={!date}
                            onClick={() => onConfirm(formatDateLabel(date))}
                            className="cursor-pointer"
                        >
                            Confirm new date
                        </Button>
                    </div>
                </div>
            )}
        </BookingModal>
    );
}