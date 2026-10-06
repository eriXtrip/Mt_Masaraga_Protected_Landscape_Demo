import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { ExperienceCard } from '@/components/features/ExperienceCard';
import { Button } from '@/components/ui/button';

const INITIAL_VISIBLE_COUNT = 2;
const PAGE_SIZE = 2;

export default function TrailExperience({ trail }) {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const trailReviews = trail?.reviews || [];
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const displayedReviews = trailReviews.slice(0, visibleCount);
    const hasMore = visibleCount < trailReviews.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, trailReviews.length));
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    return (
        <section ref={sectionRef} className={`w-full max-w-md bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/30">
                <h3 className="text-xl font-bold text-on-surface tracking-tight">
                    Hiker Reviews
                </h3>
                <span className="text-xs text-on-surface-variant font-medium">
                    Showing {displayedReviews.length} of {trailReviews.length}
                </span>
            </div>

            {/* Scrollable Reviews Container */}
            <div className="space-y-1 mb-4 max-h-105 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-outline-variant/40">
                {displayedReviews.map((review, index) => (
                    <React.Fragment key={review.id}>
                        <ExperienceCard
                            initials={review.initials}
                            name={review.name}
                            quote={review.quote}
                            date={review.date}
                            rating={review.rating}
                            isLast={index === displayedReviews.length - 1}
                            variant="ghost"
                        />
                        {index !== displayedReviews.length - 1 && (
                            <div className="border-t border-outline-variant/30" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Action Button */}
            {hasMore ? (
                <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleLoadMore}
                >
                    Load More Reviews ({trailReviews.length - visibleCount} remaining)
                </Button>
            ) : (
                trailReviews.length > INITIAL_VISIBLE_COUNT && (
                    <Button
                        variant="ghost"
                        className="w-full text-on-surface-variant hover:text-on-surface"
                        size="sm"
                        onClick={handleShowLess}
                    >
                        Show Less
                    </Button>
                )
            )}
        </section>
    );
}