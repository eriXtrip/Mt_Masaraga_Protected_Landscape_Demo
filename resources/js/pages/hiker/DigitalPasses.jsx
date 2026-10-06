import React from 'react';
import { useInView } from '@/hooks/useInView';
import { useHikerStore } from '../../state/hikerStore';
import { ADMIN_BOOKINGS } from '../../mockData';
import { ShieldCheck } from 'lucide-react';
import {
    DigitalPassesHeader,
    PassStats,
    ActivePassCard,
    UsedCancelledPassItem,
    EmptyPassesState,
} from '../../components/hiker/digitalpass';

const bookingsByReference = new Map(ADMIN_BOOKINGS.map((booking) => [booking.reference, booking]));

export default function DigitalPasses() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { transactions } = useHikerStore();

    const passes = transactions.flatMap((txn) => {
        const booking = bookingsByReference.get(txn.transactionId);
        const assignedLeadHiker = txn.passesData?.[0]?.leadHiker;

        return (txn.passesData || []).map((pass, index) => ({
            ...pass,
            hikerName: booking?.hikers?.[index]?.fullName || pass.hikerName,
            leadHiker: assignedLeadHiker,
            transactionId: txn.transactionId,
            hikeDate: txn.hikeDate,
        }));
    });

    const activePasses = passes.filter((pass) => pass.status === 'Valid');
    const otherPasses = passes.filter((pass) => pass.status !== 'Valid');

    return (
        <div ref={sectionRef} className="min-h-dvh bg-surface font-sans">
            <div className={`max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                <DigitalPassesHeader />

                {passes.length === 0 ? (
                    <EmptyPassesState />
                ) : (
                    <>
                        <PassStats activeCount={activePasses.length} otherCount={otherPasses.length} />

                        {activePasses.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        <span className="h-4 w-4 text-primary flex items-center justify-center font-bold">✓</span>
                                        Active Passes
                                    </span>
                                </div>

                                {activePasses.map((pass) => (
                                    <ActivePassCard key={pass.id} pass={pass} />
                                ))}
                            </section>
                        )}

                        {otherPasses.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        Used & Cancelled Passes
                                    </span>
                                </div>
                                <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl divide-y divide-outline-variant/20 shadow-xs overflow-hidden">
                                    {otherPasses.map((pass) => (
                                        <UsedCancelledPassItem key={pass.id} pass={pass} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
