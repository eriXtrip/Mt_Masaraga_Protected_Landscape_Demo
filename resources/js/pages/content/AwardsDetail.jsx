import React from 'react';
import { useInView } from '@/hooks/useInView';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Verified, Trees, Users2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

import { AWARDS } from '../../mockData';

export default function AwardDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const data = AWARDS.find((award) => award.id === id);

    return (
        <div className="min-h-dvh bg-surface font-sans">

            {/* Top Back Action Header */}
            <header className="bg-surface">
                <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate(-1)}
                        className="gap-2 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-lg font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Achievements</span>
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main ref={sectionRef} className="mx-auto w-full max-w-7xl px-6 py-5 md:px-15 md:py-10 overflow-hidden">
                <div className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Hero Section */}
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16 mb-16">

                    {/* Image Column */}
                    <div className="lg:col-span-5">
                        <div className="overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant/30">
                            <img
                                src={data.image}
                                alt={data.imageAlt}
                                className="h-auto w-full object-cover aspect-4/5"
                            />
                        </div>
                    </div>

                    {/* Meta & Info Column */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 text-on-secondary-container w-fit text-xs font-bold uppercase tracking-wider mb-4">
                            <Verified className="h-4 w-4 text-primary" />
                            <span>{data.badge}</span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl md:leading-tight mb-4">
                            {data.title}
                        </h1>

                        <p className="text-base leading-relaxed text-on-surface-variant md:text-lg mb-6">
                            Presented by the <strong className="font-bold text-on-surface">{data.awardingBody}</strong> to the Mt. Masaraga Protected Landscape for outstanding dedication to planet earth and sustainable visitor management.
                        </p>

                        {/* Structured Specifications Grid */}
                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-surface-container-low/60 p-5 border border-outline-variant/30 text-xs font-medium text-on-surface md:text-sm">
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                                    Awarding Body
                                </span>
                                <span className="block font-bold text-on-surface">
                                    {data.awardingBody}
                                </span>
                            </div>

                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                                    Date Received
                                </span>
                                <span className="block font-bold text-on-surface">
                                    {data.dateReceived}
                                </span>
                            </div>

                            <div className="col-span-2 pt-3 border-t border-outline-variant/30">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-outline mb-1">
                                    Category
                                </span>
                                <span className="block font-bold text-on-surface">
                                    {data.category}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Conservation Journey Narrative (Asymmetric Grid) */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-on-surface md:text-4xl">
                        The Conservation Journey
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

                        {/* Narrative Story */}
                        <div className="md:col-span-8 space-y-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8">
                            <h3 className="text-xl font-bold text-primary md:text-2xl">
                                {data.story.title}
                            </h3>
                            {data.story.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-base leading-relaxed text-on-surface-variant">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Key Metrics Sidebar */}
                        <div className="md:col-span-4 flex flex-col justify-between gap-4">
                            {data.metrics.map((metric) => {
                                const IconComponent = metric.icon;
                                return (
                                    <div
                                        key={metric.id}
                                        className="flex-1 rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-6 flex flex-col items-center justify-center text-center space-y-2"
                                    >
                                        <IconComponent className="h-8 w-8 text-primary" />
                                        <span className="text-4xl font-black text-on-surface">
                                            {metric.value}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                            {metric.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>
                </div>
            </main>
        </div>
    );
}