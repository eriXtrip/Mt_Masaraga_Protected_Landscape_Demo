const QUOTA_BADGE = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Limited: 'bg-amber-50 text-amber-700 border-amber-200',
    Full: 'bg-red-50 text-red-700 border-red-200',
};

export default function DailySlotQuota({ quota, hikeDay }) {
    return (
        <section aria-labelledby="quota-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
            <p id="quota-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Daily slot quota
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
                Registered slots against daily capacity{hikeDay ? ` · ${hikeDay}` : ''}.
            </p>

            <div className="mt-5 space-y-5">
                {quota.length > 0 ? (
                    quota.map((row) => {
                        const fillPct = row.capacity ? Math.min(100, Math.round((row.booked / row.capacity) * 100)) : 0;
                        const badge = QUOTA_BADGE[row.status] || QUOTA_BADGE.Available;
                        return (
                            <div key={row.trailId}>
                                <div className="flex items-center justify-between gap-3">
                                    <p className="truncate text-sm font-bold text-on-surface">{row.trail}</p>
                                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge}`}>
                                        {row.status}
                                    </span>
                                </div>
                                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-container-high">
                                    <div className="h-full rounded-full bg-primary" style={{ width: `${fillPct}%` }} />
                                </div>
                                <p className="mt-1.5 text-xs text-on-surface-variant">
                                    {row.booked} of {row.capacity} slots booked · {row.capacity - row.booked} left
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="py-8 text-center text-sm text-on-surface-variant">No daily quota is set yet.</p>
                )}
            </div>
        </section>
    );
}