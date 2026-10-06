import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Fullscreen, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { GALLERY_ITEMS } from '../../mockData';
import { useInView } from '@/hooks/useInView';

export default function Gallery() {
    const [showAll, setShowAll] = useState(false);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [selectedIndex, setSelectedIndex] = useState(null);
    const closeButtonRef = useRef(null);
    const triggerRef = useRef(null);

    // Slice array to initial 6 items if not expanded
    const visibleItems = showAll ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, 6);
    const hasMoreItems = GALLERY_ITEMS.length > 6;

    const closeLightbox = useCallback(() => {
        setSelectedIndex(null);
        triggerRef.current?.focus();
    }, []);

    const showPrevious = useCallback(() => {
        setSelectedIndex((index) => (index === 0 ? GALLERY_ITEMS.length - 1 : index - 1));
    }, []);

    const showNext = useCallback(() => {
        setSelectedIndex((index) => (index === GALLERY_ITEMS.length - 1 ? 0 : index + 1));
    }, []);

    const openLightbox = (index, trigger) => {
        triggerRef.current = trigger;
        setSelectedIndex(index);
    };

    const isLightboxOpen = selectedIndex !== null;
    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (isLightboxOpen && !wasOpenRef.current) {
            closeButtonRef.current?.focus();
        }
        wasOpenRef.current = isLightboxOpen;
    }, [isLightboxOpen]);

    useEffect(() => {
        if (!isLightboxOpen) return undefined;

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeLightbox();
            if (event.key === 'ArrowLeft') showPrevious();
            if (event.key === 'ArrowRight') showNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [closeLightbox, isLightboxOpen, showNext, showPrevious]);

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
                        Experience the Landscape
                    </h2>
                    <p className="max-w-2xl mx-auto text-base font-normal text-on-surface-variant md:text-lg">
                        Discover the breathtaking beauty and biodiversity of Mt. Masaraga.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleItems.map((item, index) => {
                        const isExpandedItem = index >= 6;

                        return (
                            <button
                                key={item.caption || item.src}
                                type="button"
                                onClick={(event) => openLightbox(GALLERY_ITEMS.indexOf(item), event.currentTarget)}
                                aria-label={`View full image: ${item.caption}`}
                                style={{
                                    transitionDelay: !isExpandedItem ? `${index * 100}ms` : '0ms',
                                    animationDelay: isExpandedItem ? `${(index - 6) * 75}ms` : '0ms'
                                }}
                                className={`group relative cursor-pointer overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest text-left shadow-sm transition-all duration-500 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isExpandedItem
                                        ? 'animate-in fade-in zoom-in-95 fill-mode-backwards'
                                        : isInView
                                            ? 'opacity-100 translate-y-0 scale-100'
                                            : 'opacity-0 translate-y-8 scale-95'
                                    }`}
                            >
                                <div className="aspect-4/3 overflow-hidden">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                                <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                    <Fullscreen className="h-4 w-4" />
                                </span>
                                <span className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                    {item.caption}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Expand / Collapse Button */}
                {hasMoreItems && (
                    <div
                        style={{ transitionDelay: '600ms' }}
                        className={`mt-8 flex justify-center transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-6'
                            }`}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowAll((prev) => !prev)}
                            className="inline-flex items-center gap-2 font-bold cursor-pointer rounded-xl border-outline-variant/60 px-6 hover:bg-surface-container-low active:scale-95 transition-all"
                        >
                            <span>{showAll ? "Show Less" : `View More (${GALLERY_ITEMS.length - 6} more)`}</span>
                            {showAll ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                )}

                {selectedIndex !== null && GALLERY_ITEMS[selectedIndex] && createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={GALLERY_ITEMS[selectedIndex].caption}
                        onClick={closeLightbox}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200 motion-reduce:animate-none sm:p-8"
                    >
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close full view"
                            className="absolute right-5 top-5 z-50 cursor-pointer rounded-full bg-white/10 p-2.5 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {GALLERY_ITEMS.length > 1 && (
                            <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); showPrevious(); }}
                                aria-label="Previous image"
                                className="absolute left-4 z-50 cursor-pointer rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                        )}

                        <div onClick={(event) => event.stopPropagation()} className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col items-center justify-center p-2">
                            <img
                                src={GALLERY_ITEMS[selectedIndex].src}
                                alt={GALLERY_ITEMS[selectedIndex].alt}
                                className="max-h-[78vh] w-auto max-w-full animate-in zoom-in-95 rounded-xl object-contain shadow-2xl duration-300 motion-reduce:animate-none"
                            />
                            <div className="mt-4 space-y-1 text-center">
                                <h3 className="text-base font-bold leading-snug text-white sm:text-xl">
                                    {GALLERY_ITEMS[selectedIndex].caption}
                                </h3>
                                <p className="text-[11px] text-white/40 pt-1">
                                    {selectedIndex + 1} of {GALLERY_ITEMS.length}
                                </p>
                            </div>
                        </div>

                        {GALLERY_ITEMS.length > 1 && (
                            <button
                                type="button"
                                onClick={(event) => { event.stopPropagation(); showNext(); }}
                                aria-label="Next image"
                                className="absolute right-4 z-50 cursor-pointer rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        </section>
    );
}