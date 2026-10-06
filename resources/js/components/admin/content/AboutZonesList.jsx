import React from 'react';
import { Pencil, Trash2, GripVertical } from 'lucide-react';

export default function AboutZonesList({ zones, onEdit, onDelete }) {
    if (!zones || zones.length === 0) {
        return (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-8 text-center">
                <p className="text-sm font-semibold text-on-surface">No zones configured</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone, index) => (
                <div
                    key={zone.id || index}
                    className="flex items-center gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs transition-all hover:border-primary/40"
                >
                    {zone.image && (
                        <img src={zone.image} alt={zone.title} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-on-surface truncate">{zone.title}</p>
                        <p className="mt-0.5 text-xs text-on-surface-variant line-clamp-1">{zone.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => onEdit(zone)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer" aria-label="Edit zone">
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => onDelete(zone.id)} className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label="Delete zone">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
