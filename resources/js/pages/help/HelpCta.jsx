import { CloudLightning, CreditCard, FileText, Headset, Mountain } from 'lucide-react';
import HelpSearchBar from '../../components/features/HelpSearchBar';
import { useInView } from '@/hooks/useInView';

import { POPULAR_TOPICS } from '../../mockData';

export default function HelpSearchbar() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden px-6 pt-16 pb-6 md:px-5 lg:px-10">
            <div className={`mx-auto max-w-6xl transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex flex-col items-center justify-center px-1 py-14 text-center sm:px-10 md:px-14">
                    <div className="mx-auto w-full max-w-3xl">

                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl">
                            How can we help you prepare?
                        </h2>
                        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
                            Find answers to frequently asked questions about booking, trail
                            requirements, and safety policies.
                        </p>

                        <HelpSearchBar />

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className="mr-1 text-xs font-semibold text-on-surface-variant">
                                Popular topics:
                            </span>
                            {POPULAR_TOPICS.map(({ icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    className="inline-flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-surface-container"
                                >
                                    <Icon className="mr-1 h-4.5 w-4.5 text-on-surface-variant" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}