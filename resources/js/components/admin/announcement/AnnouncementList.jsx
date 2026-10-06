import React, { useState, useMemo } from 'react';
import { Plus, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementFilters from './AnnouncementFilters';

const DEFAULT_FILTERS = {
    search: '',
    category: 'All',
    status: 'All',
    audience: 'All',
};

function filterAnnouncements(announcements, filters) {
    return announcements.filter((announcement) => {
        const matchesSearch =
            !filters.search ||
            announcement.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            announcement.content.toLowerCase().includes(filters.search.toLowerCase());

        const matchesCategory = filters.category === 'All' || announcement.category === filters.category;
        const matchesStatus = filters.status === 'All' || announcement.status === filters.status;
        const matchesAudience = filters.audience === 'All' || announcement.audience === filters.audience;

        return matchesSearch && matchesCategory && matchesStatus && matchesAudience;
    });
}

function sortAnnouncements(announcements, sortBy) {
    return [...announcements].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });
}

export default function AnnouncementList({
    announcements = [],
    onCreate,
    onEdit,
    onDelete,
    onSend,
}) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sortBy] = useState('newest');
    const [isLoading] = useState(false);

    const filteredAnnouncements = useMemo(() => {
        const filtered = filterAnnouncements(announcements, filters);
        return sortAnnouncements(filtered, sortBy);
    }, [announcements, filters, sortBy]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const hasActiveFilters =
        filters.search ||
        filters.category !== 'All' ||
        filters.status !== 'All' ||
        filters.audience !== 'All';

    return (
        <div className="space-y-6">
            <AnnouncementFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                resultsCount={filteredAnnouncements.length}
            />

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && filteredAnnouncements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageSquare className="h-12 w-12 text-on-surface-variant/30" />
                    <h3 className="mt-4 text-lg font-semibold text-on-surface">No announcements found</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first announcement to get started'}
                    </p>
                    {!hasActiveFilters && (
                        <Button
                            variant="default"
                            size="lg"
                            className="mt-4 gap-2 cursor-pointer"
                            onClick={() => onCreate?.()}
                        >
                            <Plus className="h-4 w-4" />
                            Create Announcement
                        </Button>
                    )}
                </div>
            )}

            {!isLoading && filteredAnnouncements.length > 0 && (
                <div className='space-y-4'>
                    <div className="text-sm text-on-surface-variant">
                        Showing {filteredAnnouncements.length} of {announcements.length} {filteredAnnouncements.length !== 1 ? 'announcements' : 'announcement'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Announcements">
                        {filteredAnnouncements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                announcement={announcement}
                                onEdit={() => onEdit?.(announcement)}
                                onDelete={() => onDelete?.(announcement.id)}
                                onSend={() => onSend?.(announcement.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}