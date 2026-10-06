import React from 'react';
import { useInView } from '@/hooks/useInView';
import { SunMedium } from 'lucide-react';
import { REQUIREMENTS } from '../../mockData';

export default function TrailRequirement() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    return (
        <section ref={sectionRef} className={`w-full max-w-md bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Title */}
            <h2 className="text-xl font-bold text-on-surface mb-5 flex items-center gap-2">
                Requirements
            </h2>

            {/* Requirements List */}
            <ul className="space-y-3.5 mb-6">
                {REQUIREMENTS.map((req) => (
                    <li
                        key={req.id}
                        className={`flex items-center gap-3 text-sm font-medium ${req.isWarning ? 'text-amber-700' : 'text-on-surface-variant'
                            }`}
                    >
                        <req.icon
                            className={`h-5 w-5 shrink-0 ${req.isWarning ? 'text-amber-600' : 'text-primary'
                                }`}
                        />
                        <span>{req.title}</span>
                    </li>
                ))}
            </ul>

            {/* Weather Forecast Section */}
            <div className="pt-5 border-t border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Weather Forecast
                    </h3>
                </div>

                <div className="flex items-center gap-4 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/20">
                    <SunMedium className="h-8 w-8 text-amber-500 shrink-0" />
                    <div>
                        <div className="font-bold text-base text-on-surface leading-tight">
                            24°C
                        </div>
                        <div className="text-xs text-on-surface-variant mt-0.5">
                            Partly Cloudy • 20% Rain • 8 km/h Wind
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}