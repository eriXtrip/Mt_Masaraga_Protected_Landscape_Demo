import React from 'react';
import { Mountain, Calendar, ArrowRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BOOKING_DETAILS } from '../../mockData';
import { useAdminStore } from '../../state/adminStore';

const MAX_PARTICIPANTS = 5;

export default function BookingSummaryCard({
    trailId = 'amtic',
    selectedTrail,
    baseFeePerPax,
    selectedDate = 'Please select a date',
    participantCount = 1,
    setParticipantCount,
    maxParticipants: slotLimit,
    onContinue,
    onCancel,
    className = '',
}) {
    const { settings } = useAdminStore();
    const groupMaxParticipants = settings?.booking?.maxGroupSize || MAX_PARTICIPANTS;
    const isSlotLimited = slotLimit !== undefined && slotLimit < groupMaxParticipants;
    const maxParticipants = Math.max(1, Math.min(groupMaxParticipants, slotLimit ?? groupMaxParticipants));

    // Lookup data directly from BOOKING_DETAILS using trailId
    const trailBookingData = BOOKING_DETAILS[trailId] || BOOKING_DETAILS.amtic;

    // Use passed props if available, otherwise read directly from BOOKING_DETAILS
    const activeTrailName = selectedTrail || trailBookingData.selectedTrail;
    const activeBaseFee = baseFeePerPax ?? trailBookingData.baseFeePerPax;
    const activeNote = trailBookingData.note;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);

    const isDateSelected = selectedDate && selectedDate !== 'Please select a date';

    const SUMMARY_ITEMS = [
        {
            id: 'trail',
            label: 'Selected Trail',
            value: activeTrailName,
            icon: Mountain,
        },
        {
            id: 'date',
            label: 'Selected Date',
            value: selectedDate,
            icon: Calendar,
        },
    ];

    return (
        <div
            className={`bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/40 ${className}`}
        >
            {/* Header */}
            <div className="border-b border-outline-variant/60 pb-5 mb-5">
                <h3 className="text-xl font-bold text-on-surface tracking-tight">
                    Booking Summary
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">
                    Review your selection before proceeding.
                </p>
            </div>

            {/* Trail & Date Selections */}
            <div className="space-y-4 mb-6">
                {SUMMARY_ITEMS.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface/80 border border-outline-variant/50 transition-colors hover:bg-surface"
                        >
                            <span className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 flex items-center justify-center">
                                <IconComponent className="h-5 w-5" />
                            </span>
                            <div>
                                <span className="text-[11px] font-semibold text-outline tracking-wider uppercase block">
                                    {item.label}
                                </span>
                                <span className="text-sm font-bold text-on-surface leading-snug">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pax Selector */}
            {setParticipantCount && (
                <div className="border-t border-outline-variant/60 pt-5 space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm font-bold text-on-surface block">Participants</span>
                            <span className="text-xs text-on-surface-variant font-medium">
                                {isSlotLimited
                                    ? `${maxParticipants} ${maxParticipants === 1 ? 'slot' : 'slots'} left for this date`
                                    : `Max ${maxParticipants} hikers per booking`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-surface-container border border-outline-variant/50 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}
                                disabled={participantCount <= 1}
                                className="p-2 rounded hover:bg-surface-variant/50 text-on-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-bold text-on-surface w-4 text-center">{participantCount}</span>
                            <button
                                type="button"
                                 onClick={() => setParticipantCount(Math.min(maxParticipants, participantCount + 1))}
                                 disabled={participantCount >= maxParticipants}
                                className="p-2 rounded hover:bg-surface-variant/50 text-on-surface-variant transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Price Calculation & Estimated Breakdown */}
            <div className="border-t border-outline-variant/60 pt-5 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                        Base Fee ({participantCount} x {formatCurrency(activeBaseFee)})
                    </span>
                    <span className="font-bold text-on-surface">
                        {formatCurrency(activeBaseFee * participantCount)}
                    </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-outline-variant">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                            Total Estimated
                        </span>
                        <span className="text-[11px] text-on-surface-variant italic leading-tight">
                            {activeNote}
                        </span>
                    </div>
                    <span className="text-2xl font-black text-primary ml-2 shrink-0">
                        {formatCurrency(activeBaseFee * participantCount)}
                    </span>
                </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="space-y-3 pt-2">
                <Button
                    onClick={onContinue}
                    variant="default"
                    size="lg"
                    className="w-full font-bold cursor-pointer"
                    disabled={!isDateSelected}
                >
                    <span>Continue to Hiker Details</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </Button>

                <Button
                    onClick={onCancel}
                    variant="outline"
                    size="lg"
                    className="w-full font-bold cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}