import React from "react";
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarX, LifeBuoy } from 'lucide-react';
import { useAdminStore } from '../../state/adminStore';
import { useLottie } from "lottie-react";
import ErrorCallendar from "../../components/lottiefiles/Calendar Error.json"

export default function BookingSuspended() {
    const { settings } = useAdminStore();
    const bookingSettings = settings?.utility?.bookingSuspended || {};
    const isSuspended = Boolean(bookingSettings.enabled);

    const { View } = useLottie({
        animationData: ErrorCallendar,
        loop: true,
        autoplay: true,
    });

    return (
        <main className="flex min-h-dvh w-full items-center justify-center bg-surface px-6 py-10 font-sans md:px-12 lg:px-16">
            <section className="w-full max-w-3xl text-center items-center mx-auto">
                {/* ADDED 'mx-auto' HERE */}
                <div className="relative mx-auto flex h-48 w-48 items-center justify-center sm:h-55 sm:w-55">
                    <div className="absolute inset-0 rounded-full bg-primary/40 blur-3xl" />

                    <div className="relative z-10 h-full w-full">
                        {View}
                    </div>
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-primary">Booking status</p>
                <h1 id="booking-suspension-title" className="mt-3 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
                    Booking Suspended
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant md:text-base">
                    New climb reservations are temporarily unavailable.
                </p>

                {bookingSettings.reopenNote && (
                    <p className="mx-auto mt-4 max-w-2xl px-4 py-3 text-sm font-medium text-on-surface">
                        {bookingSettings.reopenNote}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                    <>
                        <Link
                            to="/"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-on-secondary transition-colors hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            Back to home
                        </Link>
                    </>

                </div>
            </section>
        </main>
    );
}
