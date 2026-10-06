import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useInView } from '@/hooks/useInView';
import { Images, Fullscreen, X, ChevronLeft, ChevronRight } from 'lucide-react';

const PREVIEW_COUNT = 3;

const TrailGallery = ({ trail }) => {
  const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
  const galleryImages = trail?.gallery || [];
  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const displayedImages = showAll ? galleryImages : galleryImages.slice(0, PREVIEW_COUNT);

  // Helper to open lightbox with the correct global gallery index
  const openLightbox = (imageId) => {
    const globalIdx = galleryImages.findIndex((img) => img.id === imageId);
    if (globalIdx !== -1) {
      setSelectedIndex(globalIdx);
    }
  };

  const closeLightbox = () => setSelectedIndex(null);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prevIndex) => (prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1));
  };

  // Keyboard navigation listener for full screen modal
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, galleryImages.length]);

  return (
    <div
      ref={sectionRef}
      className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5 text-on-surface">
          <Images className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-primary">Trail Gallery</h2>
        </div>
        {galleryImages.length > PREVIEW_COUNT && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors group cursor-pointer"
          >
            <span>{showAll ? 'Show Less' : `View All (${galleryImages.length})`}</span>
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayedImages.map((image) => (
          <div
            key={image.id}
            onClick={() => openLightbox(image.id)}
            className="relative group rounded-xl overflow-hidden aspect-4/3 bg-surface-container-lowest border border-outline-variant/30 shadow-xs cursor-pointer"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-white text-xs font-semibold tracking-wide">
                {image.title}
              </span>
              <span className="text-white/80 text-[11px]">
                {image.subtitle}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(image.id);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 cursor-pointer"
              title="Expand image"
            >
              <Fullscreen className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedIndex !== null && galleryImages[selectedIndex] && createPortal(
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-6 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
              title="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Expanded Content Viewport */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full h-full max-h-[90vh] flex flex-col items-center justify-center p-2"
          >
            <img
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            />
            <div className="mt-4 text-center space-y-1">
              <h3 className="text-white font-bold text-base sm:text-xl leading-snug">
                {galleryImages[selectedIndex].title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm">
                {galleryImages[selectedIndex].subtitle}
              </p>
              <p className="text-white/40 text-[11px] pt-1">
                {selectedIndex + 1} of {galleryImages.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-6 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
              title="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default TrailGallery;