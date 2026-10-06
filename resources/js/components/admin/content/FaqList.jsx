import React from 'react';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ICON_MAP = {
    Receipt: 'Receipt',
    ShieldCheck: 'ShieldCheck',
    Cloud: 'Cloud',
    RotateCcw: 'RotateCcw',
    HelpCircle: 'HelpCircle',
};

export default function FaqList({ categories, onEdit, onDelete }) {
    const [expandedId, setExpandedId] = useState(null);

    if (!categories || categories.length === 0) {
        return (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest py-8 text-center">
                <p className="text-sm font-semibold text-on-surface">No FAQ categories</p>
                <p className="mt-1 text-xs text-on-surface-variant">Create your first FAQ category.</p>
            </div>
        );
    }

    return (
        /* STREAMING_CHUNK: Rendering grid layout... */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {categories.map((cat) => {
                const isExpanded = expandedId === cat.id;

                return (
                    <div
                        key={cat.id}
                        className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs overflow-hidden transition-all duration-300"
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-3 px-5 py-4">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-on-surface">{cat.title}</p>
                                <p className="mt-0.5 text-xs text-on-surface-variant">{cat.items?.length || 0} questions</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container cursor-pointer"
                                    aria-label="Expand category"
                                    aria-expanded={isExpanded}
                                >
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onEdit(cat)}
                                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer"
                                    aria-label="Edit category"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(cat.id)}
                                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                    aria-label="Delete category"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Animated Expandable Body using grid-template-rows */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                        >
                            <div className="overflow-hidden">
                                {cat.items && cat.items.length > 0 && (
                                    <div className="border-t border-outline-variant/20 px-5 py-3 space-y-2 bg-surface-container-low/50">
                                        {cat.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl bg-surface-container-lowest border border-outline-variant/20 p-3 shadow-2xs"
                                            >
                                                <p className="text-xs font-bold text-on-surface">{item.question}</p>
                                                <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

}