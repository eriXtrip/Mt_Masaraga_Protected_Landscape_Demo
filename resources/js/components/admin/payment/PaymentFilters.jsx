import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const METHOD_OPTIONS = ['All', 'GCash', 'Maya', 'Bank Transfer', 'Card'];
const STATUS_OPTIONS = ['All', 'Confirmed', 'Completed', 'Refunded'];

export default function PaymentFilters({
    searchTerm,
    methodFilter,
    statusFilter,
    resultCount,
    totalCount,
    onSearch,
    onMethod,
    onStatus,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-end xl:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <Input
                    placeholder="Search by name, ref, trail..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9 w-full"
                />
            </div>

            {/* Mobile Dropdowns (Visible on small screens up to lg) */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Method
                    </label>
                    <select
                        value={methodFilter}
                        onChange={(e) => onMethod(e.target.value)}
                        className="h-10 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        aria-label="Filter by method"
                    >
                        {METHOD_OPTIONS.map((method) => (
                            <option key={method} value={method}>
                                {method}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatus(e.target.value)}
                        className="h-10 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        aria-label="Filter by status"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Desktop Pill Buttons (Visible on lg screens and up) */}
            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-2.5 xl:justify-end min-w-0">
                <Filter className="h-4 w-4 text-outline shrink-0 mr-1" />

                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Method
                </span>
                {METHOD_OPTIONS.map((method) => (
                    <button
                        key={method}
                        type="button"
                        onClick={() => onMethod(method)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${methodFilter === method
                                ? 'bg-primary text-white'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                    >
                        {method}
                    </button>
                ))}

                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">
                    Status
                </span>
                {STATUS_OPTIONS.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => onStatus(status)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer ${statusFilter === status
                                ? 'bg-primary text-white'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
}