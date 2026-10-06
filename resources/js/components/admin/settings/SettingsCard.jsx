import { ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
    success: 'bg-primary/10 text-primary',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    neutral: 'bg-surface-container text-on-surface-variant',
};

export default function SettingsCard({ item, onEdit }) {
    const Icon = item.icon;
    const statusStyle = STATUS_STYLES[item.statusTone] || STATUS_STYLES.neutral;

    return (
        <article className="flex h-full flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/40">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.eyebrow}</p>
                    <h3 className="mt-1 text-base font-bold text-on-surface">{item.title}</h3>
                </div>
                {item.status && (
                    <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${statusStyle}`}>
                        {item.status}
                    </span>
                )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{item.description}</p>

            <div className="mt-auto flex flex-col gap-4 border-t border-outline-variant/20 pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-on-surface">{item.value}</p>
                    {item.detail && <p className="mt-1 text-xs text-on-surface-variant">{item.detail}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {item.href && (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            Open page
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                    )}
                    {item.editable !== false && (
                        <Button type="button" variant="outline" size="sm" className="h-11 gap-1.5" onClick={() => onEdit?.(item)}>
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </article>
    );
}
