import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function ParkAdvisories({ advisories }) {
    return (
        <section aria-labelledby="advisories-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
            <p id="advisories-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Park advisories
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
                Latest notices that affect the next hike day.
            </p>

            <div className="mt-5 space-y-4">
                {advisories.length > 0 ? (
                    advisories.map((item) => (
                        <Link
                            key={item.id}
                            to={`/news/${item.id}`}
                            className="block rounded-2xl border border-outline-variant/40 p-5 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <div className="flex items-center gap-2">
                                <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.badgeClass}`}>
                                    {item.category}
                                </span>
                                <span className="text-xs text-on-surface-variant">{item.date}</span>
                            </div>
                            <h3 className="mt-3 flex items-center gap-2 text-sm font-bold text-on-surface">
                                {item.category === 'Advisory' && (
                                    <TriangleAlert className="h-4 w-4 shrink-0 text-red-600" />
                                )}
                                {item.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                                {item.leadParagraph}
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className="py-8 text-center text-sm text-on-surface-variant">No advisories right now.</p>
                )}
            </div>
        </section>
    );
}