import { useState, useMemo } from 'react';
import { Download, Filter } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '../../state/adminStore';
import { ReportsSummary, ReportsList, ReportsFilters, ReportsCard } from '../../components/admin/reports';

export default function AdminReports() {
    const { bookings, schedules, quota, users } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [selectedTrail, setSelectedTrail] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    const allTrails = useMemo(() => [...new Set(schedules.map((s) => s.trail))].sort(), [schedules]);

    const filteredBookings = useMemo(() => {
        if (selectedTrail === 'all') return bookings;
        return bookings.filter((b) => b.trail === selectedTrail);
    }, [bookings, selectedTrail]);

    const filteredSchedules = useMemo(() => {
        if (selectedTrail === 'all') return schedules;
        return schedules.filter((s) => s.trail === selectedTrail);
    }, [schedules, selectedTrail]);

    const resultCount = filteredBookings.length;

    const handleClearFilters = () => {
        setSelectedTrail('all');
        setDateRange('all');
    };

    const handleViewTrailDetails = (trail) => {
        setSelectedTrail(trail);
    };

    return (
        <div ref={sectionRef} className="space-y-6 md:space-y-8">
            <header
                style={{ transitionDelay: '0ms' }}
                className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                        Admin Console · Reports
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                        Revenue & Fill Rate Reports
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant md:text-base">
                        Analyze revenue breakdown by fee type and trail capacity utilization across all schedules.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="lg" className="h-11! gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button variant="default" size="lg" className="h-11! gap-2">
                        <Filter className="h-4 w-4" />
                        Advanced Filters
                    </Button>
                </div>
            </header>

            <div
                style={{ transitionDelay: '150ms' }}
                className={`transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <ReportsSummary
                    bookings={bookings}
                    schedules={schedules}
                    quota={quota}
                    dateRange={dateRange}
                />
            </div>

            <div
                style={{ transitionDelay: '300ms' }}
                className={`transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <ReportsFilters
                    trails={allTrails}
                    selectedTrail={selectedTrail}
                    onTrailChange={setSelectedTrail}
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    onClear={handleClearFilters}
                    resultCount={resultCount}
                />
            </div>

            <div
                style={{ transitionDelay: '600ms' }}
                className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                {allTrails.map((trail) => (
                    <ReportsCard
                        key={trail}
                        trail={trail}
                        bookings={bookings}
                        schedules={schedules}
                        onViewDetails={handleViewTrailDetails}
                    />
                ))}
            </div>

            <div
                style={{ transitionDelay: '450ms' }}
                className={`transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <ReportsList
                    bookings={bookings}
                    schedules={schedules}
                    selectedTrail={selectedTrail}
                />
            </div>
        </div>
    );
}