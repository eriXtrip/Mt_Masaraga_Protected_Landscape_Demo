import React, { useState } from 'react';
import { Droplets, MoveVertical, Trees, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

import { ABOUT_ZONES as zones } from '../../mockData';
import { Button } from "@/components/ui/button";

import { useInView } from '@/hooks/useInView';

export default function Overview() {
    const [currentZoneIdx, setCurrentZoneIdx] = useState(0);
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const inspectZone = (zoneId) => {
        const idx = zones.findIndex(z => z.id === zoneId);
        if (idx !== -1) {
            setCurrentZoneIdx(idx);
        }
    };

    const cycleZone = (step) => {
        setCurrentZoneIdx((prevIdx) => (prevIdx + step + zones.length) % zones.length);
    };

    const currentZone = zones[currentZoneIdx];

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden px-6 pt-16 pb-6 md:px-5 lg:px-10">
            <div className="max-w-6xl mx-auto pt-20">
                {/* Two Column Modern Spatial Hero Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    {/* Left Content & Interactive Stats Column */}
                    <div
                        className={`lg:col-span-6 flex flex-col justify-between space-y-6 transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                            }`}
                    >
                        <div>
                            {/* Main Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172b1d] tracking-tight leading-[1.12] mb-5">
                                Discover <span className="text-transparent bg-clip-text bg-linear-to-r from-[#385e1b] to-[#5b8c31]">Mt. Masaraga</span>
                            </h1>
                            <p className="text-base text-[#38463c] leading-relaxed mb-4 font-normal">
                                Rising majestically in the Bicol region, Mt. Masaraga is a forested stratovolcano standing at <strong className="font-semibold text-[#172b1d]">1,328 meters</strong> above sea level. Characterized by dense, lush mountain moss forests and rugged terrain, it offers a challenging yet deeply rewarding experience for ecotourism and conservation advocates.
                            </p>
                            <p className="text-sm text-[#546458] leading-relaxed mb-6 font-normal">
                                Under the stewardship of the Protected Area Management Board (PAMB) and the Department of Environment and Natural Resources (DENR), active bio-monitoring preserves its endemic flora and fauna, making it an extraordinary living laboratory for environmental research.
                            </p>

                            {/* Micro Feature Tabs */}
                            <div
                                style={{ transitionDelay: '200ms' }}
                                className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 transition-all duration-700 ease-out ${isInView
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-6'
                                    }`}
                            >
                                {/* Stat 1 */}
                                <div className="metric-card text-left p-3 rounded-xl bg-white/70 border border-[#5b8c31]/20">
                                    <div className="flex items-center justify-between mb-1">
                                        <MoveVertical className="w-4 h-4 text-[#5b8c31]" />
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5b8c31]/10 text-[#5b8c31]">ASL</span>
                                    </div>
                                    <div className="font-bold text-xs sm:text-sm text-[#172b1d]">1,328m</div>
                                    <div className="text-[11px] text-[#5e7063]">Summit Crest</div>
                                </div>

                                {/* Stat 2 */}
                                <div className="metric-card text-left p-3 rounded-xl bg-white/70 border border-[#5b8c31]/20">
                                    <div className="flex items-center justify-between mb-1">
                                        <Trees className="w-4 h-4 text-[#5b8c31]" />
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5b8c31]/10 text-[#5b8c31]">Flora</span>
                                    </div>
                                    <div className="font-bold text-xs sm:text-sm text-[#172b1d]">Moss Forest</div>
                                    <div className="text-[11px] text-[#5e7063]">Cloud Canopy</div>
                                </div>

                                {/* Stat 3 */}
                                <div className="metric-card text-left p-3 rounded-xl bg-white/70 border border-[#5b8c31]/20">
                                    <div className="flex items-center justify-between mb-1">
                                        <Droplets className="w-4 h-4 text-[#5b8c31]" />
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5b8c31]/10 text-[#5b8c31]">River</span>
                                    </div>
                                    <div className="font-bold text-xs sm:text-sm text-[#172b1d]">Watershed</div>
                                    <div className="text-[11px] text-[#5e7063]">Perennial Stream</div>
                                </div>

                                {/* Stat 4 */}
                                <div className="metric-card text-left p-3 rounded-xl bg-white/70 border border-[#5b8c31]/20">
                                    <div className="flex items-center justify-between mb-1">
                                        <BadgeCheck className="w-4 h-4 text-[#5b8c31]" />
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5b8c31]/10 text-[#5b8c31]">PAMB</span>
                                    </div>
                                    <div className="font-bold text-xs sm:text-sm text-[#172b1d]">DENR Stewarded</div>
                                    <div className="text-[11px] text-[#5e7063]">Protected Area</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Interactive Spatial Visual Column */}
                    <div
                        style={{ transitionDelay: '350ms' }}
                        className={`lg:col-span-6 relative flex flex-col min-h-125 lg:min-h-140 rounded-3xl overflow-hidden border border-[#c2cfc5] shadow-xl group/card transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-8 scale-95'
                            }`}
                    >
                        {/* Dynamic Landscape Photography Layers */}
                        <div className="absolute inset-0 z-0 overflow-hidden bg-[#172b1d]">
                            {zones.map((zone, idx) => (
                                <img
                                    key={zone.id}
                                    alt={zone.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-105 transform ${currentZoneIdx === idx ? 'opacity-100' : 'opacity-0'}`}
                                    src={zone.image}
                                />
                            ))}
                            {/* Subtle gradient overlays for readability */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/30 pointer-events-none"></div>
                        </div>

                        {/* Bottom Interactive Zone Detail Card */}
                        <div className="mt-auto relative z-10 p-4 sm:p-6">
                            <div className="bg-on-surface/5 backdrop-blur-xs border border-white/15 rounded-2xl p-5 sm:p-6 text-white transition-all duration-300 shadow-2xl">
                                {/* Zone Top Metadata Bar & Controls */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold uppercase tracking-wider text-on-secondary">{currentZone.title}</span>
                                    </div>

                                    {/* Left / Right Chevron Navigation Controls */}
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            aria-label="Previous zone"
                                            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#5b8c31] hover:text-white transition-colors flex items-center justify-center text-white/90 active:scale-95 border border-white/10 cursor-pointer"
                                            onClick={() => cycleZone(-1)}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            aria-label="Next zone"
                                            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#5b8c31] hover:text-white transition-colors flex items-center justify-center text-white/90 active:scale-95 border border-white/10 cursor-pointer"
                                            onClick={() => cycleZone(1)}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Zone Description */}
                                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">{currentZone.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}