export default function StaffEmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-lowest px-5 py-12 text-center shadow-xs">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
                <Icon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-on-surface">{title}</h2>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-on-surface-variant">{description}</p>
            {action && <div className="mt-5 flex justify-center">{action}</div>}
        </div>
    );
}
