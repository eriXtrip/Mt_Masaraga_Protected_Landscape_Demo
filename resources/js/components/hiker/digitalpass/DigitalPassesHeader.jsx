import React from 'react';

export default function DigitalPassesHeader() {
    return (
        <header>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Digital Passes</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-2">My Digital Passes</h1>
            <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl">
                Present these passes at the jump-off point for verification on your climb date.
            </p>
        </header>
    );
}
