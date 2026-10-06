import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar as CalendarIcon, Users, ChevronRight } from 'lucide-react';
import StatusPill from './StatusPill';

export default function TransactionCard({ transaction, onViewTicket }) {
    return (
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                        {transaction.transactionId}
                    </span>
                    <StatusPill status={transaction.status} />
                </div>

                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{transaction.trail}</span>
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        Climb: <strong className="text-on-surface">{transaction.hikeDate}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {transaction.participantCount} participant(s)
                    </span>
                    <span>Booked: {transaction.dateBooked}</span>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t border-outline-variant/20 pt-3 md:border-0 md:pt-0">
                <div className="text-left md:text-right">
                    <p className="text-xs text-on-surface-variant">{transaction.paymentMethod}</p>
                    <p className="text-lg font-extrabold text-primary">{transaction.totalPaid}</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewTicket(transaction)}
                    className="gap-2 cursor-pointer"
                >
                    <span>View Ticket</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
