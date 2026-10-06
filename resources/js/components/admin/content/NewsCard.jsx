import React from 'react';
import { Calendar, Eye, Pencil, Trash2 } from 'lucide-react';
import { getCategoryBadge } from './contentUtils';

export default function NewsCard({ item, onView, onEdit, onDelete }) {
    const badge = getCategoryBadge(item.category);

    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-all hover:border-primary/40">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.bg} ${badge.text} ${badge.border}`}>
                        {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                    </span>
                </div>
            </div>
            <h3 className="text-sm font-bold text-on-surface">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-on-surface-variant line-clamp-2">{item.leadParagraph}</p>
            <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-outline-variant/40">
                <button
                    type="button"
                    onClick={() => onView(item)}
                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    aria-label="View news"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    aria-label="Edit news"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    aria-label="Delete news"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
