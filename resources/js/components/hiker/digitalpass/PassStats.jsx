import React from 'react';

export default function PassStats({ activeCount, otherCount }) {
    return (
        <section className="grid grid-cols-2 gap-3 max-w-md">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Active passes</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 shadow-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Used & cancelled</p>
                <p className="text-2xl font-bold text-on-surface-variant mt-1">{otherCount}</p>
            </div>
        </section>
    );
}
