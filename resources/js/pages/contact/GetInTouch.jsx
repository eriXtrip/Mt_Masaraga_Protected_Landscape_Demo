import { HelpCircle, MapPin } from 'lucide-react';
import SendMsgForm from '../../components/forms/SendMsgForm';
import { useInView } from '@/hooks/useInView';
import { useAdminStore } from '../../state/adminStore';

export default function GetInTouch() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { settings } = useAdminStore();
    const general = settings?.general || {};
    const contact = settings?.contact || {};

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden px-6 pt-16 pb-6 md:px-5 lg:px-10">
            <div className={`mx-auto w-full max-w-6xl pt-10 lg:pt-20 md:pt-10 sm:pt-5 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl">
                        Get in Touch
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-base text-on-surface-variant md:text-lg">
                        We're here to help you prepare for your adventure or answer any conservation
                        inquiries.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    <div className="grid lg:grid-cols-1 gap-5 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 lg:col-span-4">
                        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-colors hover:border-primary/40">
                            <div className="mb-3 flex items-center gap-2 text-lg font-bold text-primary">
                                <MapPin className="h-5 w-5" />
                                <h3>Office Address</h3>
                            </div>
                            <p className="text-sm font-semibold text-on-surface">{general.officeName || 'DENR/PAMB Local Office'}</p>
                            <p className="mt-1 text-sm text-on-surface-variant">{general.officeAddress || 'Brgy. Amtic, Ligao City, Albay'}</p>
                            <p className="mt-1 text-xs text-on-surface-variant">{general.officeHours || 'Monday to Friday, 8:00 AM to 5:00 PM'}</p>
                        </div>

                        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-colors hover:border-primary/40">
                            <div className="mb-3 flex items-center gap-2 text-lg font-bold text-primary">
                                <HelpCircle className="h-5 w-5" />
                                <h3>Contact Info</h3>
                            </div>
                            <a
                                href={`mailto:${contact.supportEmail || 'support@masaraga.gov.ph'}`}
                                className="block text-sm font-medium text-on-surface transition-colors hover:text-primary"
                            >
                                {contact.supportEmail || 'support@masaraga.gov.ph'}
                            </a>
                            <a
                                href={`tel:${(contact.officePhone || '+63 (52) 123-4567').replace(/[^0-9+]/g, '')}`}
                                className="mt-1 block text-sm text-on-surface-variant transition-colors hover:text-primary"
                            >
                                {contact.officePhone || '+63 (52) 123-4567'}
                            </a>
                        </div>

                        <div className="rounded-2xl border border-error-container bg-error-container p-6 shadow-sm">
                            <span className="block text-xs font-bold uppercase tracking-wider text-on-error-container">
                                Emergency Hotline
                            </span>
                            <p className="mt-1 text-2xl font-black tracking-tight text-on-error-container">
                                {contact.emergencyPhone || '+63 917-EMS-SAFE'}
                            </p>
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-on-error-container">
                                {contact.emergencyAvailability || 'Available 24/7 for active hikers'}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <SendMsgForm />
                    </div>
                </div>
            </div>
        </section>
    );
}