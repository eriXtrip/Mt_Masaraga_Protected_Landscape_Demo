import React from 'react';
import { Dot } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function TrailOverview({ trail }) {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const paragraphs = trail?.paragraphs || [];
    const highlights = trail?.highlights || [];

    return (
        <div ref={sectionRef} className={`w-full space-y-6 overflow-hidden transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">

                {/* Title & Category */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/60">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                            Trail Overview
                        </h3>
                    </div>
                </div>

                {/* Narrative Text */}
                <div className="space-y-4 text-on-surface/85 text-base md:text-lg leading-relaxed">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {/* Key Trail Characteristics / Highlights List */}
                <div className="mt-8 pt-6 border-t border-outline-variant/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                        Trail Highlights &amp; Key Points
                    </h4>
                    <ul className="space-y-3.5">
                        {highlights.map((highlight) => (
                            <li key={highlight.id} className="flex items-start gap-2 text-on-surface/90">
                                <Dot className="h-6 w-6 text-primary shrink-0 -mt-0.5" />
                                <div>
                                    <strong className="font-semibold text-on-surface">
                                        {highlight.label}{' '}
                                    </strong>
                                    <span className="text-on-surface/80">
                                        {highlight.description}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}