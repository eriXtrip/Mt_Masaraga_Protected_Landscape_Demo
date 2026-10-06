import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AWARDS, ICON_PATHS } from '../../mockData';
import { useInView } from "@/hooks/useInView";

export default function Awards() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    // Auto-advance slide every 60,000 milliseconds (1 minute)
    useEffect(() => {
        if (!AWARDS || AWARDS.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % AWARDS.length);
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? AWARDS.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % AWARDS.length);
    };

    const currentAward = AWARDS[currentIndex] || AWARDS[0];

    return (
        <section ref={sectionRef} className="bg-surface px-6 py-12 md:px-12 md:py-20 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                {/* Header Section */}
                <div
                    className={`mb-12 max-w-2xl transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                        Awards & Distinctions
                    </h2>
                    <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
                        Recognized for excellence in environmental conservation and
                        sustainable ecotourism.
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-16">
                    {/* Editorial Image Frame with Controls */}
                    <div
                        style={{ transitionDelay: '200ms' }}
                        className={`relative group overflow-hidden rounded-2xl bg-surface-container-high md:col-span-5 transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                            }`}
                    >
                        <img
                            key={currentIndex}
                            src={currentAward.image}
                            alt={currentAward.imageAlt || currentAward.name}
                            className="h-80 w-full object-cover transition-all duration-500 ease-out md:h-130 animate-in fade-in zoom-in-95"
                        />

                        {/* Chevron Overlay Controls */}
                        {AWARDS.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between p-3 opacity-90 transition-opacity group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    aria-label="Previous image"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-on-surface hover:bg-surface hover:scale-105 active:scale-95 transition-all shadow-sm"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label="Next image"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-on-surface hover:bg-surface hover:scale-105 active:scale-95 transition-all shadow-sm"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {/* Slide Indicator Badge */}
                        <div className="absolute bottom-4 left-4 rounded-md bg-surface/80 px-2.5 py-1 text-[11px] font-bold tracking-wider text-on-surface backdrop-blur-xs">
                            {currentIndex + 1} / {AWARDS.length}
                        </div>
                    </div>

                    {/* Structured Awards List */}
                    <div className="flex flex-col justify-center space-y-8 md:col-span-7 md:py-4">
                        {AWARDS.map((award, index) => {
                            const isSelected = index === currentIndex;

                            return (
                                <div
                                    key={award.name}
                                    style={{ transitionDelay: `${350 + index * 125}ms` }}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`flex items-start gap-5 cursor-pointer rounded-xl p-3 transition-all duration-700 ease-out ${isInView
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                        } ${isSelected
                                            ? 'bg-surface-container-low/70 shadow-xs'
                                            : 'hover:bg-surface-container-lowest/50'
                                        } ${index !== AWARDS.length - 1
                                            ? 'border-b border-outline-variant/30 pb-8'
                                            : ''
                                        }`}
                                >
                                    {/* Minimal Icon Badge */}
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${isSelected
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface-container-high text-primary'
                                            }`}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5 fill-current"
                                        >
                                            <path d={ICON_PATHS[award.iconKey]} />
                                        </svg>
                                    </div>

                                    {/* Award Details */}
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold leading-snug text-on-surface md:text-xl transition-colors hover:text-primary">
                                            <a href={`/awards/${award.id}`}>{award.name}</a>
                                        </h3>
                                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                                            {award.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}