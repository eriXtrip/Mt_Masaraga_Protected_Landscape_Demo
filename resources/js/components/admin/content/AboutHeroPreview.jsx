import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutHeroPreview({ hero, onEdit }) {
    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">About Section</p>
                    <h3 className="mt-1 text-lg font-bold text-on-surface">{hero.title}</h3>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                </Button>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-3">{hero.subtitle}</p>
            {hero.description && (
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant line-clamp-2">{hero.description}</p>
            )}
        </div>
    );
}
