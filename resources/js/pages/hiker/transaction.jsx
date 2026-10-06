import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useHikerStore, cancelBooking } from '../../state/hikerStore';
import CancelBookingModal from '../../components/admin/booking/CancelBookingModal';
import { toast } from '../../components/ui/toast';
import {
    TransactionHeader,
    TransactionFilters,
    TransactionCard,
    TransactionEmptyState,
    TransactionDetailView,
} from '../../components/hiker/transaction';

export default function Transaction() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { transactions } = useHikerStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [cancelOpen, setCancelOpen] = useState(false);

    const filteredTransactions = transactions.filter((txn) => {
        const matchesSearch =
            txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.trail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'All' || txn.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const confirmCancel = (reason) => {
        if (!selectedTransaction) return;
        cancelBooking(selectedTransaction.transactionId, reason);
        setSelectedTransaction((current) => (current ? { ...current, status: 'Cancelled' } : current));
        toast.add({ type: 'success', title: 'Booking cancelled', description: 'Refunds follow the Refund and Return Policy.' });
        setCancelOpen(false);
    };

    const parseCurrency = (val) => {
        const num = parseFloat(String(val).replace(/[₱,\s]/g, ''));
        return Number.isNaN(num) ? 0 : num;
    };

    if (selectedTransaction) {
        return (
            <>
                <TransactionDetailView
                    transaction={selectedTransaction}
                    onBack={() => setSelectedTransaction(null)}
                    onCancelClick={() => setCancelOpen(true)}
                />

                {cancelOpen && selectedTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                        <div className="w-full max-w-lg">
                            <CancelBookingModal
                                booking={{
                                    reference: selectedTransaction.transactionId,
                                    trail: selectedTransaction.trail,
                                    date: selectedTransaction.hikeDate,
                                    participants: selectedTransaction.participantCount,
                                    totalPaid: parseCurrency(selectedTransaction.totalPaid),
                                    feeBreakdown: selectedTransaction.receiptData?.breakdown,
                                }}
                                onConfirm={confirmCancel}
                                onClose={() => setCancelOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div ref={sectionRef} className="min-h-dvh bg-surface p-4 md:p-8 font-sans overflow-hidden">
            <div className={`max-w-5xl mx-auto space-y-6 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <TransactionHeader />

                <TransactionFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                />

                <div className="space-y-4">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((txn) => (
                            <TransactionCard
                                key={txn.transactionId}
                                transaction={txn}
                                onViewTicket={setSelectedTransaction}
                            />
                        ))
                    ) : (
                        <TransactionEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}
