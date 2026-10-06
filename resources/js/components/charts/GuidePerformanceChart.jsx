import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
} from 'recharts';
import ChartContainer from './ChartContainer';
import useGuideStats from '@/hooks/useGuideStats';

const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
    'var(--chart-7)',
    'var(--chart-8)',
    'var(--chart-9)',
    'var(--chart-10)',
];

const STATUS_COLORS = {
    Active: 'var(--chart-1)',
    'On Leave': 'var(--chart-5)',
    Inactive: 'var(--destructive)',
};

export default function GuidePerformanceChart({ guides = [], bookings = [] }) {
    const guideStats = useGuideStats(guides, bookings);
    const activeGuides = guideStats.filter((g) => g.status === 'Active');

    if (activeGuides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-65 h-full text-center px-4 py-8 rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-lowest/50">
                {/* Dynamic Icon Badge */}
                <div className="w-12 h-12 rounded-full bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/70 mb-3 shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3.75h3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                </div>

                {/* Dynamic Title */}
                <h4 className="text-sm font-semibold text-on-surface mb-1">
                    No data available
                </h4>

                {/* Dynamic Contextual Copy */}
                <p className="text-xs text-on-surface-variant max-w-xs mb-4 leading-relaxed">
                    There are no entries recorded yet. Check back later or create a new record.
                </p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const guide = payload[0].payload;
            return (
                <div className="pointer-events-none bg-surface-container p-3 rounded-lg border border-outline-variant/40 shadow-lg transition-opacity duration-150 ease-out">
                    <p className="font-bold text-on-surface">{guide.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                            <span className="text-on-surface-variant">Total Climbs: </span>
                            <span className="font-medium text-on-surface">{guide.assignedBookings}</span>
                        </div>
                        <div>
                            <span className="text-on-surface-variant">Total Hikers: </span>
                            <span className="font-medium text-on-surface">{guide.totalHikers}</span>
                        </div>
                        <div>
                            <span className="text-on-surface-variant">Avg Group: </span>
                            <span className="font-medium text-on-surface">{guide.avgGroupSize}</span>
                        </div>
                        <div>
                            <span className="text-on-surface-variant">Revenue: </span>
                            <span className="font-medium text-on-surface">₱{guide.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="text-on-surface-variant">Rating: </span>
                            <span className="font-medium text-on-surface">{guide.rating}/5.0</span>
                        </div>
                        <div>
                            <span className="text-on-surface-variant">Specialization: </span>
                            <span className="font-medium text-on-surface">{guide.specialization}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <ChartContainer height={350}>
                {/* Standard layout for Upright Vertical Columns */}
                <BarChart
                    data={activeGuides}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                        isAnimationActive={false}
                        offset={12}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar
                        dataKey="assignedBookings"
                        name="Total Climbs"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={32}
                        minPointSize={5}
                    >
                        {activeGuides.map((guide, index) => (
                            <Cell
                                key={guide.id || index}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}