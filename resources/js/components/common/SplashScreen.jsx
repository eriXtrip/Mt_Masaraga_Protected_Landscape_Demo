import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import HERO_IMAGE from '../../../../public/images/home/MtMasaraga.jpg';

export default function SplashScreen({ onComplete }) {
    const [bgLoaded, setBgLoaded] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        // Step 1: Immediately trigger background zoom & overlay entrance
        const bgTimer = setTimeout(() => {
            setBgLoaded(true);
        }, 100);

        // Step 2: Delay logo & content entrance by 600ms so background is seen first
        const contentTimer = setTimeout(() => {
            setContentLoaded(true);
        }, 600);

        // Step 3: Hold full splash screen visible until 5.5s mark
        const leaveTimer = setTimeout(() => {
            setIsLeaving(true);
        }, 5300);

        // Step 4: Fade-out transition completes at 6.7s mark before unmounting
        const completeTimer = setTimeout(() => {
            if (onCompleteRef.current) {
                onCompleteRef.current();
            }
        }, 6000);

        return () => {
            clearTimeout(bgTimer);
            clearTimeout(contentTimer);
            clearTimeout(leaveTimer);
            clearTimeout(completeTimer);
        };
    }, []);

    return createPortal(
        <div
            translate="no"
            className={`fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-surface-container-highest transition-opacity duration-1200 ease-in-out ${isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Background Image & Scrim Overlay with Cinematic Slow Zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src={HERO_IMAGE}
                    alt="Mt. Masaraga covered in lush green rainforest piercing through morning mist"
                    className={`h-full w-full object-cover object-center transform transition-transform duration-7000 ease-out ${bgLoaded ? 'scale-105' : 'scale-100'
                        }`}
                    style={{ transformOrigin: 'center center' }}
                />
                <div
                    className={`absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/30 transition-opacity duration-1000 ease-out ${bgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
                <div
                    className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/40 transition-opacity duration-1000 ease-out ${bgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            </div>

            {/* Logo and Content with Delayed Staggered Entrance */}
            <div
                className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-1200 ease-out ${contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <img
                    src="/assets/logo/MT. MASARAGA Logo Center.svg"
                    alt="Mt. Masaraga Protected Landscape"
                    className="h-44 w-auto object-contain lg:h-64 drop-shadow-xl"
                />
                <p className="text-white/85 font-medium tracking-[0.25em] uppercase text-xs lg:text-sm mt-3 drop-shadow-md">
                    Eco-Tourism Portal
                </p>
            </div>
        </div>,
        document.body
    );
}