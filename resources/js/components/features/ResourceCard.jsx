import { Download } from 'lucide-react';

export default function ResourceCard({ icon: Icon, title, description, href, actionLabel, onAction }) {
    return (
        <article className="flex h-full flex-col items-center justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-sm transition-all duration-200 hover:border-primary-container/60 hover:shadow-md">
            <div className="flex flex-col items-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-primary">
                    <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-on-surface">{title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">{description}</p>
            </div>
            {onAction ? (
                <button
                    type="button"
                    onClick={onAction}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-on-surface transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <span>{actionLabel || 'Download PDF'}</span>
                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </button>
            ) : (
                <a
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-on-surface transition-colors hover:text-primary"
                >
                    <span>Download PDF</span>
                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </a>
            )}
        </article>
    );
}
