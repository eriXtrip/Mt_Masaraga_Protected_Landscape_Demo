import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, Check, ClipboardCheck, MapPin, Search, UsersRound } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Input } from '@/components/ui/input';
import { toast } from '../../components/ui/toast';
import { getBookingDocuments, setBookingStatus, useStaffStore } from '../../state/staffStore';
import StaffBookingDetail from '../../components/staff/StaffBookingDetail';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffMetricCard from '../../components/staff/StaffMetricCard';
import StaffPageHeader from '../../components/staff/StaffPageHeader';
import StaffStatusBadge from '../../components/staff/StaffStatusBadge';

const STATUS_OPTIONS = ['All', 'Upcoming', 'Pending', 'Confirmed', 'Completed', 'Rejected', 'Cancelled'];

export default function StaffBookings() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { assignedBookings, assignedSchedules, documentStatuses } = useStaffStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const selectedId = searchParams.get('booking');

    const filteredBookings = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return assignedBookings.filter((booking) => {
            const matchesSearch = !term || [booking.guideHiker, booking.reference, booking.trail, ...(booking.hikers || []).map((hiker) => hiker.fullName)].some((value) => value?.toLowerCase().includes(term));
            const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [assignedBookings, searchTerm, statusFilter]);

    const selectedBooking = selectedId ? assignedBookings.find((booking) => booking.id === selectedId) : null;
    const selectedSchedule = selectedBooking ? assignedSchedules.find((schedule) => schedule.id === selectedBooking.scheduleId) : null;
    const pendingCount = assignedBookings.filter((booking) => booking.status === 'Upcoming' || booking.status === 'Pending').length;
    const confirmedCount = assignedBookings.filter((booking) => booking.status === 'Confirmed').length;
    const missingDocumentCount = assignedBookings.reduce((total, booking) => total + getBookingDocuments(booking, documentStatuses).filter((document) => document.status !== 'Complete').length, 0);

    const selectBooking = (booking) => {
        setSearchParams({ booking: booking.id }, { replace: true });
    };

    const closeDetail = () => {
        setSearchParams({}, { replace: true });
    };

    const approveBooking = () => {
        if (!selectedBooking) return;
        setBookingStatus(selectedBooking.id, 'Confirmed');
        toast.add({ type: 'success', title: 'Permit approved', description: `${selectedBooking.reference} is confirmed for its assigned climb.` });
    };

    const rejectBooking = () => {
        if (!selectedBooking) return;
        setBookingStatus(selectedBooking.id, 'Rejected');
        toast.add({ type: 'success', title: 'Permit rejected', description: `${selectedBooking.reference} was marked as rejected.` });
    };

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <StaffPageHeader
                        eyebrow="Park staff · Permit desk"
                        title="Permit bookings"
                        description="Review only the applications attached to your guide assignments. Approve a group after checking its roster and document checklist, or reject it when the record is not ready for jump-off."
                    >
                        <Link to="/staff/verify" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ClipboardCheck className="h-4 w-4" />Open verification desk</Link>
                    </StaffPageHeader>
                </div>

                <section style={{ transitionDelay: '150ms' }} aria-label="Booking summary" className={`grid grid-cols-1 gap-3 transition-all duration-700 ease-out sm:grid-cols-3 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <StaffMetricCard icon={CalendarDays} value={pendingCount} label="Needs decision" detail="Upcoming or pending permits" tone="amber" />
                    <StaffMetricCard icon={Check} value={confirmedCount} label="Confirmed" detail="Groups cleared for jump-off" tone="teal" />
                    <StaffMetricCard icon={UsersRound} value={missingDocumentCount} label="Document follow-ups" detail="Checklist items not complete" tone={missingDocumentCount > 0 ? 'amber' : 'primary'} />
                </section>

                <section style={{ transitionDelay: '250ms' }} aria-label="Booking filters" className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-xs transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search lead hiker, reference, or trail" aria-label="Search permit bookings" className="min-h-11 pl-9" />
                        </div>
                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter bookings by status" className="min-h-11 rounded-lg border border-outline-variant bg-surface px-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
                            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </section>

                <div style={{ transitionDelay: '350ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    {filteredBookings.length > 0 ? (
                        <section aria-label="Permit booking results" className="space-y-3">
                            <p className="text-xs text-on-surface-variant">Showing <strong className="text-on-surface">{filteredBookings.length}</strong> of {assignedBookings.length} assigned bookings</p>
                            <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xs">
                                {filteredBookings.map((booking) => {
                                    const documents = getBookingDocuments(booking, documentStatuses);
                                    const completeDocuments = documents.filter((document) => document.status === 'Complete').length;
                                    return (
                                        <button key={booking.id} type="button" onClick={() => selectBooking(booking)} className="flex min-h-11 w-full flex-col gap-4 border-b border-outline-variant/20 p-4 text-left transition-colors last:border-b-0 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:flex-row md:items-center md:px-5">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{booking.guideHiker.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="truncate text-sm font-bold text-on-surface">{booking.guideHiker}</span>
                                                    <span className="text-xs text-on-surface-variant">{booking.reference}</span>
                                                </span>
                                                <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                                                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{booking.trail}</span>
                                                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{booking.date}</span>
                                                    <span className="inline-flex items-center gap-1"><UsersRound className="h-3.5 w-3.5" />{booking.participants} hikers</span>
                                                </span>
                                            </span>
                                            <span className="flex flex-wrap items-center gap-2 md:shrink-0">
                                                <span className="text-xs text-on-surface-variant">{completeDocuments}/{documents.length} documents</span>
                                                <StaffStatusBadge status={booking.status} />
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ) : (
                        <StaffEmptyState icon={Search} title="No bookings match these filters" description="Try another hiker name, reference, trail, or status. Only permits assigned to your duty are shown." action={<button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Clear filters</button>} />
                    )}
                </div>

            </div>

            {selectedBooking && (
                <StaffBookingDetail
                    booking={selectedBooking}
                    schedule={selectedSchedule}
                    documentStatuses={documentStatuses[selectedBooking.id] || {}}
                    onClose={closeDetail}
                    onApprove={approveBooking}
                    onReject={rejectBooking}
                />
            )}
        </>
    );
}
