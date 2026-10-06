import React from 'react';
import { Calendar, Eye, Pencil, Trash2, Award } from 'lucide-react';

export default function AwardCard({ item, onView, onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-all hover:border-primary/40">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                        <Award className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                            {item.badge || item.category}
                        </span>
                        <h3 className="mt-1.5 text-sm font-bold text-on-surface truncate">{item.title}</h3>
                        <p className="mt-0.5 text-xs text-on-surface-variant">{item.awardingBody}</p>
                    </div>
                </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant line-clamp-2">{item.summary}</p>
            <div className="mt-3 pt-2 flex items-center gap-1 text-xs text-on-surface-variant border-t border-outline-variant/40">
                <div className="flex items-center gap-1 w-1/2">
                    <Calendar className="h-3 w-3" />
                    {item.dateReceived}
                </div>
                <div className="flex items-center gap-1 shrink-0 justify-end w-1/2">
                    <button type="button" onClick={() => onView(item)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer" aria-label="View award">
                        <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onEdit(item)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer" aria-label="Edit award">
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer" aria-label="Delete award">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
