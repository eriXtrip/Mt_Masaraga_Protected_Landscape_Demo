import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Stars from '../../components/common/Stars';
import { Button } from "@/components/ui/button";

export default function TrailHero({ trail }) {
    const navigate = useNavigate();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section ref={sectionRef} className={`relative flex h-105 sm:h-108 md:h-110 w-full items-end overflow-hidden rounded-3xl bg-surface-container-high border border-outline-variant/30 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <img
                    src={trail?.image}
                    alt={`${trail?.name} - Mt. Masaraga`}
                    className="h-full w-full object-cover object-center"
                />

                {/* Legible Gradient Overlay (No artificial blurs or glow) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex w-full flex-col justify-end gap-6 p-6 sm:p-8 md:p-12 md:flex-row md:items-end md:justify-between">

                {/* Title and Rating Info */}
                <div className="max-w-2xl space-y-3">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                        {trail.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2.5 text-sm md:text-base">
                        <div className="flex items-center text-amber-400">
                            <Stars rating={4.5} />
                        </div>
                        <span className="font-bold text-white">4.5</span>
                        <span className="text-xs md:text-sm font-medium text-white/70">
                            (124 verified reviews)
                        </span>
                    </div>
                </div>

                {/* Direct Action CTA */}
                <div className="shrink-0">
                    <Button
                        type="button"
                        variant="default"
                        size="lg"
                        onClick={() => navigate(`/booking/${trail?.id}`)}
                        className="w-full sm:w-auto font-bold gap-2 text-base px-6 py-6 rounded-2xl transition-transform active:scale-[0.98] cursor-pointer"
                    >
                        <Calendar className="h-5 w-5" aria-hidden="true" />
                        <span>Check Availability</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}