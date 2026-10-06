import { CalendarCheck, BadgeCheck, Wallet, CircleOff } from 'lucide-react';
import KeyFigures from '../dashboard/KeyFigures';
import { formatter } from './bookingUtils';

export default function BookingSummary({ bookings, quota }) {
    const pending = bookings.filter((b) => b.status === 'Upcoming').length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    const revenueCollected = bookings
        .filter((b) => b.status === 'Confirmed' || b.status === 'Completed')
        .reduce((sum, b) => sum + b.totalPaid, 0);
    const closedOut = bookings.filter((b) => b.status === 'Cancelled' || b.status === 'Refunded').length;

    const paymentSplit = bookings
        .filter((b) => b.status === 'Confirmed' || b.status === 'Completed')
        .reduce((groups, b) => {
            groups[b.paymentMethod] = (groups[b.paymentMethod] || 0) + b.totalPaid;
            return groups;
        }, {});
    const paymentSub = Object.entries(paymentSplit)
        .map(([method, amount]) => `${method} ${formatter.format(amount)}`)
        .join(' · ') || 'No payments received';

    const bookedSlots = quota.reduce((sum, q) => sum + q.booked, 0);
    const quotaPct = quota.length
        ? Math.round((bookedSlots / quota.reduce((sum, q) => sum + q.capacity, 0)) * 100)
        : 0;

    const kpis = [
        {
            icon: CalendarCheck,
            value: String(pending),
            label: 'Upcoming hikes',
            sub: pending ? 'Ready to be hiked' : 'No upcoming hikes',
        },
        {
            icon: BadgeCheck,
            value: String(confirmed),
            label: 'Confirmed',
            sub: 'Ready for the next hike day',
        },
        {
            icon: Wallet,
            value: formatter.format(revenueCollected),
            label: 'Revenue collected',
            sub: paymentSub,
        },
        {
            icon: CircleOff,
            value: String(closedOut),
            label: 'Closed out',
            sub: quotaPct ? `Quota ${quotaPct}% used this hike day` : 'No quota set',
        },
    ];

    return <KeyFigures kpis={kpis} />;
}