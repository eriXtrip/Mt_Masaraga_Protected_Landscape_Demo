import { X, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ReportsFilters({ trails, selectedTrail, onTrailChange, dateRange, onDateRangeChange, onClear, resultCount }) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Button variant="ghost" size="icon-sm" onClick={onClear} className="h-9 gap-2 md:hidden" aria-label="Clear filters">
                    <X className="h-4 w-4" />
                    Clear
                </Button>

                <div className="relative flex-1 max-xs:w-full">
                    <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" aria-hidden="true" />
                    <select
                        value={selectedTrail}
                        onChange={(e) => onTrailChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 py-2 rounded-lg border border-outline-variant bg-surface text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150 appearance-none cursor-pointer"
                    >
                        <option value="all">All Trails</option>
                        {trails.map((trail) => (
                            <option key={trail} value={trail}>{trail}</option>
                        ))}
                    </select>
                </div>

                <div className="relative flex-1 max-xs:w-full">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none" aria-hidden="true" />
                    <select
                        value={dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value)}
                        className="w-full h-10 pl-10 pr-10 py-2 rounded-lg border border-outline-variant bg-surface text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-150 appearance-none cursor-pointer"
                    >
                        <option value="all">All Time</option>
                        <option value="this-month">This Month</option>
                        <option value="last-month">Last Month</option>
                        <option value="this-year">This Year</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{resultCount}</span>
                    result{resultCount !== 1 ? 's' : ''}
                </span>
                <Button variant="outline" size="sm" onClick={onClear} className="hidden md:inline-flex gap-2 h-9">
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                </Button>
            </div>
        </div>
    );
}