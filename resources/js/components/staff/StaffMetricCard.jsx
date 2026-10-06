export default function StaffMetricCard({ icon: Icon, value, label, detail, tone = 'primary' }) {
    const toneClasses = {
        primary: 'bg-primary/10 text-primary',
        amber: 'bg-amber-100 text-amber-800',
        teal: 'bg-tertiary/10 text-tertiary',
        neutral: 'bg-surface-container-high text-on-surface-variant',
    };

    return (
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs md:p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone] || toneClasses.primary}`}>
                <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-on-surface">{value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
            {detail && <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{detail}</p>}
        </div>
    );
}
