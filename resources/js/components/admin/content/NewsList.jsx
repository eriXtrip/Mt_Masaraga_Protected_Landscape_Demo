import React from 'react';
import NewsCard from './NewsCard';

export default function NewsList({ news, onView, onEdit, onDelete }) {
    if (news.length === 0) {
        return (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-12 text-center">
                <p className="text-sm font-semibold text-on-surface">No news items found</p>
                <p className="mt-1 text-xs text-on-surface-variant">Try adjusting your search or filter.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => (
                <NewsCard
                    key={item.id}
                    item={item}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
