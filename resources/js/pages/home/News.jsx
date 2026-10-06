import { ArrowRight } from 'lucide-react';

import { NEWS } from '../../mockData';
import { useInView } from '@/hooks/useInView';

export default function News() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section ref={sectionRef} className="bg-surface px-6 py-6 md:px-12 md:py-8 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                {/* Header Section */}
                <div
                    className={`mb-8 transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        News & Announcements
                    </h2>
                    <p className="max-w-2xl text-base font-normal text-on-surface-variant md:text-lg">
                        Stay updated with the latest advisories and park information.
                    </p>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {NEWS.map((item, index) => (
                        <div
                            key={item.id}
                            style={{ transitionDelay: `${index * 125}ms` }}
                            className={`flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all duration-700 ease-out hover:shadow-md ${isInView
                                    ? 'opacity-100 translate-y-0 scale-100'
                                    : 'opacity-0 translate-y-8 scale-95'
                                }`}
                        >
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span
                                        className={`rounded border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${item.badgeClass}`}
                                    >
                                        {item.category}
                                    </span>
                                    <span className="text-xs font-medium text-on-surface-variant">
                                        {item.date}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-lg font-bold leading-snug text-on-surface">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-2">
                                    {item.leadParagraph}
                                </p>
                            </div>
                            <div className="mt-6 border-t border-outline-variant pt-4">
                                <a
                                    href={`/news/${item.id}`}
                                    className="group inline-flex items-center text-sm font-bold text-primary transition-colors hover:text-primary-container"
                                >
                                    <span>Read More</span>
                                    <ArrowRight
                                        className="h-5 w-5 transition-transform group-hover:translate-x-1 ml-1"
                                    />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}