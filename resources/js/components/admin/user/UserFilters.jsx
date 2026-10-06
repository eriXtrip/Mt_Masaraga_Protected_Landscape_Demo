import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ROLE_OPTIONS = ['All', 'Admin', 'Staff', 'Hiker'];
const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

export default function UserFilters({
    searchTerm,
    roleFilter,
    statusFilter,
    resultCount,
    totalCount,
    onSearch,
    onRole,
    onStatus,
    onClear,
}) {
    const hasActiveFilters = searchTerm || roleFilter !== 'All' || statusFilter !== 'All';

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-end xl:justify-between">
            <div className="relative flex-1 min-w-0">
                <label htmlFor="user-search" className="sr-only">
                    Search users
                </label>
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline pointer-events-none" />
                <Input
                    id="user-search"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-9 bg-background focus-visible:ring-2 focus-visible:ring-primary"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 lg:hidden">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="role-select" className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Role
                    </label>
                    <select
                        id="role-select"
                        value={roleFilter}
                        onChange={(e) => onRole(e.target.value)}
                        className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                    >
                        {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="status-select" className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Status
                    </label>
                    <select
                        id="status-select"
                        value={statusFilter}
                        onChange={(e) => onStatus(e.target.value)}
                        className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-4 xl:justify-end min-w-0">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-outline shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0">
                        Role:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {ROLE_OPTIONS.map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => onRole(role)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer whitespace-nowrap ${roleFilter === role
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-4 w-px bg-outline-variant/30 shrink-0" />

                <div className="flex items-center gap-2">
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

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                        <X className="h-3.5 w-3.5" />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
