import { useEffect, useRef } from 'react';
import {
    X, Mountain, MapPin, Clock, TrendingUp, Map, Shield, Star,
    ChevronRight, Image, Waypoints, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { TRAIL_STATS } from '@/lib/trailStats';

function DetailSection({ title, children }) {
    return (
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{title}</p>
            <div className="mt-3">{children}</div>
        </div>
    );
}

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
            <span className="text-on-surface-variant">{label}</span>
            <span className="ml-auto text-right font-semibold text-on-surface">{value}</span>
        </div>
    );
}

function ElevationPoint({ point, index, total }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${point.isSummit ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    }`}>
                    {index + 1}
                </div>
                {index < total - 1 && <div className="w-px h-4 bg-outline-variant/40" />}
            </div>
            <div className="min-w-0 flex-1 pb-2">
                <p className="text-sm font-semibold text-on-surface">{point.label}</p>
                <p className="text-xs text-on-surface-variant">{point.elevation}</p>
            </div>
        </div>
    );
}

export default function TrailDetail({ trail, onClose, onEdit }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    if (!trail) return null;

    return (
        <div className="fixed inset-0 z-40">
            <div
                className={`absolute inset-0 bg-inverse-surface/60 ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                onClick={requestClose}
                aria-hidden="true"
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label={`Trail ${trail.name}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            <Mountain className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface">{trail.name}</p>
                            <p className="truncate text-xs text-on-surface-variant">
                                {trail.difficultyLabel} · {trail.trailClass}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={requestClose}
                            aria-label="Close trail details"
                            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                    {/* Hero Image */}
                    {trail.image && (
                        <div className="rounded-2xl overflow-hidden border border-outline-variant/20">
                            <img
                                src={trail.image}
                                alt={trail.name}
                                className="w-full h-40 object-cover"
                            />
                        </div>
                    )}

                    {/* Subtitle */}
                    {trail.subtitle && (
                        <p className="text-sm italic text-on-surface-variant leading-relaxed">
                            {trail.subtitle}
                        </p>
                    )}

                    {/* Trail Stats Display */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                            Trail Stats
                        </p>
                        <div className="grid grid-cols-2  gap-2">
                            {Object.entries(TRAIL_STATS).map(([key, statConfig]) => {
                                const Icon = statConfig.icon;

                                // Find the stat item from trail.stats array by matching id with key
                                const matchedStat = trail.stats?.find((s) => s.id === key);
                                const statValue = matchedStat?.value || trail[key] || '—';

                                return (
                                    <div
                                        key={key}
                                        className="flex flex-col items-center gap-1 rounded-xl border border-outline-variant/20 bg-surface-container-high p-3 text-center"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                                {statConfig.label}
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold text-on-surface mt-0.5">
                                            {statValue}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <DetailSection title="Overview">
                        <p className="text-sm leading-relaxed text-on-surface-variant">
                            {trail.description}
                        </p>
                    </DetailSection>

                    {/* Waypoints */}
                    {trail.waypoints?.length > 0 && (
                        <DetailSection title={`Waypoints (${trail.waypoints.length})`}>
                            <div className="space-y-0">
                                {trail.waypoints.map((wp, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${wp.icon === 'summit' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            {idx < trail.waypoints.length - 1 && <div className="w-px h-4 bg-outline-variant/40" />}
                                        </div>
                                        <div className="min-w-0 flex-1 pb-2">
                                            <p className="text-sm font-semibold text-on-surface">{wp.name}</p>
                                            <p className="text-xs text-on-surface-variant">{wp.description}</p>
                                            {wp.icon && (
                                                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                    {wp.icon}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    )}

                    {/* Elevation Profile */}
                    {trail.elevationPoints?.length > 0 && (
                        <DetailSection title="Elevation Profile">
                            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-high p-4">
                                <div className="space-y-0">
                                    {trail.elevationPoints.map((point, idx) => (
                                        <ElevationPoint
                                            key={idx}
                                            point={point}
                                            index={idx}
                                            total={trail.elevationPoints.length}
                                        />
                                    ))}
                                </div>
                            </div>
                        </DetailSection>
                    )}

                    {/* Paragraphs / Full Description */}
                    {trail.paragraphs?.length > 0 && (
                        <DetailSection title="Detailed Description">
                            <div className="space-y-3">
                                {trail.paragraphs.map((p, idx) => (
                                    <p key={idx} className="text-sm leading-relaxed text-on-surface-variant">
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </DetailSection>
                    )}

                    {/* Highlights */}
                    {trail.highlights?.length > 0 && (
                        <DetailSection title="Highlights">
                            <div className="space-y-2">
                                {trail.highlights.map((h, idx) => (
                                    <div key={h.id || idx} className="rounded-xl bg-surface-container-high p-3">
                                        <p className="text-xs font-bold text-on-surface">{h.label}</p>
                                        <p className="text-xs text-on-surface-variant mt-0.5">{h.description}</p>
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    )}

                    {/* Gallery */}
                    {trail.gallery?.length > 0 && (
                        <DetailSection title={`Gallery (${trail.gallery.length})`}>
                            <div className="grid grid-cols-2 gap-2">
                                {trail.gallery.map((img) => (
                                    <div key={img.id} className="rounded-xl overflow-hidden border border-outline-variant/20">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-24 object-cover"
                                        />
                                        <div className="p-2">
                                            <p className="text-[10px] font-bold text-on-surface truncate">{img.title}</p>
                                            <p className="text-[10px] text-on-surface-variant truncate">{img.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    )}

                    {/* Reviews */}
                    {trail.reviews?.length > 0 && (
                        <DetailSection title={`Reviews (${trail.reviews.length})`}>
                            <div className="space-y-3">
                                {trail.reviews.map((review) => (
                                    <div key={review.id} className="rounded-xl bg-surface-container-high p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {review.initials}
                                            </span>
                                            <span className="text-xs font-semibold text-on-surface">{review.name}</span>
                                            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-amber-600">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                {review.rating}
                                            </span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant italic">"{review.quote}"</p>
                                        {review.date && (
                                            <p className="text-[10px] text-outline mt-1">{review.date}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </DetailSection>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-outline-variant/20 px-5 py-4">
                    <Button
                        variant="default"
                        className="w-full gap-2"
                        onClick={() => { requestClose(); onEdit?.(trail); }}
                    >
                        Edit Trail
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </aside>
        </div>
    );
}