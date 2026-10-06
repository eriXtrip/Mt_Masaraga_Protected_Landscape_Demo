import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

const DIFFICULTY_OPTIONS = ['All', 'Major Climb', 'Moderate-Major', 'Moderate'];
const STATUS_OPTIONS = ['All', 'Active', 'Draft', 'Closed'];

export default function TrailFilters({
    searchTerm,
    difficultyFilter,
    statusFilter,
    resultCount,
    totalCount,
    onSearch,
    onDifficulty,
    onStatus,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-center xl:justify-between">
            {/* Search Input Area */}
            <div className="relative w-full xl:max-w-xs shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <Input
                    placeholder="Search trails..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9 w-full bg-background"
                />
            </div>

            {/* Mobile / Compact Dropdown Filters (< lg breakpoint) */}
            <div className="grid grid-cols-2 gap-2 lg:hidden">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Difficulty
                    </label>
                    <div className="relative">
                        <select
                            value={difficultyFilter}
                            onChange={(e) => onDifficulty(e.target.value)}
                            className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        >
                            {DIFFICULTY_OPTIONS.map((diff) => (
                                <option
                                    key={diff}
                                    value={diff}
                                >
                                    {diff}
                                </option>
                            ))}
                        </select>
                        <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white" />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Status
                    </label>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatus(e.target.value)}
                            className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                        <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white" />
                    </div>
                </div>
            </div>

            {/* Desktop Chip Filters (>= lg breakpoint) */}
            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-3 xl:justify-end min-w-0">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-outline shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0">
                        Difficulty
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {DIFFICULTY_OPTIONS.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                onClick={() => onDifficulty(diff)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer whitespace-nowrap ${difficultyFilter === diff
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-4 w-px bg-outline-variant/30 shrink-0" />

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0">
                        Status
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => onStatus(status)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer whitespace-nowrap ${statusFilter === status
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}