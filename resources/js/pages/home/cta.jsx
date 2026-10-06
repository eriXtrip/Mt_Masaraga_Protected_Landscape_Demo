import { useNavigate } from 'react-router-dom';
import HERO_IMAGE from '../../../../public/images/home/MtMasaraga.jpg';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function Cta() {
    const navigate = useNavigate();
    const [containerRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    return (
        <section className="relative flex min-h-dvh lg:min-h-dvh w-full items-stretch justify-start overflow-hidden bg-surface-container-highest">
            {/* Background Image & Scrim Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HERO_IMAGE}
                    alt="Mt. Masaraga covered in lush green rainforest piercing through morning mist"
                    className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
                />
                {/* Gradient Scrim for Contrast & Atmosphere */}
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30 lg:to-black/20" />
            </div>

            {/* Main Hero Callout Content Container */}
            <div
                ref={containerRef}
                className="relative z-10 flex w-full max-w-4xl flex-col justify-between lg:justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-24"
            >
                {/* Main Headline & Subtitle Area */}
                <div className="mt-15 lg:mt-0">
                    <h1
                        className={`mb-6 text-5xl font-black tracking-tight leading-none text-white sm:text-6xl md:text-7xl lg:text-8xl transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                            }`}
                    >
                        MT. MASARAGA
                        <span
                            style={{ transitionDelay: '150ms' }}
                            className={`mt-2 block text-2xl font-bold tracking-normal text-white/90 sm:text-4xl md:text-5xl transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-6'
                                }`}
                        >
                            Your Trek Begins Here
                        </span>
                    </h1>

                    <p
                        style={{ transitionDelay: '300ms' }}
                        className={`max-w-xl text-base leading-relaxed text-white/80 sm:text-lg transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-6'
                            }`}
                    >
                        Experience the lush summit trails and untouched rainforests of Ligao, Albay. Secure your official permit and trek guide today.
                    </p>
                </div>

                {/* Action Controls (Staggered Entrance Animation) */}
                <div
                    style={{ transitionDelay: '450ms' }}
                    className={`mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 lg:mt-8 transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                        }`}
                >
                    <Button
                        type="button"
                        size="lg"
                        variant="default"
                        onClick={() => {
                            const element = document.getElementById('trails');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="cursor-pointer font-bold gap-2 text-base px-8 py-6 rounded-2xl active:scale-[0.98] transition-all hover:scale-105"
                    >
                        <span>Explore Trail</span>
                        <ArrowRight className="h-5 w-5" />
                    </Button>

                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/help')}
                        className="cursor-pointer font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50 hover:text-inverse-on-surface backdrop-blur-sm rounded-2xl text-base px-6 py-6 transition-all hover:scale-105"
                    >
                        Trek Guidelines
                    </Button>
                </div>
            </div>
        </section>
    );
}