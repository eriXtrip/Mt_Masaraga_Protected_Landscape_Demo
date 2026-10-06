import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function TransactionHeader() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Bookings</p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mt-2">
                    Transaction History
                </h1>
                <p className="text-sm md:text-base text-on-surface-variant mt-2">
                    View and manage your booking permits, receipts, and e-passes.
                </p>
            </div>
            <Button
                variant="ghost"
                onClick={() => navigate('/hiker/dashboard')}
                className="gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface shrink-0 self-start md:self-auto"
            >
                <LayoutDashboard className="h-4 w-4" />
                Back to Dashboard
            </Button>
        </div>
    );
}
