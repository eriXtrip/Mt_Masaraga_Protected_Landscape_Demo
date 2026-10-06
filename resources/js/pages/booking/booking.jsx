import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressNode from '@/components/features/ProgressNode';
import { Calendar } from '@/components/ui/calendar';
import BookingSummaryCard from '@/components/features/BookingSummaryCard';
import HikerDetailsForm from '@/components/forms/HikerDetailsForm';
import PaymentForm from '@/components/forms/PaymentForm';
import BookingConfirmation from './BookingConfirmation';
import PaymentOverlay from '@/components/features/PaymentOverlay';
import { createBooking, createBookingReference, useAdminStore } from '../../state/adminStore';
import { addHikerBooking } from '../../state/hikerStore';
import { toast } from '../../components/ui/toast';

import QR from '../../../../public/images/QR_Code_Example.svg.webp';
import { BOOKING_DETAILS, TRAILS, ADMIN_SCHEDULES } from '../../mockData';

const STEPS = ['Select Date', 'Hiker Details', 'Payment'];

function getDateKey(date) {
    return date.toLocaleDateString('en-CA');
}

// Dates the park has scheduled for this trail, from admin-published schedules.
// Maps an ISO date key to the number of slots still open on that date.
function getScheduledSlots(trailId) {
    return ADMIN_SCHEDULES.reduce((map, schedule) => {
        if (schedule.trailId === trailId) {
            map[schedule.dateKey] = Math.max(0, schedule.capacity - schedule.booked);
        }
        return map;
    }, {});
}

export default function Booking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { settings } = useAdminStore();
    const bookingSettings = settings?.booking || {};

    // 1. Resolve trail key safely (defaults to 'amtic' if undefined or invalid)
    const trailId = id && TRAILS[id] ? id : 'amtic';
    const trail = TRAILS[trailId];
    const trailBookingDetails = BOOKING_DETAILS[trailId] || BOOKING_DETAILS.amtic;
    const trailSlots = getScheduledSlots(trailId);

    const [currentStep, setCurrentStep] = useState(1);
    const [date, setDate] = useState(undefined);
    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);

    // Application Data State
    const [hikerData, setHikerData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);

    // The booking reference doubles as the PNR for the public lookup, so it is
    // minted once at payment and reused for the confirmation screen.
    const [bookingReference, setBookingReference] = useState(null);

    // Inbox that receives the confirmation and e-passes, captured from the lead hiker.
    const [contactEmail, setContactEmail] = useState('');

    // Scroll smoothly to top whenever step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Reset all state when trail id changes
    useEffect(() => {
        setCurrentStep(1);
        setDate(undefined);
        setShowPaymentOverlay(false);
        setParticipantCount(1);
        setHikerData(null);
        setPaymentData(null);
        setBookingReference(null);
        setContactEmail('');
    }, [trailId]);

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    const handleNextStep = () => {
        setCurrentStep((prev) => prev + 1);
    };

    const handlePaymentComplete = () => {
        if (!hikerData?.length || !paymentData || !date || !selectedSchedule) return;

        const feeBreakdown = [
            { label: `Base Fee (${hikerData.length} x ₱${baseFee})`, amount: totalBaseFee },
            { label: 'Processing fee', amount: processingFee },
        ];

        const reference = createBookingReference();

        createBooking({
            reference,
            scheduleId: selectedSchedule.id,
            guideHiker: selectedSchedule?.guide || '',
            contact: hikerData[0].emergencyContact,
            trail: selectedSchedule.trail,
            date: formattedSelectedDate,
            participants: hikerData.length,
            totalPaid: paymentData.totalAmount,
            paymentMethod: paymentData.paymentMethod,
            status: 'Confirmed',
            feeBreakdown,
            // One inbox per booking: the lead hiker receives the confirmation, all e-passes,
            // and the booking reference used at /lookup.
            contactEmail: hikerData[0].email,
            hikers: hikerData.map((hiker) => ({
                fullName: hiker.fullName,
                dateOfBirth: hiker.dateOfBirth,
                address: hiker.address,
                email: hiker.email || hikerData[0].email,
                emergencyName: hiker.emergencyName,
                emergencyRelationship: hiker.emergencyRelationship,
                emergencyContact: hiker.emergencyContact,
                healthAnswers: { ...hiker.healthAnswers },
                agreeWaiver: hiker.agreeWaiver,
            })),
        });

        addHikerBooking({
            trail: trailBookingDetails.selectedTrail,
            hikeDate: formattedSelectedDate,
            dateBooked: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            passes: passesData,
            hikers: hikerData,
            totalAmount,
            paymentMethod: paymentData.paymentMethod,
            breakdown: feeBreakdown,
        });

        setShowPaymentOverlay(false);
        setBookingReference(reference);
        setContactEmail(hikerData[0].email);
        toast.add({ type: 'success', title: 'Booking confirmed!', description: `Your e-passes are ready at ${hikerData[0].email}.` });
        handleNextStep();
    };

    const formattedSelectedDate = date
        ? date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : 'Please select a date';

    const selectedSchedule = date
        ? ADMIN_SCHEDULES.find((schedule) => schedule.trailId === trailId && schedule.dateKey === getDateKey(date))
        : null;

    // The date's remaining slots cap the group size, on top of the admin group limit.
    const groupMaxParticipants = bookingSettings.maxGroupSize ?? 5;
    const availableSlots = selectedSchedule ? trailSlots[getDateKey(date)] : null;
    const maxParticipants = availableSlots === null
        ? groupMaxParticipants
        : Math.min(groupMaxParticipants, availableSlots);

    useEffect(() => {
        setParticipantCount((prev) => Math.max(1, Math.min(prev, maxParticipants)));
    }, [maxParticipants]);

    const guideHiker = selectedSchedule?.guide || '';

    // Dynamic Passes Data generated for Confirmation view
    const passesData = hikerData
        ? hikerData.map((hiker, index) => ({
            id: `MMPL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`,
            qrCodeUrl: QR,
            status: 'Valid',
            date: formattedSelectedDate,
            trail: trailBookingDetails.selectedTrail,
            guideHiker,
            hikerName: hiker.fullName,
        }))
        : undefined;

    const baseFee = bookingSettings.baseFeePerPax ?? trailBookingDetails.baseFeePerPax;
    const totalBaseFee = baseFee * participantCount;
    const processingFee = bookingSettings.processingFee ?? 50;
    const totalAmount = totalBaseFee + processingFee;

    // Dynamic Receipt Data generated for Confirmation view
    const receiptData = {
        breakdown: [
            { label: `Base Fee (${participantCount} x ₱${baseFee})`, amount: `₱${totalBaseFee.toFixed(2)}` },
            { label: 'Processing Fee', amount: `₱${processingFee.toFixed(2)}` },
        ],
        totalPaid: `₱${totalAmount.toFixed(2)}`,
        paymentMethod: `Paid via ${paymentData?.paymentMethod || 'GCash'}`,
        referenceNo: bookingReference ? `Ref: ${bookingReference}` : `Ref: MSG${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    const bookingSummary = {
        trail: trailBookingDetails.selectedTrail,
        date: formattedSelectedDate,
        participants: `${participantCount} Pax`,
        breakdown: [
            { label: `Base Fee (${participantCount} x ₱${baseFee})`, amount: totalBaseFee },
            { label: 'Processing Fee', amount: processingFee },
        ],
        totalAmount: totalAmount,
    };

    return (
        <div ref={sectionRef} className="min-h-dvh bg-surface font-sans">
            <div className={`max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-10 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Header / Progress Section (Only visible during steps 1 - 3) */}
                {currentStep <= 3 && (
                    <header className="flex flex-col items-center text-center gap-6 md:gap-8">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                                Trail Booking
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-2">
                                Book {trail.name}
                            </h1>
                            <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-xl">
                                Pick your climb date, register your group, and pay. No account needed.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-2xl">
                            {STEPS.map((stepName, index) => {
                                const step = index + 1;
                                const isCompleted = step < currentStep;
                                const isActive = step === currentStep;

                                return (
                                    <ProgressNode
                                        key={step}
                                        variant="line"
                                        step={step}
                                        name={stepName}
                                        isActive={isActive}
                                        isCompleted={isCompleted}
                                        activeStepName={`${STEPS[currentStep - 1]}`}
                                        color="primary"
                                    />
                                );
                            })}
                        </div>
                    </header>
                )}

                {/* Steps Content Area */}
                {currentStep <= 3 && (
                    <div className="flex flex-col gap-6">
                        <div className="flex-1 min-w-0">
                            {/* STEP 1: SELECT DATE */}
                            {currentStep === 1 && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                    <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 sm:p-8 shadow-sm">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            slots={trailSlots}
                                        />
                                    </div>
                                    <div className="lg:col-span-4 lg:sticky lg:top-6">
                                        <BookingSummaryCard
                                            trailName={trailBookingDetails.selectedTrail}
                                            baseFee={baseFee}
                                            selectedDate={formattedSelectedDate}
                                            participantCount={participantCount}
                                            setParticipantCount={setParticipantCount}
                                            maxParticipants={maxParticipants}
                                            onContinue={handleNextStep}
                                            onCancel={() => navigate('/trail')}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: HIKER DETAILS */}
                            {currentStep === 2 && (
                                <HikerDetailsForm
                                    participantCount={participantCount}
                                    onBack={() => goToStep(1)}
                                    onNext={(formDataArray) => {
                                        setHikerData(formDataArray);
                                        handleNextStep();
                                    }}
                                />
                            )}

                            {/* STEP 3: PAYMENT FORM */}
                            {currentStep === 3 && (
                                <PaymentForm
                                    summary={bookingSummary}
                                    onBack={() => goToStep(2)}
                                    onPayNow={(data) => {
                                        setPaymentData(data);
                                        setShowPaymentOverlay(true);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 4: BOOKING CONFIRMATION */}
                {currentStep === 4 && (
                    <BookingConfirmation
                        selectedDate={formattedSelectedDate}
                        passesData={passesData}
                        receiptData={receiptData}
                        hikerData={hikerData}
                        bookingReference={bookingReference}
                        contactEmail={contactEmail}
                        onSendEmail={(email) => {
                            toast.add({ type: 'info', title: 'Email sent', description: `Passes sent to ${email}.` });
                        }}
                    />
                )}
            </div>

            <PaymentOverlay
                isOpen={showPaymentOverlay}
                paymentMethod={paymentData?.paymentMethod || 'GCash'}
                amount={bookingSummary.totalAmount}
                onClose={() => setShowPaymentOverlay(false)}
                onComplete={handlePaymentComplete}
            />
        </div>
    );
}
