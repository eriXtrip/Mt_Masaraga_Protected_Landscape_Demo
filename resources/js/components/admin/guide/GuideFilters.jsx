import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATUS_OPTIONS = ['All', 'Active', 'On Leave', 'Inactive'];
const CERTIFICATION_OPTIONS = ['All', 'DENR Accredited', 'Provisional'];

export default function GuideFilters({
    searchTerm,
    statusFilter,
    certificationFilter,
    resultCount,
    totalCount,
    onSearch,
    onStatus,
    onCertification,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-center xl:justify-between">
            {/* Top Row: Search Input */}
            <div className="relative flex-1 min-w-0">
                <label htmlFor="guide-search" className="sr-only">
                    Search guides
                </label>
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline pointer-events-none" />
                <Input
                    id="guide-search"
                    placeholder="Search guides..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-9 bg-background focus-visible:ring-2 focus-visible:ring-primary"
                />
            </div>

            {/* Mobile / Compact Dropdown Filters (< lg breakpoint) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 lg:hidden">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="status-select"
                        className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                    >
                        Status
                    </label>
                    <div className="relative">
                        <select
                            id="status-select"
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
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="certification-select"
                        className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
                    >
                        Certification
                    </label>
                    <div className="relative">
                        <select
                            id="certification-select"
                            value={certificationFilter}
                            onChange={(e) => onCertification(e.target.value)}
                            className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        >
                            {CERTIFICATION_OPTIONS.map((cert) => (
                                <option
                                    key={cert}
                                    value={cert}
                                >
                                    {cert}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" />
                    </div>
                </div>
            </div>

            {/* Desktop Chip Filters (>= lg breakpoint) */}
            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-4 xl:justify-end min-w-0">
                {/* Status Filter Group */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-outline shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0">
                        Status:
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

                <div className="h-4 w-px bg-outline-variant/30 shrink-0" />

                {/* Certification Filter Group */}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0">
                        Certification:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {CERTIFICATION_OPTIONS.map((cert) => (
                            <button
                                key={cert}
                                type="button"
                                onClick={() => onCertification(cert)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer whitespace-nowrap ${certificationFilter === cert
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                            >
                                {cert}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}