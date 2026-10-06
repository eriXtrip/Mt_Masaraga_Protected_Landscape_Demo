export default function StaffPageHeader({ eyebrow, title, description, children }) {
    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">{title}</h1>
                {description && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-on-surface-variant md:text-base">{description}</p>}
            </div>
            {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
        </header>
    );
}
