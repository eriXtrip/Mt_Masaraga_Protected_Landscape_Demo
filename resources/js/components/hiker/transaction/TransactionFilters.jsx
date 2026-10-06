import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Confirmed', 'Completed', 'Cancelled'];

export default function TransactionFilters({ searchTerm, onSearchChange, statusFilter, onStatusChange }) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-xs">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <Input
                    placeholder="Search by ID, Trail, Ref..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 w-full"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="h-4 w-4 text-outline" />
                {STATUS_OPTIONS.map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => onStatusChange(status)}
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
