import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { CalendarCheck, Wallet, Users, Mountain } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { NEWS } from '../../mockData';
import { useAdminStore } from '../../state/adminStore';
import UpcomingBookings from '../../components/admin/dashboard/PendingApprovals';
import DailySlotQuota from '../../components/admin/dashboard/DailySlotQuota';
import ParkAdvisories from '../../components/admin/dashboard/ParkAdvisories';
import { TrailCapacityHeatmap, AdminKPICards } from '../../components/charts';

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { profile, bookings, quota, users, schedules } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [selectedTrail, setSelectedTrail] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const firstName = (profile.name || 'Admin').split(' ')[0];

    const scheduledDates = [...new Set(bookings.filter((b) => b.status !== 'Completed').map((b) => b.date))];
    const hikeDay = scheduledDates[0] || null;

    const advisories = NEWS.filter((item) => ['Advisory', 'Weather'].includes(item.category)).slice(0, 2);

    const allTrails = [...new Set(schedules.map((s) => s.trail))].sort();

    function getMonthYearLabel(dateKey) {
        const [year, month] = dateKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }

    const monthYearOptions = useMemo(() => {
        const set = new Set();
        schedules.forEach((s) => {
            if (s.dateKey) {
                const [year, month] = s.dateKey.split('-');
                set.add(`${year}-${month}`);
            }
        });
        return [...set].sort().reverse().map((my) => {
            const [year, month] = my.split('-');
            return { value: my, label: getMonthYearLabel(`${year}-${month}-01`) };
        });
    }, [schedules]);

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
                        Admin Console · Dashboard
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                        Welcome back, {firstName}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant md:text-base">
                        Approve pending permits and keep an eye on daily slot capacity before the next hike day.
                    </p>
                </div>
                <Button
                    variant="default"
                    size="lg"
                    className="h-11! shrink-0 gap-2"
                    onClick={() => navigate('/admin/bookings')}
                >
                    <CalendarCheck className="h-4 w-4" />
                    Review bookings
                </Button>
            </header>

            <div
                style={{ transitionDelay: '200ms' }}
                className={`transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <AdminKPICards bookings={bookings} quota={quota} users={users} schedules={schedules} />
            </div>

            <div
                style={{ transitionDelay: '250ms' }}
                className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs hover:border-primary/30 hover:shadow-sm transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-on-surface">Trail Capacity Utilization</h3>
                    <div className='grid grid-cols-2 gap-3'>
                        <select
                            value={selectedTrail}
                            onChange={(e) => setSelectedTrail(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-outline-variant/40 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Trails</option>
                            {allTrails.map((trail) => (
                                <option key={trail} value={trail}>{trail}</option>
                            ))}
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-outline-variant/40 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Dates</option>
                            <option value="current-month">Current Month</option>
                            {monthYearOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <TrailCapacityHeatmap schedules={schedules} quota={quota} selectedTrail={selectedTrail} dateFilter={dateFilter} />
            </div>

            <div
                style={{ transitionDelay: '300ms' }}
                className={`transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <UpcomingBookings bookings={bookings} />
            </div>

            <div
                style={{ transitionDelay: '450ms' }}
                className={`grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 transition-all duration-700 ease-out ${isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <DailySlotQuota quota={quota} hikeDay={hikeDay} />
                <ParkAdvisories advisories={advisories} />
            </div>
        </div>
    );
}