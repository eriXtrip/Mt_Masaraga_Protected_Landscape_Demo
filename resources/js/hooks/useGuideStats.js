import { useMemo } from 'react';

export function computeGuideStats(guides = [], bookings = []) {
    return guides.map((guide) => {
        const assignedBookings = bookings.filter((b) => {
            const scheduleTrail = b.trail || '';
            return guide.assignedTrails?.some((t) => scheduleTrail.includes(t === 'amtic' ? 'Amtic' : 'Balogo'));
        });

        const completedBookings = assignedBookings.filter((b) => b.status === 'Completed' || b.status === 'Confirmed');
        const totalClimbs = completedBookings.length;
        const totalHikers = completedBookings.reduce((sum, b) => sum + (b.participants || 0), 0);
        const avgGroupSize = totalClimbs > 0 ? totalHikers / totalClimbs : 0;
        const revenue = completedBookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);

        return {
            ...guide,
            assignedBookings: totalClimbs,
            totalHikers,
            avgGroupSize: Math.round(avgGroupSize * 10) / 10,
            revenue,
            utilization: guide.totalClimbs > 0 ? Math.min(100, Math.round((totalClimbs / guide.totalClimbs) * 100)) : 0,
        };
    });
}

export default function useGuideStats(guides = [], bookings = []) {
    return useMemo(() => computeGuideStats(guides, bookings), [guides, bookings]);
}
