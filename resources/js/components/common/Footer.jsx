import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../state/adminStore';
import { useInView } from '@/hooks/useInView';
import Facebook from '../brandlogo/facebook.svg';
import X from '../brandlogo/x.svg';
import Instagram from '../brandlogo/instagram.svg';
import Visa from '../brandlogo/visa.svg';
import Mastercard from '../brandlogo/mastercard.svg';
import Gcash from '../brandlogo/gcash.svg';
import Maya from '../brandlogo/maya.svg';
import Landbank from '../brandlogo/landbank.svg';

const QUICK_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Help', to: '/help' },
    { label: 'Contact Us', to: '/contact' },
];

const LEGAL_LINKS = [
    { key: 'privacy-policy', label: 'Privacy Policy', to: '/legal/privacy-policy' },
    { key: 'cookie-policy', label: 'Cookie Policy', to: '/legal/cookie-policy' },
    { key: 'ecotourism-policy', label: 'Ecotourism Policy (Leave No Trace)', to: '/legal/ecotourism-policy' },
    { key: 'wildlife-protection', label: 'Wildlife Protection', to: '/legal/wildlife-protection' },
    { key: 'terms-conditions', label: 'Terms and Conditions', to: '/legal/terms-conditions' },
    { key: 'disclaimer', label: 'Disclaimer', to: '/legal/disclaimer' },
    { key: 'refund-policy', label: 'Refund and Return Policy', to: '/legal/refund-policy' },
];

export default function Footer() {
    const { settings } = useAdminStore();
    const [footerRef, isFooterInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const contact = settings?.contact || {};
    const visibleLegalLinks = LEGAL_LINKS.filter((link) => {
        const page = settings?.legal?.[link.key];
        return page?.enabled !== false && page?.showInFooter !== false;
    });
    const socialLinks = [
        { key: 'facebook', label: 'Facebook', href: contact.facebook, logo: Facebook },
        { key: 'instagram', label: 'Instagram', href: contact.instagram, logo: Instagram },
        { key: 'x', label: 'X', href: contact.x, logo: X },
    ].filter((link) => link.href);

    const revealClass = isFooterInView
        ? 'translate-y-0 opacity-100'
        : 'translate-y-6 opacity-0';
    const revealTransition = 'transition-all duration-700 ease-out motion-reduce:transition-none';

    return (
        <footer ref={footerRef} className="relative w-full overflow-hidden bg-surface-dim pt-12 pb-8 text-inverse-surface font-sans">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">

                {/* 5-Column Grid Layout */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-12">

                    {/* Column 1: Quick Links */}
                    <div style={{ transitionDelay: '0ms' }} className={`space-y-3 ${revealTransition} ${revealClass}`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="transition-colors hover:text-[#5b8c31]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Social Media */}
                    <div style={{ transitionDelay: '80ms' }} className={`space-y-3 ${revealTransition} ${revealClass}`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
                            Social Media
                        </h3>
                        {socialLinks.length > 0 ? (
                            <div className="flex gap-3 items-center">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.key}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={social.label}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 p-2 transition-all hover:bg-primary-container"
                                    >
                                        <img src={social.logo} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-on-secondary">No social links configured.</p>
                        )}
                    </div>

                    {/* Column 3: Contact Information & Permits */}
                    <div style={{ transitionDelay: '160ms' }} className={`space-y-3 ${revealTransition} ${revealClass}`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
                            Contact Information
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-[#5b8c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <a href={`mailto:${contact.supportEmail || 'support@masaraga.gov.ph'}`} className="transition-colors hover:text-[#5b8c31]">
                                    {contact.supportEmail || 'support@masaraga.gov.ph'}
                                </a>
                            </div>
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-[#5b8c31]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <p>{settings?.general?.officeAddress || 'Brgy. Amtic, Ligao City, Albay'}</p>
                            </div>

                            <div className="pt-2">
                                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider opacity-70">
                                    Permits & Requirements
                                </h3>
                                <a href="/help" className="block font-bold text-[#5b8c31] hover:underline">
                                    Mandatory Physical Documents Guide
                                </a>
                                <p className="text-[11px] opacity-70">
                                    Requires: Health Certs, Barangay Clearances, Valid ID
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Legal & Policies */}
                    <div style={{ transitionDelay: '240ms' }} className={`space-y-3 ${revealTransition} ${revealClass}`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
                            Legal & Policies
                        </h3>
                        <ul className="space-y-2 text-xs">
                            {visibleLegalLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="transition-colors hover:text-[#5b8c31]">
                                        {settings?.legal?.[link.key]?.label || link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5: Supported Payments */}
                    <div style={{ transitionDelay: '320ms' }} className={`space-y-3 ${revealTransition} ${revealClass}`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-70">
                            Supported Payments
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 shadow-xs">
                                <img src={Visa} alt="Visa" className="h-4 w-auto object-contain" />
                            </div>
                            <div className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 shadow-xs">
                                <img src={Mastercard} alt="Mastercard" className="h-4 w-auto object-contain" />
                            </div>
                            <div className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 shadow-xs">
                                <img src={Gcash} alt="GCash" className="h-4 w-auto object-contain" />
                            </div>
                            <div className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 shadow-xs">
                                <img src={Maya} alt="Maya" className="h-4 w-auto object-contain" />
                            </div>
                            <div className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white/60 px-3 py-1.5 shadow-xs">
                                <img src={Landbank} alt="Landbank" className="h-4 w-auto object-contain" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Thin Structural Divider Line */}
                <div style={{ transitionDelay: '400ms' }} className={`w-full border-t border-black/10 mb-6 ${revealTransition} ${revealClass}`} />

                {/* Bottom Flexbox Bar */}
                <div
                    style={{ transitionDelay: '460ms' }}
                    className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm ${revealTransition} ${isFooterInView ? 'translate-y-0 opacity-70' : 'translate-y-6 opacity-0'}`}
                >
                    <p>&copy; 2024 {settings?.general?.siteName || 'Mt. Masaraga Protected Landscape'}. All rights reserved.</p>
                    <p className="font-bold text-[#5b8c31]">Mandatory Permit Required for Entry.</p>
                </div>

            </div>

            {/* Oversized Background Watermark Brand Logo */}
            <div className="mt-8 flex justify-center overflow-hidden opacity-50 select-none pointer-events-none">
                <div
                    style={{ transitionDelay: '540ms' }}
                    className={`flex items-center gap-4 text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-on-surface whitespace-nowrap ${revealTransition} ${revealClass}`}
                >
                    <img
                        src="/assets/logo/MT. MASARAGA LOGO.svg"
                        alt="Mt. Masaraga Protected Landscape"
                        className="h-20 sm:h-32 md:h-40 w-auto"
                    />
                </div>
            </div>
        </footer>
    );
}