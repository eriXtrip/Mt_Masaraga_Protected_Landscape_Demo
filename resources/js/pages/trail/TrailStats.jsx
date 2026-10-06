import { useInView } from '@/hooks/useInView';
import { TRAIL_STATS } from '@/lib/trailStats';

export default function TrailStats({ trail }) {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    return (
        <section ref={sectionRef} className={`space-y-4 overflow-hidden transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {trail.stats.map((stat, index) => {
                    const config = TRAIL_STATS[stat.id];
                    if (!config) return null;
                    const Icon = config.icon;
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg bg-white shadow-sm ${stat.className || ''}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <div className="text-sm font-medium text-on-surface-variant">{config.label}</div>
                            </div>
                            <div className="text-2xl font-bold text-on-surface mt-2">{stat.value}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
