import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StatusPill } from './helpers.jsx';

export default function RecentBookings({ transactions }) {
    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Recent Bookings</p>
                <button
                    type="button"
                    onClick={() => navigate('/hiker/transactions')}
                    className="text-xs font-semibold text-primary hover:underline focus-visible:outline-primary cursor-pointer transition-colors"
                >
                    View all
                </button>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl divide-y divide-outline-variant/20 shadow-xs overflow-hidden">
                {transactions.length > 0 ? (
                    transactions.map((txn) => (
                        <button
                            key={txn.transactionId}
                            type="button"
                            onClick={() => navigate('/hiker/transactions')}
                            className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors hover:bg-surface-container focus-visible:outline-primary cursor-pointer"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface truncate">{txn.trail}</p>
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    {txn.hikeDate} &middot; {txn.referenceNo}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <StatusPill status={txn.status} />
                                <ChevronRight className="h-4 w-4 text-outline" />
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="px-5 py-8 text-center">
                        <p className="text-sm font-semibold text-on-surface">No bookings yet</p>
                        <p className="text-xs text-on-surface-variant mt-1">
                            Complete a booking and it will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
