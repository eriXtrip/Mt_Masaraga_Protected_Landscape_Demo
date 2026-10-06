import React from 'react';
import MtMasaragaLogo from '../../../../public/assets/logo/MT. MASARAGA LOGO.png';

export default function HikerTicketPass({ currentPass }) {
    // Helper to calculate 6 months validity from the climb date
    const getExpirationDate = (dateString) => {
        const baseDate = dateString ? new Date(dateString) : new Date();
        if (isNaN(baseDate.getTime())) {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 6);
            return futureDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }

        baseDate.setMonth(baseDate.getMonth() + 6);
        return baseDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const validUntilDate = getExpirationDate(currentPass?.date);

    return (
        /* Outer Scaler Wrapper: Forces horizontal preservation on mobile via scale */
        <div className="w-full overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 flex justify-center">
            <div className="w-135 shrink-0 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 relative select-none transform origin-top scale-[0.82] min-[420px]:scale-[0.9] sm:scale-100 -mb-10 min-[420px]:-mb-5 sm:mb-0">

                {/* 1. Official ID Header Bar */}
                <div className="bg-primary/70 border-b border-outline-variant/20 px-6 pt-5 pb-4 flex justify-between items-center relative z-10">
                    <img
                        src={MtMasaragaLogo}
                        alt="Mt. Masaraga Logo"
                        className="h-10 w-auto object-contain"
                    />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-on-primary-container uppercase tracking-widest block">
                            ECOTOURISM TRAIL ID
                        </span>
                        <span className="text-xs font-mono font-bold text-inverse-primary bg-inverse-on-surface px-2.5 py-0.5 rounded-md mt-0.5">
                            {currentPass.id}
                        </span>
                    </div>
                </div>

                {/* 2. Main Ticket & ID Body (Permanent Horizontal Row) */}
                <div className="p-6 flex flex-row items-center justify-between gap-5">

                    {/* Pass Specs & Details */}
                    <div className="flex-1 space-y-3.5 min-w-0 text-left">

                        {/* Hiker Name Header */}
                        <div className="border-b border-outline-variant/15 pb-2.5">
                            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-0.5">
                                HIKER NAME / CARDHOLDER
                            </span>
                            <h3
                                className="text-2xl font-extrabold text-on-surface tracking-tight leading-tight line-clamp-2 wrap-break-words"
                                title={currentPass.hikerName}
                            >
                                {currentPass.hikerName}
                            </h3>
                        </div>

                        {/* Key-Value Details Grid */}
                        <div className="grid grid-cols-2 gap-y-3 gap-x-3.5">
                            <div className="min-w-0">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                                    GUIDE HIKER
                                </span>
                                <span
                                    className="text-xs font-bold text-on-surface line-clamp-2 leading-snug wrap-break-words"
                                    title={currentPass.guideHiker}
                                >
                                    {currentPass.guideHiker || 'Not provided'}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                                    ASSIGNED TRAIL
                                </span>
                                <span
                                    className="text-xs font-bold text-on-surface line-clamp-2 leading-snug wrap-break-words"
                                    title={currentPass.trail}
                                >
                                    {currentPass.trail}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                                    CLIMB DATE
                                </span>
                                <span className="text-xs font-bold text-on-surface block truncate">
                                    {currentPass.date}
                                </span>
                            </div>

                            <div className="min-w-0">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                                    VALID UNTIL (6 MOS)
                                </span>
                                <span className="text-xs font-bold text-primary block truncate">
                                    {validUntilDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Scannable QR Code & Status Stub */}
                    <div className="flex flex-col items-center shrink-0 border-l border-outline-variant/20 pl-5">
                        <div className="bg-white p-2 rounded-2xl border border-outline-variant/30 shadow-sm">
                            <img
                                src={currentPass.qrCodeUrl}
                                alt="QR Code Pass"
                                className="w-28 h-28 object-cover rounded-xl"
                            />
                        </div>

                        <span className="text-[9px] font-mono text-on-surface-variant mt-1.5 uppercase tracking-widest font-semibold">
                            SCAN AT JUMP-OFF
                        </span>
                    </div>

                </div>

                {/* 4. Official Footer Bar */}
                <div className="bg-surface-container-low px-6 py-2 border-t border-outline-variant/15 flex justify-between items-center text-[10px] text-on-surface-variant">
                    <span>Mount Masaraga Protected Landscape</span>
                    <span className="font-mono text-[9px]">AUTHORIZED PASS</span>
                </div>

            </div>
        </div>
    );
}