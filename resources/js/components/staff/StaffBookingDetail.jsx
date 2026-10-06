import { CalendarDays, Check, FileCheck2, MapPin, ShieldCheck, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BookingModal from '../admin/booking/BookingModal';
import { getInitials, formatter } from '../admin/booking/bookingUtils';
import StaffDocumentChecklist from './StaffDocumentChecklist';
import StaffStatusBadge from './StaffStatusBadge';

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-on-surface-variant">{label}</span>
            <span className="ml-auto text-right font-semibold text-on-surface">{value}</span>
        </div>
    );
}

export default function StaffBookingDetail({ booking, schedule, documentStatuses = {}, onClose, onApprove, onReject }) {
    const canDecide = booking.status === 'Upcoming' || booking.status === 'Pending';

    return (
        <>
            <div className="fixed inset-0 z-30 bg-inverse-surface/50" onClick={onClose} aria-hidden="true" />
            <BookingModal
                title="Permit review"
                subtitle={`${booking.reference} · ${booking.leadHiker}`}
                onClose={onClose}
                side="right"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-low/50 p-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {getInitials(booking.leadHiker)}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-on-surface">{booking.leadHiker}</p>
                            <p className="truncate text-xs text-on-surface-variant">{booking.contact}</p>
                        </div>
                        <StaffStatusBadge status={booking.status} />
                    </div>

                    <section aria-labelledby="staff-booking-climb">
                        <h3 id="staff-booking-climb" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Climb assignment</h3>
                        <div className="mt-3 space-y-2 rounded-2xl border border-outline-variant/40 p-4">
                            <DetailRow icon={MapPin} label="Trail" value={booking.trail} />
                            <DetailRow icon={CalendarDays} label="Date" value={booking.date} />
                            <DetailRow icon={Users} label="Group size" value={`${booking.participants} hikers`} />
                            <DetailRow icon={ShieldCheck} label="Assigned guide" value={schedule?.guide || booking.guide || 'Not assigned'} />
                        </div>
                    </section>

                    <section aria-labelledby="staff-booking-roster">
                        <h3 id="staff-booking-roster" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Lead hiker and members</h3>
                        <div className="mt-3 space-y-2">
                            {(booking.hikers || []).map((hiker, index) => (
                                <div key={`${hiker.fullName}-${index}`} className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant">
                                        {getInitials(hiker.fullName)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-on-surface">{hiker.fullName}</p>
                                        <p className="truncate text-xs text-on-surface-variant">{index === 0 ? 'Lead hiker' : 'Group member'}</p>
                                    </div>
                                    {hiker.emergencyContact && <span className="text-[10px] font-semibold text-on-surface-variant">Emergency contact on file</span>}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="staff-booking-documents">
                        <div className="flex items-center justify-between gap-3">
                            <h3 id="staff-booking-documents" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Submitted checklist</h3>
                            <Link
                                to={`/staff/verify?booking=${encodeURIComponent(booking.id)}`}
                                onClick={onClose}
                                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <FileCheck2 className="h-4 w-4" />
                                Verify at jump-off
                            </Link>
                        </div>
                        <div className="mt-3">
                            <StaffDocumentChecklist statuses={documentStatuses} readOnly />
                        </div>
                    </section>

                    <section aria-labelledby="staff-booking-payment">
                        <h3 id="staff-booking-payment" className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Payment record</h3>
                        <div className="mt-3 rounded-2xl border border-outline-variant/40 p-4">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-on-surface-variant">{booking.paymentMethod}</span>
                                <span className="font-bold text-on-surface">{formatter.format(booking.totalPaid)}</span>
                            </div>
                            <p className="mt-2 text-xs text-on-surface-variant">Reference {booking.reference}. Payment status is recorded by the admin console.</p>
                        </div>
                    </section>
                </div>

                {canDecide && (
                    <div className="sticky bottom-0 mt-6 grid gap-3 border-t border-outline-variant/20 bg-surface-container-lowest pt-4 pb-[env(safe-area-inset-bottom)] sm:grid-cols-2">
                        <Button type="button" variant="destructive" size="lg" onClick={onReject} className="min-h-11 cursor-pointer gap-2">
                            <X className="h-4 w-4" />
                            Reject permit
                        </Button>
                        <Button type="button" size="lg" onClick={onApprove} className="min-h-11 cursor-pointer gap-2">
                            <Check className="h-4 w-4" />
                            Approve permit
                        </Button>
                    </div>
                )}
            </BookingModal>
        </>
    );
}
