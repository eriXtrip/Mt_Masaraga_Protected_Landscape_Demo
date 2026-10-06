import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ticket, Calendar, Users, Wallet, MapPin, ChevronRight, Clock3 } from 'lucide-react';
import { StatusPill } from './helpers.jsx';

export default function UpcomingClimbCard({ climb, countdown }) {
    const navigate = useNavigate();

    return (
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-secondary text-on-secondary px-5 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-on-secondary/70" />
                    Upcoming Climb
                </p>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-on-secondary">
                        <Clock3 className="h-3.5 w-3.5" />
                        {countdown}
                    </span>
                    <StatusPill status={climb.status} />
                </div>
            </div>

            <div className="p-5 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-5">
                    <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-on-surface-variant">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                                {climb.transactionId}
                            </span>
                            <span>{climb.referenceNo}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mt-3 flex items-center gap-2.5">
                            <MapPin className="h-6 w-6 text-primary shrink-0" />
                            {climb.trail}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                            <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Calendar className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Climb date</p>
                                <p className="text-sm font-bold text-on-surface truncate">{climb.hikeDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                            <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Participants</p>
                                <p className="text-sm font-bold text-on-surface truncate">{climb.participantCount} {climb.participantCount > 1 ? 'hikers' : 'hiker'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                            <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Wallet className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Amount paid</p>
                                <p className="text-sm font-bold text-on-surface truncate">{climb.totalPaid}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-last items-stretch lg:items-end gap-3 shrink-0">
                    <Button
                        variant="default"
                        size="lg"
                        className="gap-2 cursor-pointer"
                        onClick={() => navigate('/hiker/passes')}
                    >
                        <Ticket className="h-4 w-4" />
                        View e-Passes
                    </Button>
                </div>
            </div>
        </section>
    );
}
