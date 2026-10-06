import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useInView } from '@/hooks/useInView';
import QR from '../../../../public/images/QR_Code_Example.svg.webp';
import HikerTicketPass from '../../components/features/HikerTicketPass';
import DigitalPassDownloadModal from '../../components/hiker/digitalpass/DigitalPassDownloadModal';
import PrintableDocumentModal from '../../components/features/PrintableDocumentModal';
import HealthDeclarationDocument from '../../components/features/HealthDeclarationDocument';
import LiabilityWaiverDocument from '../../components/features/LiabilityWaiverDocument';
import { A4_DOCUMENT } from '../../lib/printImage';
import { Input } from '@/components/ui/input';
import {
    CheckCircle2,
    Info,
    Download,
    Mail,
    MessageSquare,
    ArrowRight,
    Receipt,
    ListChecks,
    ChevronLeft,
    ChevronRight,
    FileText,
    Scale,
    ShieldAlert,
    Map,
    X,
    Loader2,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '../../components/ui/toast';
import { ADMIN_SETTINGS, CHECKLIST_ITEMS } from '../../mockData';

const MESSENGER_URL = ADMIN_SETTINGS.contact.facebook;

const DEFAULT_BOOKING_PASSES = [
    {
        id: 'MMPL-2023-0892-1',
        qrCodeUrl: QR,
        status: 'Valid',
        date: 'Oct 24, 2023',
        trail: 'Ambot Trail',
        guideHiker: 'Rodel Villanueva',
        hikerName: 'Jane Doe',
    },
    {
        id: 'MMPL-2023-0892-2',
        qrCodeUrl: QR,
        status: 'Valid',
        date: 'Oct 24, 2023',
        trail: 'Ambot Trail',
        guideHiker: 'Rodel Villanueva',
        hikerName: 'John Smith',
    },
];

const DEFAULT_PAYMENT_RECEIPT = {
    breakdown: [
        { label: 'Environmental Fee (4 x ₱150)', amount: '₱600.00' },
        { label: 'Guide Fee (1 Guide)', amount: '₱1,200.00' },
        { label: 'Processing Fee', amount: '₱50.00' },
    ],
    totalPaid: '₱1,850.00',
    paymentMethod: 'Paid via GCash',
    referenceNo: 'Ref: ABC123XYZ89',
};

const HIKER_RESOURCES = [
    {
        id: 'safety_guide',
        title: 'Pre-Climb Safety Guidelines',
        description: 'Trail rules, weather prep, and limatik precautions.',
        fileName: 'Mt-Masaraga-Safety-Guidelines.pdf',
        downloadUrl: '/downloads/Mt-Masaraga-Safety-Guidelines.pdf',
        icon: ShieldAlert,
    },
    {
        id: 'gear_checklist',
        title: 'Mandatory Gear Checklist',
        description: 'Required clothing, hydration, and emergency gear.',
        fileName: 'Mt-Masaraga-Gear-Checklist.pdf',
        downloadUrl: '/downloads/Mt-Masaraga-Gear-Checklist.pdf',
        icon: FileText,
    },
    {
        id: 'trail_map',
        title: 'Mt. Masaraga Trail Map',
        description: 'Know the trails and the mountain terrain.',
        fileName: 'Mt-Masaraga-Trail-Map.pdf',
        downloadUrl: '/downloads/Mt-Masaraga-Trail-Map.pdf',
        icon: Map,
    },
    {
        id: 'liability_waiver',
        title: 'Liability Waiver',
        description: 'The four clauses you accepted for this booking.',
        icon: Scale,
        generated: true,
    },
];

export default function BookingConfirmation({
    selectedDate,
    passesData = DEFAULT_BOOKING_PASSES,
    receiptData = DEFAULT_PAYMENT_RECEIPT,
    hikerData = [],
    bookingReference,
    contactEmail = '',
    onSendEmail,
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const [isPassDownloadOpen, setIsPassDownloadOpen] = useState(false);
    const [isHealthDeclarationOpen, setIsHealthDeclarationOpen] = useState(false);
    const [isWaiverOpen, setIsWaiverOpen] = useState(false);

    // Modal State. The inbox is pre-filled with the one captured at booking; sending to
    // a different address does not change where the booking's own confirmation went.
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSentSuccess, setIsSentSuccess] = useState(false);

    // Apply the selected date to the passes if provided
    const displayPasses = (selectedDate
        ? passesData.map(pass => ({ ...pass, date: selectedDate }))
        : passesData
    ).map(pass => ({
        ...pass,
        guideHiker: pass.guideHiker,
    }));

    const issuedAt = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    // Health declarations and the waiver are reproduced from what each hiker
    // declared at booking, so a stored transaction can reprint them later.
    const hikerList = hikerData;

    const healthDeclarationDocuments = hikerList.map((hiker, index) => {
        const pass = displayPasses[index] || displayPasses[0] || {};
        const documentCode = pass.id || `MMPL-${index + 1}`;

        return {
            id: documentCode,
            fileName: `health-declaration-${String(index + 1).padStart(2, '0')}.png`,
            label: hiker.fullName,
            meta: documentCode,
            widthInches: A4_DOCUMENT.widthInches,
            heightInches: A4_DOCUMENT.heightInches,
            content: (
                <HealthDeclarationDocument
                    hiker={hiker}
                    trail={pass.trail}
                    hikeDate={selectedDate || pass.date}
                    guideHiker={pass.guideHiker}
                    documentCode={documentCode}
                    issuedAt={issuedAt}
                />
            ),
        };
    });

    const waiverDocuments = [
        {
            id: 'MMP-LW-001',
            fileName: 'liability-waiver.png',
            label: 'Liability Waiver',
            meta: 'MMP-LW-001',
            widthInches: A4_DOCUMENT.widthInches,
            heightInches: A4_DOCUMENT.heightInches,
            content: (
                <LiabilityWaiverDocument
                    documentCode="MMP-LW-001"
                    issuedAt={issuedAt}
                />
            ),
        },
    ];

    const handlePrevPass = () => {
        setActiveIndex((prev) => (prev === 0 ? displayPasses.length - 1 : prev - 1));
    };

    const handleNextPass = () => {
        setActiveIndex((prev) => (prev === displayPasses.length - 1 ? 0 : prev + 1));
    };

    const handleDownload = (e, url, fileName) => {
        e.preventDefault();
        toast.add({ type: 'info', title: 'Download started', description: `Downloading ${fileName}` });
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Open Modal
    const handleOpenEmailModal = () => {
        setIsSentSuccess(false);
        setEmailInput(contactEmail);
        setIsEmailModalOpen(true);
    };

    useEffect(() => {
        if (!isEmailModalOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsEmailModalOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEmailModalOpen]);

    // Handle Email Submit Simulation
    const handleSendEmailSubmit = (e) => {
        e.preventDefault();
        if (!emailInput) return;

        setIsSending(true);

        setTimeout(() => {
            setIsSending(false);
            setIsSentSuccess(true);
            toast.add({ type: 'success', title: 'Email sent', description: `E-passes delivered to ${emailInput}.` });
            if (onSendEmail) onSendEmail(emailInput);
        }, 1500);
    };

    return (
        <main ref={sectionRef}>
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Left Column: Confirmation & Interactive Pass Carousel */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* Success Header */}
                    <section className="flex flex-col items-center md:flex-row md:items-center gap-4 text-center md:text-left">
                        <div className="h-12 w-12 rounded-2xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                                Booking Confirmed
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-1">
                                You're all set, hiker!
                            </h2>
                            <p className="text-sm md:text-base text-on-surface-variant mt-1">
                                Your e-passes and payment receipt are ready below.
                            </p>
                            {contactEmail && (
                                <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-surface-container px-2.5 py-1 text-xs text-on-surface-variant">
                                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                                    Confirmation sent to <span className="font-semibold text-on-surface">{contactEmail}</span>
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Single Active Pass Card */}
                    <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden transition-all duration-300">

                        {/* Pass Counter Badge & Navigation Header */}
                        {displayPasses.length > 1 && (
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant/15 relative z-10">
                                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Pass {activeIndex + 1} of {displayPasses.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handlePrevPass}
                                        className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                                        title="Previous Pass"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextPass}
                                        className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                                        title="Next Pass"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Active Pass Render Area */}
                        <div className="relative z-10 w-full flex justify-center items-center overflow-hidden py-1">
                            {displayPasses.map((pass, idx) => (
                                <div
                                    key={pass.id}
                                    className={`w-full flex justify-center transition-opacity duration-300 ${idx === activeIndex ? 'block opacity-100' : 'hidden opacity-0'
                                        }`}
                                >
                                    <div className="transform origin-top scale-[0.68] min-[380px]:scale-[0.72] min-[480px]:scale-[0.80] sm:scale-[0.90] lg:scale-100 transition-transform duration-200 -mb-27.5 min-[380px]:-mb-20 min-[480px]:-mb-12.5 sm:-mb-6.25 lg:mb-0">
                                        <HikerTicketPass currentPass={pass} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Dot Indicators for Multiple Passes */}
                        {displayPasses.length > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-4 relative z-10">
                                {displayPasses.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveIndex(idx)}
                                        className={`h-2 rounded-full transition-all cursor-pointer ${activeIndex === idx
                                            ? 'w-6 bg-primary'
                                            : 'w-2 bg-outline-variant/40 hover:bg-outline-variant'
                                            }`}
                                        title={`Go to Pass ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Booking Reference (TXN) */}
                        {bookingReference && (
                            <div className="mt-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4 relative z-10">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
                                            Booking Reference (TXN)
                                        </p>
                                        <p className="mt-1 font-mono text-xl font-bold tracking-wide text-on-surface">
                                            {bookingReference}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard?.writeText(bookingReference);
                                            toast.add({ type: 'success', title: 'Reference copied', description: 'Keep this to look up your booking later.' });
                                        }}
                                        className="min-h-11 cursor-pointer gap-1.5"
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                                    Combine this with the last name of any hiker on the booking to retrieve it at{' '}
                                    <span className="font-semibold text-on-surface">/lookup</span>. Save it somewhere safe — it is
                                    the only way to recover your booking if you lose your pass.
                                </p>
                            </div>
                        )}

                        {/* Instructions Alert */}
                        <div className="mt-6 bg-surface-container-high rounded-xl p-4 flex items-start gap-4 border border-outline-variant/20 relative z-10">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                <strong>Important:</strong> Present this Ticket/ID at the jump-off point along with your physical documents (valid IDs and signed waivers for all members).
                            </p>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row w-full gap-4 mt-2">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => setIsPassDownloadOpen(true)}
                            className="flex-none sm:flex-1 gap-2 h-10"
                        >
                            <Download className="h-4 w-4" />
                            <span className="text-sm">Download Pass Images</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleOpenEmailModal}
                            className="flex-none sm:flex-1 gap-2 h-10"
                        >
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">Send to Email</span>
                        </Button>
                    </div>
                </div>

                {/* Right Column: Summary & CTA */}
                <div className="lg:col-span-5 flex flex-col gap-6 mt-8 lg:mt-0">

                    {/* Park Staff Messenger CTA */}
                    <a
                        href={MESSENGER_URL}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="bg-secondary text-on-secondary rounded-2xl p-6 shadow-md relative overflow-hidden hover:-translate-y-0.5 transition-all w-full text-left group"
                    >
                        <div className="flex items-center justify-between relative">
                            <div className="flex items-center gap-4">
                                <div className="bg-on-secondary/20 p-3 rounded-full shrink-0">
                                    <MessageSquare className="h-6 w-6 text-on-secondary fill-on-secondary/20" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-0.5">
                                        Message Your Park Staff
                                    </h3>
                                    <p className="text-xs text-on-secondary/80">
                                        Jump-off details and guide updates on Messenger.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform shrink-0" />
                        </div>
                    </a>

                    {/* Receipt Summary Card */}
                    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-outline" />
                            Payment Summary
                        </h3>
                        <div className="space-y-4 text-sm">
                            {receiptData.breakdown.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center pb-4 border-b border-outline-variant/20"
                                >
                                    <span className="text-on-surface-variant">{item.label}</span>
                                    <span className="text-on-surface font-semibold">
                                        {item.amount}
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-base font-bold text-on-surface">
                                    Total Paid
                                </span>
                                <span className="text-xl font-extrabold text-primary">
                                    {receiptData.totalPaid}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-2 text-outline text-xs">
                                <span>{receiptData.paymentMethod}</span>
                                <span>{receiptData.referenceNo}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hiker Resources */}
                    <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            Hiker Resources
                        </h3>

                        <div className="space-y-3 mb-5">
                            {HIKER_RESOURCES.map((resource) => {
                                const IconComponent = resource.icon;
                                return (
                                    <div
                                        key={resource.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                                <IconComponent className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-on-surface leading-snug">
                                                    {resource.title}
                                                </h4>
                                                <p className="text-[11px] text-on-surface-variant">
                                                    {resource.description}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                if (resource.generated) {
                                                    e.preventDefault();
                                                    setIsWaiverOpen(true);
                                                    return;
                                                }
                                                handleDownload(e, resource.downloadUrl, resource.fileName);
                                            }}
                                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer"
                                            title={resource.generated ? 'View liability waiver' : `Download ${resource.fileName}`}
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 rounded-xl border border-outline-variant/50 bg-surface-container-low/60 p-4">
                            <p className="text-sm font-bold text-on-surface mb-1">Bring on hike day</p>
                            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                                No upload needed. Present the physical copies below at the jump-off point,
                                or staff will not be able to check you in.
                            </p>
                            <ul className="space-y-2.5">
                                {CHECKLIST_ITEMS.map((item) => (
                                    <li key={item.id} className="flex items-start gap-2 text-xs text-on-surface-variant">
                                        <span className="mt-0.5 text-primary shrink-0">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p>
                                                <span className="font-semibold text-on-surface">{item.title}</span>
                                                {' — '}
                                                {item.description}
                                            </p>
                                            {item.id === 'health_declaration' && hikerList.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsHealthDeclarationOpen(true)}
                                                    className="mt-1.5 min-h-9 cursor-pointer gap-1.5"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    {`Download health declaration${hikerList.length === 1 ? '' : 's'}`}
                                                </Button>
                                            )}
                                            {item.id === 'booking_ticket' && (
                                                <p className="mt-1 text-[11px] text-on-surface-variant/80">
                                                    Your e-pass above is the accepted ticket copy.
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <DigitalPassDownloadModal
                isOpen={isPassDownloadOpen}
                passes={displayPasses}
                onClose={() => setIsPassDownloadOpen(false)}
                title="Download pass images"
            />

            <PrintableDocumentModal
                isOpen={isHealthDeclarationOpen}
                onClose={() => setIsHealthDeclarationOpen(false)}
                eyebrow="System generated"
                title="Health declaration"
                description="Generated from the answers given at booking. Print one per hiker and present it at the jump-off point."
                documents={healthDeclarationDocuments}
            />

            <PrintableDocumentModal
                isOpen={isWaiverOpen}
                onClose={() => setIsWaiverOpen(false)}
                eyebrow="Accepted for this booking"
                title="Liability waiver"
                description="The four clauses signed by every hiker on this booking, countersigned by the guide at jump-off."
                documents={waiverDocuments}
            />

            {/* Email Input Modal Overlay */}
            {isEmailModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-100 isolate flex items-center justify-center overflow-y-auto bg-inverse-surface/60 p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setIsEmailModalOpen(false);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="email-passes-title"
                        className="relative my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-xl"
                    >

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setIsEmailModalOpen(false)}
                            aria-label="Close email form"
                            className="absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {!isSentSuccess ? (
                            <form onSubmit={handleSendEmailSubmit} className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 id="email-passes-title" className="text-xl font-bold text-on-surface">Email E-Passes</h3>
                                        <p className="text-xs text-on-surface-variant">
                                            {contactEmail
                                                ? 'Send another copy of your physical ticket passes.'
                                                : 'Send physical ticket copies directly to your inbox.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="email-passes-input" className="block text-xs font-semibold uppercase tracking-wider text-on-surface">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email-passes-input"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="name@example.com"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEmailModalOpen(false)}
                                        className="min-h-11 cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        disabled={isSending || !emailInput}
                                        className="min-h-11 cursor-pointer gap-2"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                <span>Send Ticket Pass</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center space-y-4 py-4 text-center animate-in zoom-in-95 duration-200">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                                    <CheckCircle2 className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-on-surface">Email Sent!</h3>
                                    <p className="text-xs text-on-surface-variant max-w-xs">
                                        Your booking passes have been successfully delivered to <strong className="text-on-surface">{emailInput}</strong>.
                                    </p>
                                </div>
                                <Button
                                    variant="default"
                                    onClick={() => setIsEmailModalOpen(false)}
                                    className="mt-2 min-h-11 w-full cursor-pointer"
                                >
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </main>
    );
}