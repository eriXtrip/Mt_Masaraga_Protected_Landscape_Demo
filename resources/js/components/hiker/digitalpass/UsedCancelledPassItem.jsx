import React from 'react';
import { Ticket } from 'lucide-react';
import { StatusPill } from './helpers.jsx';

export default function UsedCancelledPassItem({ pass }) {
    return (
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-4">
                <span className="h-9 w-9 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                    <Ticket className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{pass.hikerName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        {pass.trail} &middot; {pass.hikeDate}
                    </p>
                </div>
            </div>
            <StatusPill status={pass.status} />
        </div>
    );
}
