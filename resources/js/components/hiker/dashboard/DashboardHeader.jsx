import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function DashboardHeader({ firstName, hasUpcomingClimb }) {
    const navigate = useNavigate();

    return (
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    Hiker Dashboard
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-2">
                    Welcome back, {firstName}
                </h1>
                <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl">
                    Your next climb and the protected area updates that matter to it.
                </p>
            </div>
            {hasUpcomingClimb && (
                <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 cursor-pointer shrink-0"
                    onClick={() => navigate('/hiker/transactions')}
                >
                    <Wallet className="h-4 w-4" />
                    Manage Bookings
                </Button>
            )}
        </header>
    );
}
