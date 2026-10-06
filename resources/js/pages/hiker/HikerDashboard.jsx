import React from 'react';
import { useInView } from '@/hooks/useInView';
import { NEWS } from '../../mockData';
import { useHikerStore } from '../../state/hikerStore';
import {
    DashboardHeader,
    UpcomingClimbCard,
    NoUpcomingClimbs,
    QuickActions,
    ParkAdvisories,
    RecentBookings,
    toDateKey,
    daysUntilHike,
    countdownLabel,
} from '../../components/hiker/dashboard';

export default function HikerDashboard() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { profile, transactions } = useHikerStore();

    const todayKey = toDateKey(new Date());
    const upcoming = transactions
        .filter((txn) => {
            const hikeKey = toDateKey(txn.hikeDate);
            return txn.status === 'Confirmed' && hikeKey && hikeKey >= todayKey;
        })
        .sort((a, b) => new Date(a.hikeDate) - new Date(b.hikeDate));

    const nextClimb = upcoming[0] || null;
    const nextClimbDays = nextClimb ? daysUntilHike(nextClimb.hikeDate) : null;
    const countdown = countdownLabel(nextClimbDays);

    const advisories = NEWS.filter((item) => ['Advisory', 'Weather'].includes(item.category)).slice(0, 2);
    const recent = transactions.slice(0, 3);

    return (
        <div ref={sectionRef} className="min-h-dvh bg-surface font-sans">
            <div className={`max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-10 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                <DashboardHeader
                    firstName={profile.name.split(' ')[0]}
                    hasUpcomingClimb={!!nextClimb}
                />

                {nextClimb ? (
                    <UpcomingClimbCard climb={nextClimb} countdown={countdown} />
                ) : (
                    <NoUpcomingClimbs />
                )}

                <QuickActions />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ParkAdvisories advisories={advisories} />
                    <RecentBookings transactions={recent} />
                </div>
            </div>
        </div>
    );
}
