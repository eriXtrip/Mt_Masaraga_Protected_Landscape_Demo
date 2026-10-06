import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import ChartContainer from './ChartContainer';

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
    Available: 'var(--chart-1)',
    Limited: 'var(--chart-5)',
    Full: 'var(--destructive)',
};

export default function TrailCapacityHeatmap({
    schedules = [],
    quota = [],
    selectedTrail = 'all',
    dateFilter = 'all',
}) {
    const { chartData, trails } = useMemo(() => {
        let filtered = schedules;
        if (selectedTrail !== 'all') {
            filtered = schedules.filter((s) => s.trail === selectedTrail);
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            if (dateFilter === 'current-month') {
                filtered = filtered.filter((s) => {
                    if (!s.dateKey) return false;
                    const [year, month] = s.dateKey.split('-');
                    return `${year}-${month}` === currentMonthKey;
                });
            } else {
                filtered = filtered.filter((s) => {
                    if (!s.dateKey) return false;
                    const [year, month] = s.dateKey.split('-');
                    return `${year}-${month}` === dateFilter;
                });
            }
        }

        const detectedTrails = [...new Set(filtered.map((s) => s.trail))];
        const dateMap = new Map();

        filtered.forEach((schedule) => {
            const quotaEntry = quota.find(
                (q) => q.trailId === schedule.trailId && q.date === schedule.date
            );
            const booked = quotaEntry?.booked ?? schedule.booked ?? 0;
            const capacity = quotaEntry?.capacity ?? schedule.capacity ?? 0;
            const fillPct = capacity ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;
            const status =
                quotaEntry?.status ?? (fillPct >= 100 ? 'Full' : fillPct >= 75 ? 'Limited' : 'Available');

            const dateKey = schedule.date;

            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, {
                    date: schedule.date,
                    dateKey: schedule.dateKey,
                });
            }

            const row = dateMap.get(dateKey);
            row[schedule.trail] = fillPct;

            row[`${schedule.trail}_details`] = {
                trail: schedule.trail,
                booked,
                capacity,
                fillPct,
                status,
                guide: schedule.guide,
            };
        });

        const sortedData = Array.from(dateMap.values()).sort(
            (a, b) => new Date(a.dateKey || a.date).getTime() - new Date(b.dateKey || b.date).getTime()
        );

        return { chartData: sortedData, trails: detectedTrails };
    }, [schedules, quota, selectedTrail, dateFilter]);

    if (!chartData || chartData.length === 0) {
        const hasActiveFilters =
            Boolean(selectedTrail) ||
            Boolean(dateFilter);

        return (
            <div className="flex flex-col items-center justify-center min-h-65 h-full text-center px-4 py-8 rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-lowest/50">
                {/* Dynamic Icon Badge */}
                <div className="w-12 h-12 rounded-full bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/70 mb-3 shrink-0">
                    {hasActiveFilters ? (
                        /* Filter Funnel Icon */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                    ) : (
                        /* Empty Folder / Inbox Icon */
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3.75h3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                    )}
                </div>

                {/* Dynamic Title */}
                <h4 className="text-sm font-semibold text-on-surface mb-1">
                    {hasActiveFilters ? "No matching records found" : "No data available"}
                </h4>

                {/* Dynamic Contextual Copy */}
                <p className="text-xs text-on-surface-variant max-w-xs mb-4 leading-relaxed">
                    {hasActiveFilters
                        ? "No records match your selected criteria. Try adjusting or clearing your filters."
                        : "There are no entries recorded yet. Check back later or create a new record."}
                </p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40 shadow-lg min-w-50">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                        {label}
                    </p>

                    <div className="flex flex-col gap-3">
                        {payload.map((item) => {
                            const trailKey = item.dataKey;
                            const entry = item.payload[`${trailKey}_details`];

                            if (!entry) return null;

                            return (
                                <div key={trailKey} className="border-t border-outline-variant/20 pt-2 first:border-0 first:pt-0">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full inline-block"
                                            style={{ backgroundColor: CHART_COLORS[trails.indexOf(entry.trail) % CHART_COLORS.length] }}
                                        />
                                        <p className="font-bold text-sm text-on-surface">{entry.trail}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 mt-1">
                                        <span className="text-sm font-medium text-on-surface">
                                            {entry.booked} / {entry.capacity} slots
                                        </span>
                                        <span
                                            className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded-full"
                                            style={{
                                                backgroundColor: `${STATUS_COLORS[entry.status]}20`,
                                                color: STATUS_COLORS[entry.status],
                                            }}
                                        >
                                            {entry.status}
                                        </span>
                                    </div>

                                    {entry.guide && (
                                        <p className="text-xs text-on-surface-variant mt-1">Guide: {entry.guide}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartContainer height={350}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide tickLine={false} axisLine={false} />
                <YAxis
                    type="category"
                    dataKey="date"
                    width={100}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} isAnimationActive={false} />

                <Legend wrapperStyle={{ paddingTop: 20 }} />

                {trails.map((trail, index) => (
                    <Bar
                        key={trail}
                        dataKey={trail}
                        name={trail}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        radius={[0, 4, 4, 0]}
                        maxBarSize={20}
                        minPointSize={5}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    );
}