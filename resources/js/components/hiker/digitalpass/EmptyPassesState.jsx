import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';

export default function EmptyPassesState() {
    const navigate = useNavigate();

    return (
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 md:p-12 text-center shadow-sm">
            <span className="h-14 w-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <CalendarCheck className="h-7 w-7" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface mt-5">No passes yet</h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
                Digital passes are issued after you complete a booking and payment.
            </p>
            <Button
                variant="default"
                size="lg"
                className="mt-6 cursor-pointer"
                onClick={() => navigate('/booking')}
            >
                Book a Hike
            </Button>
        </section>
    );
}
