import { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";

import { TRAILS as trails } from '../../mockData';
import { useInView } from '@/hooks/useInView';
import TrailElevationProfile from '@/components/charts/TrailElevationProfile';

function WaypointIcon({ type }) {
    if (type === 'summit') {
        return (
            <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
                <Flag className="h-2.5 w-2.5" />
            </span>
        );
    }
    return (
        <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-white">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
    );
}

export default function TrailShowcase() {
    const [activeTrail, setActiveTrail] = useState('amtic');
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const trail = trails[activeTrail];

    return (
        <section ref={sectionRef} className="w-full px-6 py-16 md:px-12 lg:px-16 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                {/* Section Header & Trail Tabs */}
                <div
                    className={`flex flex-col gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-center md:justify-between transition-all duration-700 ease-out ${isInView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                        }`}
                >
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface md:text-3xl">
                            Trail Showcase
                        </h2>
                        <p className="mt-1 text-sm text-on-surface-variant md:text-base">
                            Explore the authorized routes for ascending Mt. Masaraga.
                        </p>
                    </div>

                    {/* Segmented Tab Controls */}
                    <div
                        role="tablist"
                        aria-label="Available climbing trails"
                        className="inline-flex items-center self-start rounded-xl bg-surface-container-high p-1 md:self-auto"
                    >
                        {Object.entries(trails).map(([key, t]) => {
                            const isActive = activeTrail === key;
                            return (
                                <Button
                                    key={key}
                                    role="tab"
                                    variant={isActive ? "default" : "ghost"}
                                    aria-selected={isActive}
                                    onClick={() => setActiveTrail(key)}
                                    className="rounded-lg px-4 py-2 text-xs font-semibold md:text-sm cursor-pointer"
                                >
                                    {t.name}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Showcase Grid */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Elevation Profile - Using TrailElevationProfile Component */}
                    <div
                        style={{ transitionDelay: '200ms' }}
                        className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm md:p-6 lg:col-span-8 transition-all duration-700 ease-out ${isInView
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95'
                            }`}
                    >
                        <div>
                            <span className="mb-2 inline-block rounded-md bg-primary-container/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                Elevation Profile
                            </span>
                            <h3 className="text-lg font-bold text-on-surface md:text-xl">
                                Mt. Masaraga {trail.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-on-surface-variant md:text-sm">
                                {trail.subtitle}
                            </p>
                        </div>

                        {/* TrailElevationProfile Component */}
                        <TrailElevationProfile trail={trail} showHeader={false} />
                    </div>

                    {/* Sidebar Cards */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        {/* Trail Difficulty Card */}
                        <div
                            style={{ transitionDelay: '350ms' }}
                            className={`rounded-2xl border border-outline-variant bg-surface-container-low p-5 shadow-sm md:p-6 transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Trail Difficulty
                            </span>
                            <div className="mt-2 flex items-baseline gap-2 border-b border-outline-variant pb-4">
                                <span className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                                    {trail.difficulty}
                                </span>
                            </div>

                            {/* Mapped Trail Stats */}
                            <dl className="grid grid-cols-2 gap-1 text-xs md:text-sm">
                                {trail.stats?.map((stat) => {
                                    return (
                                        <div
                                            key={stat.id}
                                            className="flex flex-row items-center justify-between px-3 py-1"
                                        >
                                            <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">
                                                {stat.id}
                                            </dt>
                                            <dd className="text-sm font-extrabold tracking-tight text-on-surface md:text-base">
                                                {stat.value}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                            <div className="flex items-center justify-between border-t border-outline-variant/40 pt-2">
                                <dt className="text-on-surface-variant">Trail Class</dt>
                                <dd className="font-semibold text-primary">{trail.trailClass}</dd>
                            </div>
                        </div>

                        {/* Key Waypoints Card */}
                        <div
                            style={{ transitionDelay: '500ms' }}
                            className={`flex-1 rounded-2xl border border-outline-variant bg-surface-container-low p-5 shadow-sm md:p-6 transition-all duration-700 ease-out ${isInView
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                                }`}
                        >
                            <span className="mb-4 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Key Waypoints
                            </span>

                            {/* Waypoints Timeline List */}
                            {!trail?.waypoints || trail.waypoints.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-lowest/50 px-4 py-8 text-center">
                                    {/* Map Pin / Route Icon */}
                                    <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high/60 border border-outline-variant/30 text-on-surface-variant/70">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                            />
                                        </svg>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-sm font-semibold text-on-surface mb-0.5">
                                        No waypoints listed
                                    </h4>

                                    {/* Description */}
                                    <p className="text-xs text-on-surface-variant max-w-55">
                                        Route stops and landmarks have not been mapped for this trail yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    {trail.waypoints.map((wp, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${wp.icon === 'summit'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-primary/10 text-primary'
                                                        }`}
                                                >
                                                    {idx + 1}
                                                </div>
                                                {idx < trail.waypoints.length - 1 && (
                                                    <div className="w-px h-6 bg-outline-variant/40" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 pb-2">
                                                <p className="text-sm font-semibold text-on-surface">
                                                    {wp.name}
                                                </p>
                                                <p className="text-xs text-on-surface-variant">
                                                    {wp.description}
                                                </p>
                                                {wp.icon && (
                                                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                        {wp.icon}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}