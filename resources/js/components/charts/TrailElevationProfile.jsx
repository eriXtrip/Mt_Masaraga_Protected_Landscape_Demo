import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import ChartContainer from './ChartContainer';
import { useInView } from '@/hooks/useInView';

export default function TrailElevationProfile({ trail, className = '', showHeader = true }) {
    // Trigger when 15% of the element enters the viewport
    const [containerRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    // Process and clean elevation data points
    const elevationData = useMemo(() => {
        if (!trail?.elevationPoints || trail.elevationPoints.length === 0) return [];

        return trail.elevationPoints.map((point, index) => {
            const rawElevation = point.elevation ?? 0;
            const parsedNum = typeof rawElevation === 'number'
                ? rawElevation
                : parseFloat(String(rawElevation).replace(/[^0-9.-]/g, '')) || 0;

            return {
                ...point,
                index,
                elevationNum: Math.round(parsedNum),
                isSummit: point.isSummit || false,
                isStart: index === 0,
            };
        });
    }, [trail]);

    const maxElevation = useMemo(() => {
        return elevationData.length > 0
            ? Math.max(...elevationData.map((p) => p.elevationNum))
            : 0;
    }, [elevationData]);

    const minElevation = useMemo(() => {
        return elevationData.length > 0
            ? Math.min(...elevationData.map((p) => p.elevationNum))
            : 0;
    }, [elevationData]);

    if (elevationData.length === 0) {
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
                    No elevation data available
                </h4>

                {/* Dynamic Contextual Copy */}
                <p className="text-xs text-on-surface-variant max-w-xs mb-4 leading-relaxed">
                    Check back later.
                </p>
            </div>
        );
    }

    // Custom Dot Renderer to highlight each waypoint along the line
    const RenderCustomDot = (props) => {
        const { cx, cy, payload } = props;
        if (!cx || !cy) return null;

        if (payload.isSummit) {
            return (
                <g key={`dot-summit-${payload.index}`}>
                    <circle cx={cx} cy={cy} r={8} fill="var(--foreground)" stroke="var(--background)" strokeWidth={2} />
                    <circle cx={cx} cy={cy} r={12} fill="none" stroke="var(--foreground)" strokeWidth={1.5} opacity={0.5} />
                    <text x={cx} y={cy - 18} textAnchor="middle" fill="var(--foreground)" fontSize={11} fontWeight="bold">
                        Summit
                    </text>
                    <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--foreground)" fontSize={10} fontWeight="600">
                        {payload.elevationNum}m
                    </text>
                </g>
            );
        }

        if (payload.isStart) {
            return (
                <g key={`dot-start-${payload.index}`}>
                    <circle cx={cx} cy={cy} r={7} fill="var(--foreground)" stroke="var(--background)" strokeWidth={2} />
                    <text x={cx} y={cy - 16} textAnchor="middle" fill="var(--foreground)" fontSize={11} fontWeight="bold">
                        Start
                    </text>
                    <text x={cx} y={cy - 5} textAnchor="middle" fill="var(--foreground)" fontSize={10}>
                        {payload.elevationNum}m
                    </text>
                </g>
            );
        }

        return (
            <g key={`dot-point-${payload.index}`}>
                <circle cx={cx} cy={cy} r={5} fill="var(--background)" stroke="var(--primary)" strokeWidth={2} />
                {payload.label && (
                    <text x={cx} y={cy > 180 ? cy + 18 : cy - 14} textAnchor="middle" fill="var(--muted-foreground)" fontSize={10} fontWeight="500">
                        {payload.label}
                    </text>
                )}
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;
            return (
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/40 shadow-lg min-w-40">
                    <p className="font-bold text-on-surface">{point.label || `Waypoint ${point.index + 1}`}</p>
                    <p className="text-sm font-medium text-on-surface">
                        Elevation: <span className="text-sm text-on-surface-variant">{point.elevationNum}m</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div ref={containerRef} className={className}>
            {showHeader && (
                <div className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2 border-b border-outline-variant/40 pb-2">
                    <span>Elevation Profile</span>
                </div>
            )}

            {/* Recharts Chart Container - Only renders when scrolled into view */}
            <ChartContainer height={360}>
                {isInView ? (
                    <AreaChart data={elevationData} margin={{ top: 35, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="index" hide />
                        <YAxis
                            type="number"
                            domain={[Math.max(0, minElevation - 40), maxElevation + 60]}
                            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}m`}
                            width={45}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="elevationNum"
                            stroke="var(--foreground)"
                            strokeWidth={2.5}
                            fill="url(#elevationGradient)"
                            connectNulls={true}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                            dot={<RenderCustomDot />}
                            activeDot={{ r: 7, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
                        />
                    </AreaChart>
                ) : (
                    /* Blank space reservation to prevent layout shift before scrolling into view */
                    <div className="h-full w-full" />
                )}
            </ChartContainer>
        </div>
    );
}