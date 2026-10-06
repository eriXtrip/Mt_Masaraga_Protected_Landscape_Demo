import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function ParkAdvisories({ advisories }) {
    const navigate = useNavigate();

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Park Advisories</p>
            </div>
            <div className="space-y-4">
                {advisories.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(`/news/${item.id}`)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 text-left shadow-xs hover:border-primary/50 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${item.badgeClass}`}>
                                {item.category}
                            </span>
                            <span className="text-xs text-on-surface-variant">{item.date}</span>
                        </div>
                        <h3 className="text-sm font-bold text-on-surface mt-3 flex items-center gap-2">
                            {item.category === 'Advisory' && <TriangleAlert className="h-4 w-4 text-red-600 shrink-0" />}
                            {item.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                            {item.leadParagraph}
                        </p>
                    </button>
                ))}
                {advisories.length === 0 && (
                    <p className="text-sm text-on-surface-variant text-center py-8">
                        No advisories right now.
                    </p>
                )}
            </div>
        </section>
    );
}
