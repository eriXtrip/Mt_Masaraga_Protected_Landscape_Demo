import { RotateCcw, ArrowRight } from 'lucide-react';
import { formatter, getInitials } from '../booking/bookingUtils';

export default function RefundLog({ bookings }) {
    const refunded = bookings.filter((b) => b.status === 'Refunded');

    return (
        <section aria-labelledby="refund-heading" className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
            <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-6">
                <div className="flex items-center gap-2">
                    <p id="refund-heading" className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                        Refund log
                    </p>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                        {refunded.length}
                    </span>
                </div>
            </div>

            {refunded.length > 0 ? (
                <div className="divide-y divide-outline-variant/20">
                    {refunded.map((booking) => {
                        const processingFee = booking.feeBreakdown?.find((f) => f.label === 'Processing fee')?.amount ?? 50;
                        const refundAmount = booking.totalPaid - processingFee;

                        return (
                            <div
                                key={booking.id}
                                className="flex items-center gap-4 px-5 py-4 md:px-6"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-700">
                                    {getInitials(booking.leadHiker)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-on-surface">{booking.leadHiker}</p>
                                    <p className="truncate text-xs text-on-surface-variant">
                                        {booking.trail} · {booking.date} · {booking.reference}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3 text-right">
                                    <div>
                                        <p className="text-xs text-red-600 font-semibold">
                                            -{formatter.format(refundAmount)}
                                        </p>
                                        <p className="text-[11px] text-on-surface-variant">
                                            Processing fee {formatter.format(processingFee)} retained
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-outline" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="px-5 py-10 text-center md:px-6">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant">
                        <RotateCcw className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-on-surface">No refunds issued</p>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-on-surface-variant">
                        Refunded transactions will appear here with the refunded amount and fee details.
                    </p>
                </div>
            )}
        </section>
    );
}
