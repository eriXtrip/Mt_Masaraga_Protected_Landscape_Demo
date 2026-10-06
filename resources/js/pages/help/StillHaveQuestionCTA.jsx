import { useNavigate } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { Clock, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StillHaveQuestionCTA() {
    const navigate = useNavigate();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    return (
        <section ref={sectionRef} className="bg-surface px-4 py-8 sm:px-6 sm:py-10 md:py-14 overflow-hidden">
            <div className={`mx-auto w-full max-w-6xl transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-10 text-center shadow-sm md:p-14">
                    <div className="mx-auto max-w-2xl space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
                            Still have questions?
                        </h2>
                        <p className="mx-auto text-base leading-relaxed text-on-surface-variant md:text-lg">
                            If you couldn't find the answer you were looking for, our support team is
                            ready to assist you with your booking and preparation needs.
                        </p>

                        <div className="flex justify-center pt-4">
                            <Button
                                type="button"
                                variant="default"
                                size='xl'
                                onClick={() => {
                                    navigate('/contact');
                                }}
                            >
                                <Mail />
                                <span>Contact Support</span>

                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-on-surface-variant">
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-primary" />
                                Typical response within 24 hours
                            </span>
                            <span className="h-1 w-1 rounded-full bg-outline-variant" />
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-primary" />
                                DENR-PAMB Local Office, Ligao City
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}