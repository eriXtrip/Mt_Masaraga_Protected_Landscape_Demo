import React from 'react';
import { Newspaper, Award, Image, TrendingUp } from 'lucide-react';

export default function ContentSummary({ newsCount, awardsCount, galleryCount }) {
    const stats = [
        { icon: Newspaper, value: newsCount, label: 'News & Advisories', color: 'text-primary' },
        { icon: Award, value: awardsCount, label: 'Awards', color: 'text-amber-600' },
        { icon: Image, value: galleryCount, label: 'Gallery Items', color: 'text-emerald-600' },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs"
                    >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ${stat.color}`}>
                            <Icon className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">{stat.label}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
