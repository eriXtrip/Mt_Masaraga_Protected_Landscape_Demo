import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText, Ticket } from 'lucide-react';
import { getInitials } from './SectionCard';

export default function ProfileSidebar({ name, email, transactionCount, activePassCount }) {
    const navigate = useNavigate();

    return (
        <aside className="lg:sticky lg:top-20 space-y-4">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 text-center shadow-sm">
                <span className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="text-2xl font-bold">{getInitials(name)}</span>
                </span>
                <h2 className="text-lg font-bold text-on-surface mt-4">{name || 'Hiker'}</h2>
                <p className="text-sm text-on-surface-variant break-all">{email || 'No email set'}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Hiker
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/hiker/transactions')}
                    className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 text-left shadow-xs transition-all hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
                >
                    <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <ScrollText className="h-4 w-4" />
                    </span>
                    <p className="text-xl font-bold text-on-surface mt-3">{transactionCount}</p>
                    <p className="text-xs text-on-surface-variant">Bookings</p>
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/hiker/passes')}
                    className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 text-left shadow-xs transition-all hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
                >
                    <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Ticket className="h-4 w-4" />
                    </span>
                    <p className="text-xl font-bold text-on-surface mt-3">{activePassCount}</p>
                    <p className="text-xs text-on-surface-variant">Active passes</p>
                </button>
            </div>
        </aside>
    );
}
