import { Wallet, TrendingUp, CreditCard, RotateCcw } from 'lucide-react';
import KeyFigures from '../dashboard/KeyFigures';
import { formatter } from '../booking/bookingUtils';

export default function PaymentSummary({ bookings }) {
    const collected = bookings;
    const totalRevenue = collected.reduce((sum, b) => sum + b.totalPaid, 0);

    const refunded = bookings.filter((b) => b.status === 'Refunded');
    const totalRefunded = refunded.reduce((sum, b) => sum + b.totalPaid, 0);

    const paymentSplit = collected.reduce((groups, b) => {
        groups[b.paymentMethod] = (groups[b.paymentMethod] || 0) + b.totalPaid;
        return groups;
    }, {});

    const topMethod = Object.entries(paymentSplit).sort((a, b) => b[1] - a[1])[0];
    const topMethodLabel = topMethod ? `${topMethod[0]} (${formatter.format(topMethod[1])})` : 'N/A';

    const methodCount = Object.keys(paymentSplit).length;

    const kpis = [
        {
            icon: Wallet,
            value: formatter.format(totalRevenue),
            label: 'Total revenue',
            sub: `${collected.length} collected transaction${collected.length !== 1 ? 's' : ''}`,
        },
        {
            icon: TrendingUp,
            value: topMethodLabel,
            label: 'Top payment method',
            sub: `${methodCount} method${methodCount !== 1 ? 's' : ''} used overall`,
        },
        {
            icon: CreditCard,
            value: String(collected.length),
            label: 'Successful payments',
            sub: formatter.format(collected.length ? totalRevenue / collected.length : 0) + ' avg.',
        },
        {
            icon: RotateCcw,
            value: String(refunded.length),
            label: 'Refunds issued',
            sub: refunded.length ? formatter.format(totalRefunded) + ' returned' : 'No refunds yet',
        },
    ];

    return <KeyFigures kpis={kpis} />;
}
