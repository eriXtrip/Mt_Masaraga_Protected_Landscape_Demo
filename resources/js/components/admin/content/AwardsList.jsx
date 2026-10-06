import React from 'react';
import AwardCard from './AwardCard';

export default function AwardsList({ awards, onView, onEdit, onDelete }) {
    if (awards.length === 0) {
        return (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-12 text-center">
                <p className="text-sm font-semibold text-on-surface">No awards found</p>
                <p className="mt-1 text-xs text-on-surface-variant">Create your first award entry.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((item) => (
                <AwardCard key={item.id} item={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
