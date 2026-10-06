import { Mountain, ChevronRight, Star, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TRAIL_STATS } from '@/lib/trailStats';

const STATUS_CONFIG = {
    Active: { label: 'Active', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    Draft: { label: 'Draft', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    Closed: { label: 'Closed', text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

export default function TrailList({ trails, onSelect, resultCount, totalCount }) {
    if (trails.length === 0) {
        return (
            <div className="space-y-4">
                {/* Result Count Indicator */}
                <div className="pt-2 border-t border-outline-variant/20 xl:border-t-0 xl:pt-0 xl:ml-auto shrink-0 text-xs text-on-surface-variant whitespace-nowrap">
                    Showing <strong className="text-on-surface font-bold">{resultCount ?? 0}</strong> of {totalCount ?? 0} trails
                </div>

                <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl">
                    <span className="h-12 w-12 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mx-auto mb-3">
                        <Mountain className="h-6 w-6" />
                    </span>
                    <h3 className="text-base font-bold text-on-surface">No trails found</h3>
                    <p className="text-xs text-on-surface-variant">
                        Try adjusting your search term or filters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Result Count Indicator */}
            <div className="pt-2 border-t border-outline-variant/20 xl:border-t-0 xl:pt-0 xl:ml-auto shrink-0 text-xs text-on-surface-variant whitespace-nowrap">
                Showing <strong className="text-on-surface font-bold">{resultCount ?? trails.length}</strong> of {totalCount ?? trails.length} trails
            </div>

            {/* 1 Column for Small screens, 2 Columns for Medium+ screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trails.map((trail) => (
                    <div
                        key={trail.id}
                        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
                    >
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 min-w-0">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    <Mountain className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-on-surface">{trail.name}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <StatusPill status={trail.status} />
                                        {trail.featured && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 shrink-0">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSelect?.(trail)}
                                className="gap-1.5 cursor-pointer shrink-0"
                            >
                                <span>Details</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Bottom Stats Grid */}
                        <div className="grid grid-cols-4 gap-2 border-t border-outline-variant/20 pt-3">
                            {Object.entries(TRAIL_STATS).map(([key, statConfig]) => {
                                const Icon = statConfig.icon;
                                const matchedStat = trail.stats?.find((s) => s.id === key);
                                const statValue = matchedStat?.value || trail[key] || '—';

                                return (
                                    <div key={key} className="flex flex-col items-center gap-0.5 text-center">
                                        <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <span className="text-[11px] font-semibold text-on-surface truncate max-w-full">
                                            {statValue}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}