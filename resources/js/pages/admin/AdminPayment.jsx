import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useAdminStore } from '../../state/adminStore';
import PaymentSummary from '../../components/admin/payment/PaymentSummary';
import PaymentFilters from '../../components/admin/payment/PaymentFilters';
import PaymentList from '../../components/admin/payment/PaymentList';
import PaymentDetail from '../../components/admin/payment/PaymentDetail';
import RefundLog from '../../components/admin/payment/RefundLog';

export default function AdminPayment() {
    const { bookings } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [methodFilter, setMethodFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const filteredBookings = bookings.filter((booking) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            booking.leadHiker.toLowerCase().includes(term) ||
            booking.reference.toLowerCase().includes(term) ||
            booking.trail.toLowerCase().includes(term) ||
            booking.paymentMethod.toLowerCase().includes(term);
        const matchesMethod = methodFilter === 'All' || booking.paymentMethod === methodFilter;
        const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
        return matchesSearch && matchesMethod && matchesStatus;
    });

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <header
                    style={{ transitionDelay: '0ms' }}
                    className={`max-w-2xl space-y-1.5 transition-all duration-700 ease-out ${
                        isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    }`}
                >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                        Admin Console · Payments
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                        Payments
                    </h1>
                    <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                        Track payment methods, reference numbers, and refunds across all bookings.
                    </p>
                </header>

                <div
                    style={{ transitionDelay: '150ms' }}
                    className={`transition-all duration-700 ease-out ${
                        isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    }`}
                >
                    <PaymentSummary bookings={bookings} />
                </div>

                <div
                    style={{ transitionDelay: '250ms' }}
                    className={`transition-all duration-700 ease-out ${
                        isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    }`}
                >
                    <PaymentFilters
                        searchTerm={searchTerm}
                        methodFilter={methodFilter}
                        statusFilter={statusFilter}
                        resultCount={filteredBookings.length}
                        totalCount={bookings.length}
                        onSearch={setSearchTerm}
                        onMethod={setMethodFilter}
                        onStatus={setStatusFilter}
                    />
                </div>

                <div
                    style={{ transitionDelay: '350ms' }}
                    className={`transition-all duration-700 ease-out ${
                        isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    }`}
                >
                    <PaymentList
                        bookings={filteredBookings}
                        onSelect={setSelectedBooking}
                    />
                </div>

                <div
                    style={{ transitionDelay: '450ms' }}
                    className={`transition-all duration-700 ease-out ${
                        isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                    }`}
                >
                    <RefundLog bookings={bookings} />
                </div>
            </div>

            {selectedBooking && (
                <PaymentDetail
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </>
    );
}
