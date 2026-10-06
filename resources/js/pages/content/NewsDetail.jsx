import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    AlertTriangle,
    Phone,
    Mail,
    Info,
    ArrowLeft,
    Share2,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import { NEWS } from '../../mockData';

export default function NewsDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    // Match article by URL parameter ID, fallback to first article if not found
    const currentArticle = NEWS.find((item) => item.id === id) || NEWS[0];

    // Filter out current article from Related Updates list
    const relatedUpdates = NEWS.filter((item) => item.id !== currentArticle.id);

    return (
        <div className="min-h-dvh bg-surface font-sans">

            {/* Top Bar Navigation - Minimal & Functional */}
            <header className=" bg-surface">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate(-1)}
                        className="gap-2 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-lg font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to News & Updates</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: currentArticle.title,
                                    url: window.location.href,
                                });
                            }
                        }}
                        className="gap-2 cursor-pointer rounded-lg border-outline-variant/40 hover:bg-surface-container-low font-medium"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                    </Button>
                </div>
            </header>

            {/* Main Article Layout */}
            <main ref={sectionRef} className={`mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-5 md:px-15 md:py-10 lg:flex-row lg:gap-16 overflow-hidden transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Left Column: Article Narrative Body */}
                <article className="grow lg:w-2/3 flex flex-col gap-8">

                    {/* Meta & Editorial Header */}
                    <header className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${currentArticle.badgeClass || 'bg-surface-container-high text-on-surface'}`}>
                                {currentArticle.badge || currentArticle.category || 'Announcement'}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                                <Calendar className="h-3.5 w-3.5 text-outline" />
                                {currentArticle.date}
                            </span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl md:text-5xl md:leading-tight">
                            {currentArticle.title}
                        </h1>

                        <p className="text-lg leading-relaxed text-on-surface-variant font-normal md:text-xl">
                            {currentArticle.leadParagraph || currentArticle.description}
                        </p>
                    </header>

                    {/* Editorial Lead Image Frame */}
                    {currentArticle.leadImage && (
                        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-surface-container-high md:h-110">
                            <img
                                src={currentArticle.leadImage}
                                alt={currentArticle.leadImageAlt || currentArticle.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content Section Renderer */}
                    <div className="space-y-6 text-base leading-relaxed text-on-surface md:text-lg">
                        {currentArticle.sections ? (
                            currentArticle.sections.map((section, idx) => {
                                if (section.type === 'paragraph') {
                                    return (
                                        <p key={idx} className="text-on-surface-variant leading-relaxed">
                                            {section.text}
                                        </p>
                                    );
                                }

                                if (section.type === 'heading') {
                                    return (
                                        <h2 key={idx} className="pt-6 text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                                            {section.text}
                                        </h2>
                                    );
                                }

                                if (section.type === 'list') {
                                    return (
                                        <div key={idx} className="my-4 space-y-3 text-base font-medium">
                                            {section.items.map((item, itemIdx) => (
                                                <div key={itemIdx} className="text-on-surface">
                                                    <strong className="font-bold text-on-surface">{item.label}:</strong> {item.text}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }

                                return null;
                            })
                        ) : (
                            <p className="text-on-surface-variant">
                                {currentArticle.description}
                            </p>
                        )}
                    </div>
                </article>

                {/* Right Column: Clean Sidebar */}
                <aside className="lg:w-1/3 flex flex-col gap-10">

                    {/* Emergency Contact Block */}
                    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                            <div className="flex items-center gap-2.5">
                                <h3 className="text-sm font-extrabold uppercase tracking-wider text-on-surface">
                                    Emergency Hotline
                                </h3>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                24/7 Patrol
                            </span>
                        </div>

                        <p className="text-xs leading-relaxed text-on-surface-variant">
                            For immediate assistance regarding trail hazards, injuries, or ranger dispatches.
                        </p>

                        {/* Primary Hotline Action Button */}
                        <a
                            href={`tel:${(currentArticle.contact?.phone || '+63 (052) 555-0198').replace(/[^0-9+]/g, '')}`}
                            className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-error-container bg-error-container p-4 text-on-error-container transition-all hover:bg-error/30 active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-white/20 p-2 transition-transform group-hover:scale-110">
                                    <Phone className="h-5 w-5 fill-current" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold uppercase tracking-wider">
                                        Direct Ranger Station
                                    </span>
                                    <span className="text-base font-black tracking-tight md:text-lg">
                                        {currentArticle.contact?.phone || '+63 (052) 555-0198'}
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* Secondary Contact Link (Email) */}
                        <a
                            href={`mailto:${currentArticle.contact?.email || 'ranger.station@masaraga.gov'}`}
                            className="flex items-center gap-2.5 px-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <Mail className="h-3.5 w-3.5 text-outline" />
                            <span className="truncate">{currentArticle.contact?.email || 'ranger.station@masaraga.gov'}</span>
                        </a>
                    </div>

                    {/* Related Updates Section */}
                    {relatedUpdates.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
                                Related Updates
                            </h3>

                            <div className="space-y-4">
                                {relatedUpdates.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/news/${item.id}`}
                                        className="group flex gap-4 items-start border-b border-outline-variant/20 pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="w-24 h-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                                            {item.leadImage ? (
                                                <img
                                                    src={item.leadImage}
                                                    alt={item.leadImageAlt || item.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-outline text-[10px]">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                                                {item.badge || item.category} • {item.date}
                                            </span>
                                            <h4 className="text-sm font-bold text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </aside>

            </main>
        </div>
    );
}