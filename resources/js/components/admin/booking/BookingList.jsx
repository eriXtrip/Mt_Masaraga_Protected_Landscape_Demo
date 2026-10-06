import { Wallet, CalendarClock, Users, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusPill from './StatusPill';
import { getInitials, formatter } from './bookingUtils';

function BookingCard({ booking, onSelect }) {
    const hikerNames = booking.hikers?.map((hiker) => hiker.fullName).filter(Boolean) || [];

    return (
        <button
            type="button"
            onClick={() => onSelect(booking)}
            className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:px-6 cursor-pointer"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {getInitials(hikerNames.length > 0 ? hikerNames[0] : booking.leadHiker)}
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="truncate text-sm font-bold text-on-surface">
                        {hikerNames.length > 0 ? hikerNames.join(', ') : booking.leadHiker}
                    </p>
                    {booking.hikers?.some((hiker) => hiker.emergencyContact) && (
                        <p className="mt-1 text-xs text-on-surface-variant">
                            Emergency contacts available
                        </p>
                    )}
                    <span className="hidden text-xs font-medium text-on-surface-variant sm:inline">
                        · {booking.reference}
                    </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{booking.trail}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {booking.participants} pax
                    </span>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-xs text-on-surface-variant">{booking.paymentMethod}</p>
                    <p className="text-sm font-bold text-on-surface">{formatter.format(booking.totalPaid)}</p>
                </div>
                <StatusPill status={booking.status} />
                <ChevronRight className="h-4 w-4 text-outline" />
            </div>
        </button>
    );
}

function EmptyState({ hasAnyBookings, onClearFilters }) {
    return (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-14 text-center shadow-xs">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
                <Wallet className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-sm font-bold text-on-surface">
                {hasAnyBookings ? 'No bookings match your filters' : 'No bookings yet'}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-on-surface-variant">
                {hasAnyBookings
                    ? 'Try a different search term or status filter to find what you are looking for.'
                    : 'New permit applications appear here as soon as a hiker submits one.'}
            </p>
            {hasAnyBookings && (
                <Button variant="outline" size="lg" className="mt-5 h-11! cursor-pointer" onClick={onClearFilters}>
                    Clear filters
                </Button>
            )}
        </div>
    );
}

export default function BookingList({
    bookings,
    onSelect,
    hasAnyBookings,
    onClearFilters,
    resultCount,
    totalCount,
}) {
    if (bookings.length === 0) {
        return <EmptyState hasAnyBookings={hasAnyBookings} onClearFilters={onClearFilters} />;
    }

    return (
        <div className="space-y-4">
            {/* Result Count Indicator */}
            <p className="text-xs text-on-surface-variant whitespace-nowrap">
                Showing <strong className="text-on-surface font-bold">{resultCount ?? bookings.length}</strong> of {totalCount ?? bookings.length} bookings
            </p>

            {/* 1 Column for Small screens, 2 Columns for Medium+ screens */}
            <div className="grid grid-cols-1 gap-1 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-xs">
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}