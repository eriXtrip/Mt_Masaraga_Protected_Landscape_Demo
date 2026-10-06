import React from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NEWS_CATEGORIES } from './contentUtils';

export default function NewsFilters({ searchTerm, categoryFilter, onSearch, onCategory }) {
    return (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline pointer-events-none" />
                <Input
                    aria-label="Search news"
                    placeholder="Search by title, category..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-9 w-full bg-background text-xs sm:text-sm"
                />
            </div>

            <div className="pt-1 border-t border-outline-variant/20 sm:border-0 sm:pt-0">
                <div className="sm:hidden flex items-center gap-2">
                    <Filter className="h-4 w-4 text-outline shrink-0" />
                    <div className="relative w-full">
                        <select
                            value={categoryFilter}
                            onChange={(e) => onCategory(e.target.value)}
                            aria-label="Filter by category"
                            className="h-10 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                        >
                            {['All', ...NEWS_CATEGORIES].map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white" />
                    </div>
                </div>

                <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-1 px-2 py-1.5">
                    <Filter className="h-4 w-4 text-outline shrink-0 mr-1" />
                    {['All', ...NEWS_CATEGORIES].map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => onCategory(cat)}
                            aria-pressed={categoryFilter === cat}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer whitespace-nowrap ${categoryFilter === cat
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
