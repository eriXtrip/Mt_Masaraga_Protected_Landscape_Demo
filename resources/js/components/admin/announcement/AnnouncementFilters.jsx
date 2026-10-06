import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORIES = ['All', 'Announcement', 'Advisory', 'Weather', 'Update', 'News'];
const STATUSES = ['All', 'Draft', 'Sent'];
const AUDIENCES = ['All', 'All Users', 'Hikers', 'Staff', 'Admins'];

export default function AnnouncementFilters({ filters, onChange, onClear, resultsCount }) {
    const hasActiveFilters = Boolean(
        filters.category !== 'All' ||
        filters.status !== 'All' ||
        filters.audience !== 'All' ||
        filters.search
    );

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs xl:flex-row xl:items-end xl:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1.5">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                    <Input
                        type="search"
                        placeholder="Search announcements..."
                        value={filters.search}
                        onChange={(e) => onChange('search', e.target.value)}
                        className="pl-10 w-full h-10"
                        aria-label="Search announcements"
                    />
                </div>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:items-end gap-3 w-full xl:w-1/2">
                {/* Category Filter */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Category
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) => onChange('category', e.target.value)}
                        className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        aria-label="Filter by category"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => onChange('status', e.target.value.toLowerCase() === 'all' ? 'All' : e.target.value.toLowerCase())}
                        className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        aria-label="Filter by status"
                    >
                        {STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {/* Audience Filter */}
                <div className="flex flex-col gap-1.5 w-full sm:col-span-2 lg:col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Audience
                    </label>
                    <select
                        value={filters.audience}
                        onChange={(e) => onChange('audience', e.target.value.toLowerCase() === 'all' ? 'All' : e.target.value.toLowerCase().replace(' users', '').replace(' ', ''))}
                        className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        aria-label="Filter by audience"
                    >
                        {AUDIENCES.map((aud) => (
                            <option key={aud} value={aud}>{aud}</option>
                        ))}
                    </select>
                </div>

                {/* Clear Button */}
                {hasActiveFilters && (
                    <div className="flex flex-col justify-end w-full sm:w-auto sm:col-span-2 lg:col-span-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 gap-1.5 cursor-pointer justify-center w-full sm:w-auto"
                            onClick={onClear}
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}