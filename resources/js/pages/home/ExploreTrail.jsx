import TrailCard from '../../components/features/TrailCard';
import { TRAILS } from '../../mockData';
import { useInView } from '@/hooks/useInView';

export default function ExploreTrail() {
    const trailsList = Object.values(TRAILS);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section
            ref={sectionRef}
            id="trails"
            className="bg-surface px-6 py-6 md:px-12 md:py-12 overflow-hidden"
        >
            <div className="mx-auto max-w-6xl">
                {/* Header Section */}
                <div
                    className={`mb-10 text-left transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        Explore the Trails
                    </h2>
                    <p className="max-w-2xl text-base font-normal text-on-surface-variant md:text-lg">
                        Choose your path through the protected landscape.
                    </p>
                </div>

                {/* Trail Cards Grid with Staggered Entrance */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
                    {trailsList.map((trail, index) => (
                        <div
                            key={trail.id}
                            style={{ transitionDelay: `${200 + index * 150}ms` }}
                            className={`transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-10'
                                }`}
                        >
                            <TrailCard trail={trail} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}