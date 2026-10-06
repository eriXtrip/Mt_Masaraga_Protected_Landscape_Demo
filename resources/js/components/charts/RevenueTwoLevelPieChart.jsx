import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts';
import ChartContainer from './ChartContainer';

const TRAIL_COLORS = [
    'var(--chart-1)',
    'var(--chart-3)',
    'var(--chart-5)',
    'var(--chart-7)',
    'var(--chart-9)',
];

const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export default function RevenueTwoLevelPieChart({ bookings, selectedTrail = 'all' }) {
    const { innerData, outerData, totalRevenue, payments, paymentColors } = useMemo(() => {
        const filtered = selectedTrail === 'all'
            ? bookings
            : bookings.filter((b) => b.trail === selectedTrail);

        const trailMap = new Map();
        const paymentMap = new Map();

        filtered.forEach((booking) => {
            const trail = booking.trail;
            const payment = booking.paymentMethod;
            const amount = booking.totalPaid || 0;

            trailMap.set(trail, (trailMap.get(trail) || 0) + amount);
            paymentMap.set(payment, (paymentMap.get(payment) || 0) + amount);
        });

        const paymentList = [...paymentMap.keys()].sort();

        const colors = {};
        paymentList.forEach((payment, index) => {
            colors[payment] = `var(--chart-${(index % 10) + 1})`;
        });

        // Inner pie: revenue per trail
        const inner = Array.from(trailMap, ([trail, total]) => ({
            name: trail,
            value: total,
        }));

        // Outer pie: revenue by payment method (all trails combined)
        const outer = paymentList.map((payment) => ({
            name: payment,
            value: paymentMap.get(payment),
            color: colors[payment],
        }));

        const total = Array.from(trailMap.values()).reduce((sum, t) => sum + t, 0);

        return {
            innerData: inner,
            outerData: outer,
            totalRevenue: total,
            payments: paymentList,
            paymentColors: colors,
        };
    }, [bookings, selectedTrail]);

    if (innerData.length === 0) {
        const hasActiveFilters = Boolean(selectedTrail) && selectedTrail !== 'all';

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

    const CombinedTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / totalRevenue) * 100).toFixed(1);

            return (
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40 shadow-lg">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded shrink-0"
                            style={{ backgroundColor: data.payload.color || data.fill }}
                        />
                        <p className="font-bold text-on-surface">{data.name}</p>
                    </div>
                    <p className="text-sm font-medium text-on-surface mt-1">{formatter.format(data.value)}</p>
                    <p className="text-xs text-on-surface-variant">{percentage}% of total</p>
                </div>
            );
        }
        return null;
    };

    const renderInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        if (percent < 0.08) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y - 6}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontWeight={700}
            >
                {name.length > 10 ? name.slice(0, 10) + '...' : name}
            </text>
        );
    };

    const renderOuterLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.04) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={9}
                fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="space-y-4">
            {/* Total Revenue Display */}
            <div className="text-center">
                <p className="text-sm text-on-surface-variant">Total Revenue</p>
                <p className="text-3xl font-extrabold text-on-surface">{formatter.format(totalRevenue)}</p>
            </div>

            <ChartContainer height={400}>
                <PieChart>
                    {/* Outer Pie: Revenue by payment method */}
                    <Pie
                        data={outerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={100}
                        outerRadius={160}
                        paddingAngle={1}
                        dataKey="value"
                        label={renderOuterLabel}
                        labelLine={false}
                        stroke="var(--background)"
                        strokeWidth={1}
                    >
                        {outerData.map((entry, index) => (
                            <Cell key={`outer-${index}`} fill={entry.color} />
                        ))}
                    </Pie>

                    {/* Inner Pie: Revenue per trail */}
                    <Pie
                        data={innerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={95}
                        paddingAngle={2}
                        dataKey="value"
                        label={renderInnerLabel}
                        labelLine={false}
                        stroke="var(--background)"
                        strokeWidth={2}
                    >
                        {innerData.map((entry, index) => (
                            <Cell key={`inner-${index}`} fill={TRAIL_COLORS[index % TRAIL_COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip content={<CombinedTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={50}
                        formatter={(value) => (
                            <span className="text-sm text-on-surface">{value}</span>
                        )}
                    />
                </PieChart>
            </ChartContainer>

            {/* Payment Methods Legend - Shows ALL payment methods */}
            <div className="border-t border-outline-variant/20 pt-3">
                <p className="text-xs font-semibold text-on-surface-variant text-center mb-2">
                    Payment Methods
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    {payments.map((payment) => (
                        <div key={payment} className="flex items-center gap-1.5">
                            <span
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: paymentColors[payment] }}
                            />
                            <span className="text-xs text-on-surface-variant">{payment}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}