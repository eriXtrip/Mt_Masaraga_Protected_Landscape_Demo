import React from 'react';
import GalleryGridItem from './GalleryGridItem';

export default function GalleryGrid({ items, onEdit, onDelete }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-12 text-center">
                <p className="text-sm font-semibold text-on-surface">No gallery items</p>
                <p className="mt-1 text-xs text-on-surface-variant">Upload your first gallery image.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
                <GalleryGridItem key={item.id || index} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
