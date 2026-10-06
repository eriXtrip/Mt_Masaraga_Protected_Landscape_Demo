import Stars from "../../components/common/Stars";
import { ExperienceCard } from "@/components/features/ExperienceCard";

import { EXPERIENCES } from '../../mockData';
import { useInView } from "@/hooks/useInView";

export default function Experience() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section ref={sectionRef} className="bg-surface px-6 py-6 md:px-12 md:py-8 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                {/* Header Section */}
                <div
                    className={`mb-10 text-center transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        Hiker Experiences & Feedback
                    </h2>
                    <p className="max-w-2xl text-base mx-auto font-normal text-on-surface-variant md:text-lg">
                        Discover the breathtaking beauty and biodiversity of Mt. Masaraga
                        through the stories of fellow explorers.
                    </p>
                </div>

                {/* Cards Grid with Staggered Entrance */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {EXPERIENCES.map((review, index) => (
                        <div
                            key={review.name}
                            style={{ transitionDelay: `${index * 125}ms` }}
                            className={`transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                                }`}
                        >
                            <ExperienceCard
                                initials={review.initials}
                                name={review.name}
                                quote={review.quote}
                                date={review.date}
                                rating={review.rating}
                                islast={review.islast}
                                variant="default"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}