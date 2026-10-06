export default function KeyFigures({ kpis }) {
    return (
        <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.label}
                        className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-5"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                            {kpi.value}
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {kpi.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{kpi.sub}</p>
                    </div>
                );
            })}
        </section>
    );
}