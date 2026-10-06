import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarClock, XCircle } from 'lucide-react';

export default function ManageBookingCard({ onCancelClick }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 md:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <CalendarClock className="h-5 w-5" />
                    </span>
                    <div>
                        <h3 className="text-base font-bold text-on-surface">Manage Booking</h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Need a different climb date? Message park staff on Messenger. Cancellations follow
                            the Refund and Return Policy.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        variant="destructive"
                        className="gap-2 cursor-pointer"
                        onClick={onCancelClick}
                    >
                        <XCircle className="h-4 w-4" />
                        Cancel Booking
                    </Button>
                </div>
            </div>
        </div>
    );
}
