import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
    Upcoming: { label: 'Upcoming', text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    Confirmed: { label: 'Confirmed', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    Completed: { label: 'Completed', text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' },
};

const getInitials = (name) => {
    if (!name) return 'H';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, text: 'text-on-surface-variant', bg: 'bg-surface-container-high', dot: 'bg-on-surface-variant/40' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

export default function UpcomingBookings({ bookings }) {
    const navigate = useNavigate();

    const upcoming = bookings.filter((b) => b.status === 'Upcoming');

    return (
        <section aria-labelledby="upcoming-heading" className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
            <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
                <div className="flex items-center gap-2">
                    <p id="upcoming-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Upcoming bookings
                    </p>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {upcoming.length}
                    </span>
                </div>
                <Link
                    to="/admin/bookings"
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    View all
                </Link>
            </div>

            {upcoming.length > 0 ? (
                <div className="divide-y divide-outline-variant/20">
                    {upcoming.map((booking) => (
                        <Link
                            key={booking.id}
                            to="/admin/bookings"
                            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:px-6"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface">
                                {getInitials(booking.leadHiker)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-on-surface">{booking.leadHiker}</p>
                                <p className="truncate text-xs text-on-surface-variant">
                                    {booking.trail} · {booking.date} · {booking.participants} pax
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                <span className="hidden text-xs font-medium text-on-surface-variant sm:inline">
                                    {booking.reference}
                                </span>
                                <StatusPill status={booking.status} />
                                <ChevronRight className="h-4 w-4 text-outline" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="px-5 py-10 text-center md:px-6">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <CalendarCheck className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-on-surface">No upcoming bookings</p>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-on-surface-variant">
                        Confirmed climb schedules will appear here as hikers complete their bookings.
                    </p>
                    <Button
                        variant="outline"
                        size="lg"
                        className="mt-5 h-11! cursor-pointer"
                        onClick={() => navigate('/admin/bookings')}
                    >
                        View bookings
                    </Button>
                </div>
            )}
        </section>
    );
}
