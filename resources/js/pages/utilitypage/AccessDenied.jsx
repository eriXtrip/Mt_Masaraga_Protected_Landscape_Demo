import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    ShieldAlert,
    ChevronRight,
    KeyRound,
    PhoneCall,
    Ticket,
    FileText,
    Lock,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLottie } from "lottie-react";
import ErrorCone from "../../components/lottiefiles/Error cone.json";
import { useAdminStore } from '../../state/adminStore';

const SUGGESTED_ACTIONS = [
    {
        icon: Ticket,
        title: "Permit Application",
        desc: "Apply for hiking permits or check slot availability in Ligao City / DENR.",
        to: "/booking",
    },
    {
        icon: FileText,
        title: "Climber Requirements",
        desc: "Review required IDs, medical certificates, and mandatory guide ratios.",
        to: "/help",
    },
    {
        icon: PhoneCall,
        title: "Contact Local Tourism/Rangers",
        desc: "Direct contact info for accredited guides or local tourism offices.",
        to: "/contact",
    },
];

export default function AccessDenied() {
    const navigate = useNavigate();
    const { settings } = useAdminStore();
    const accessDeniedSettings = settings?.utility?.accessDenied || {};

    const { View } = useLottie({
        animationData: ErrorCone,
        loop: true,
        autoplay: true,
    });

    return (
        <main className="min-h-dvh w-full bg-surface px-6 py-10 md:px-12 lg:px-16 font-sans flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl space-y-5 text-center">

                {/* 1. Navigation & Global Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                    </button>
                </nav>

                {/* 2. Visual Hierarchy & Park Branding Graphic */}
                <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
                    <div className="absolute inset-0 rounded-3xl bg-primary/40 blur-3xl" />

                    {/* Mt. Masaraga Park Gate / Lock Motif */}
                    <div className="relative z-10 flex items-center justify-center">
                        {View}
                    </div>
                </div>

                {/* Main Hero Header & Explanatory Subtext */}
                <div className="space-y-3 max-w-xl mx-auto">

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-on-surface">
                        {accessDeniedSettings.title || 'Clearance Required'}
                    </h1>

                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                        {accessDeniedSettings.message || 'This area requires verified clearance to view.'}
                    </p>
                </div>

                {/* 3. Direct Clear Next-Step Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center gap-2 font-bold cursor-pointer rounded-xl px-6"
                    >
                        <KeyRound className="h-4 w-4" />
                        <span>Log In / Verify Permit Clearance</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/contact")}
                        className="font-bold cursor-pointer rounded-xl border-outline-variant/40 text-on-surface hover:bg-surface-container-low"
                    >
                        Contact Tourism / Ranger Station
                    </Button>
                </div>

                {/* 4. Enhanced Alternative Option Cards */}
                <div className="pt-8 border-t border-outline-variant/30 space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-outline text-center">
                        Alternative Options
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-left">
                        {SUGGESTED_ACTIONS.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.title}
                                    to={item.to}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xs transition-all hover:border-primary/40 hover:bg-surface-container-low/60 hover:shadow-sm"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                                                <IconComponent className="h-4 w-4" />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-outline transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                        </div>

                                        <div>
                                            <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-[11px] text-on-surface-variant leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
}