import React from 'react';

export function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Field({ label, hint, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">
                {label}
            </label>
            {children}
            {hint && <p className="text-[11px] text-on-surface-variant mt-1.5">{hint}</p>}
        </div>
    );
}

export function SectionCard({ icon: Icon, title, subtitle, children, footer }) {
    return (
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-outline-variant/20">
                <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                </span>
                <div>
                    <h2 className="text-base font-bold text-on-surface">{title}</h2>
                    {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="px-6 py-5 space-y-5">{children}</div>
            {footer}
        </section>
    );
}
