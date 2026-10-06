import React from 'react';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';

export default function GalleryItem({ item, onEdit, onDelete }) {
    return (
        <div className="group rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-xs transition-all hover:border-primary/40">
            <div className="relative aspect-video bg-surface-container-high overflow-hidden">
                {item.src ? (
                    <img src={item.src} alt={item.alt || item.caption} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <div className="flex h-full items-center justify-center text-on-surface-variant text-xs">No image</div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => onEdit(item)} className="rounded-lg bg-white/90 p-1.5 text-on-surface shadow-sm transition-colors hover:bg-white cursor-pointer" aria-label="Edit image">
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg bg-white/90 p-1.5 text-destructive shadow-sm transition-colors hover:bg-white cursor-pointer" aria-label="Delete image">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
            <div className="p-3">
                <p className="text-xs font-bold text-on-surface truncate">{item.caption || 'Untitled'}</p>
                <p className="mt-0.5 text-[11px] text-on-surface-variant truncate">{item.alt || 'No description'}</p>
            </div>
        </div>
    );
}
