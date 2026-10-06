import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ClipboardCheck, FileCheck2, ScanLine, Search, Undo2, UsersRound } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HikerTicketPass from '../../components/features/HikerTicketPass';
import PassScannerModal from '../../components/common/PassScannerModal';
import { toast } from '../../components/ui/toast';
import { getPassIdentifier } from '../../lib/passScanner';
import {
    checkInPass,
    getBookingDocuments,
    undoCheckIn,
    updateDocumentStatus,
    useStaffStore,
} from '../../state/staffStore';
import StaffDocumentChecklist from '../../components/staff/StaffDocumentChecklist';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffPageHeader from '../../components/staff/StaffPageHeader';
import StaffStatusBadge from '../../components/staff/StaffStatusBadge';

const formatCheckInTime = (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
};

const DEFAULT_PASS_DELAY_MS = 10 * 1000;

export default function StaffVerify() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { assignedBookings, checkIns, documentStatuses, passes } = useStaffStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPassId, setSelectedPassId] = useState(searchParams.get('pass'));
    const searchInputRef = useRef(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const passesRef = useRef(passes);
    passesRef.current = passes;
    const selectedPassIdRef = useRef(selectedPassId);
    selectedPassIdRef.current = selectedPassId;

    useEffect(() => {
        const bookingId = searchParams.get('booking');
        const scheduleId = searchParams.get('schedule');
        const requestedPass = passes.find((pass) => pass.id === searchParams.get('pass'));
        const bookingPass = bookingId ? passes.find((pass) => pass.bookingId === bookingId) : null;
        const schedulePass = scheduleId ? passes.find((pass) => pass.scheduleId === scheduleId) : null;
        const nextPass = requestedPass || bookingPass || schedulePass;
        if (nextPass) setSelectedPassId(nextPass.id);
    }, [passes, searchParams]);

    const selectedPass = passes.find((pass) => pass.id === selectedPassId) || null;
    const selectedBooking = selectedPass ? assignedBookings.find((booking) => booking.id === selectedPass.bookingId) : null;
    const documents = selectedBooking ? getBookingDocuments(selectedBooking, documentStatuses) : [];
    const completeDocuments = documents.filter((document) => document.status === 'Complete').length;
    const selectedCheckIn = selectedPass ? checkIns[selectedPass.id] : null;

    const passResults = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const source = term
            ? passes.filter((pass) => [pass.id, pass.reference, pass.hikerName, pass.trail].some((value) => value?.toLowerCase().includes(term)))
            : passes;
        return source.slice(0, 12);
    }, [passes, searchTerm]);

    const selectPass = useCallback((pass) => {
        setSelectedPassId(pass.id);
        setSearchParams({ pass: pass.id });
    }, [setSearchParams]);

    const openScanner = useCallback(() => {
        setIsScannerOpen(true);
    }, []);

    const handleScannedValue = useCallback((rawValue) => {
        const identifier = getPassIdentifier(rawValue);
        const scannedPass = identifier
            ? passesRef.current.find((pass) => pass.id === identifier || identifier.endsWith(pass.id))
            : null;

        if (!scannedPass) {
            toast.add({ type: 'error', title: 'Pass not found', description: 'That QR code is not assigned to a pass in your duty.' });
            return;
        }

        setIsScannerOpen(false);
        selectPass(scannedPass);
        toast.add({ type: 'success', title: 'Pass scanned', description: `${scannedPass.hikerName} is ready for jump-off verification.` });
    }, [selectPass]);

    // A kiosk tablet often has no usable camera, so after 10s with no accepted scan the
    // first assigned pass is shown, named in a toast, and the scanner closes itself.
    useEffect(() => {
        if (!isScannerOpen) return undefined;

        const timerId = window.setTimeout(() => {
            const fallbackPass = passesRef.current[0];

            if (fallbackPass && fallbackPass.id !== selectedPassIdRef.current) {
                selectPass(fallbackPass);
                toast.add({ type: 'warning', title: 'No QR code scanned', description: `Closed after 10s. Showing ${fallbackPass.hikerName}, the first pass in your duty.` });
            } else {
                toast.add({ type: 'warning', title: 'No QR code scanned', description: 'The scanner closed after 10s. Scan again or look the pass up by ID.' });
            }

            setIsScannerOpen(false);
        }, DEFAULT_PASS_DELAY_MS);

        return () => window.clearTimeout(timerId);
    }, [isScannerOpen, selectPass]);

    const handleLookup = (event) => {
        event.preventDefault();
        const term = searchTerm.trim().toLowerCase();
        const match = passes.find((pass) => [pass.id, pass.reference, pass.hikerName, pass.trail].some((value) => value?.toLowerCase() === term))
            || passes.find((pass) => [pass.id, pass.reference, pass.hikerName, pass.trail].some((value) => value?.toLowerCase().includes(term)));
        if (match) {
            selectPass(match);
        } else {
            toast.add({ type: 'error', title: 'Pass not found', description: 'Search by the pass ID, booking reference, hiker name, or assigned trail.' });
        }
    };

    const handleCheckIn = () => {
        if (!selectedPass) return;
        if (selectedCheckIn) {
            undoCheckIn(selectedPass.id);
            toast.add({ type: 'success', title: 'Check-in removed', description: `${selectedPass.hikerName} is pending again.` });
        } else {
            checkInPass(selectedPass.id);
            toast.add({ type: 'success', title: 'Hiker checked in', description: `${selectedPass.hikerName} is cleared for jump-off.` });
        }
    };

    const handleDocumentChange = (documentId, status) => {
        if (!selectedBooking) return;
        updateDocumentStatus(selectedBooking.id, documentId, status);
        toast.add({ type: 'success', title: status === 'Complete' ? 'Document marked complete' : 'Document needs follow-up', description: 'The checklist has been updated for this booking.' });
    };

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <div style={{ transitionDelay: '0ms' }} className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <StaffPageHeader
                        eyebrow="Park staff · Jump-off"
                        title="Pass verification"
                        description="Look up a digital pass, confirm the booking record, and record the physical documents before releasing a hiker to the trail."
                    >
                        <Button type="button" variant="outline" size="lg" onClick={() => searchInputRef.current?.focus()} className="min-h-11 cursor-pointer gap-2">
                            <Search className="h-4 w-4" />
                            Focus lookup
                        </Button>
                    </StaffPageHeader>
                </div>

                <section style={{ transitionDelay: '150ms' }} aria-labelledby="pass-lookup-heading" className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs transition-all duration-700 ease-out md:p-6 ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Jump-off desk</p>
                            <h2 id="pass-lookup-heading" className="mt-1 text-lg font-bold text-on-surface">Find a pass</h2>
                            <p className="mt-1 text-sm text-on-surface-variant">Use the pass ID, booking reference, hiker name, or trail.</p>
                        </div>
                        <form onSubmit={handleLookup} className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:max-w-xl">
                            <div className="relative min-w-0">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                                <Input ref={searchInputRef} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="MMPL-2026-1024-1 or TXN-2026-1024" aria-label="Search pass or booking" className="min-h-11 pl-9" />
                            </div>
                            <Button type="button" variant="outline" size="lg" onClick={openScanner} className="min-h-11 cursor-pointer gap-2"><ScanLine className="h-4 w-4" />Scan QR</Button>
                            <Button type="submit" size="lg" className="min-h-11 cursor-pointer gap-2"><Search className="h-4 w-4" />Find pass</Button>
                        </form>
                    </div>
                </section>

                <div style={{ transitionDelay: '250ms' }} className={`grid gap-6 transition-all duration-700 ease-out xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <section aria-labelledby="assigned-passes-heading" className="min-w-0 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Assigned records</p>
                                <h2 id="assigned-passes-heading" className="mt-1 text-lg font-bold text-on-surface">Passes in your duty</h2>
                            </div>
                            <span className="text-xs font-semibold text-on-surface-variant">{passes.length} records</span>
                        </div>
                        <div className="mt-4 max-h-[30rem] space-y-2 overflow-y-auto pr-1">
                            {passResults.length > 0 ? passResults.map((pass) => {
                                const isSelected = selectedPassId === pass.id;
                                const isCheckedIn = Boolean(checkIns[pass.id]);
                                return (
                                    <button
                                        key={pass.id}
                                        type="button"
                                        onClick={() => selectPass(pass)}
                                        aria-pressed={isSelected}
                                        className={`flex min-h-11 w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected ? 'border-primary/40 bg-primary/10' : 'border-outline-variant/30 hover:bg-surface-container-low'}`}
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-xs font-bold text-on-surface-variant">{pass.hikerName?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-bold text-on-surface">{pass.hikerName}</span>
                                            <span className="mt-0.5 block truncate text-xs text-on-surface-variant">{pass.id} · {pass.reference}</span>
                                        </span>
                                        <StaffStatusBadge status={isCheckedIn ? 'Checked in' : 'Pending check-in'} />
                                    </button>
                                );
                            }) : (
                                <StaffEmptyState icon={Search} title="No matching passes" description="Try a different pass ID, booking reference, hiker name, or trail." />
                            )}
                        </div>
                    </section>

                    {selectedPass && selectedBooking ? (
                        <div className="min-w-0 space-y-6">
                            <section aria-labelledby="selected-pass-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Selected pass</p>
                                        <h2 id="selected-pass-heading" className="mt-1 text-lg font-bold text-on-surface">{selectedPass.hikerName}</h2>
                                        <p className="mt-1 text-sm text-on-surface-variant">{selectedPass.trail} · {selectedPass.date}</p>
                                    </div>
                                    <StaffStatusBadge status={selectedCheckIn ? 'Checked in' : 'Pending check-in'} />
                                </div>
                                <div className="relative mt-5 z-10 w-full flex justify-center items-center overflow-hidden p-2">
                                    <div className="transform origin-top scale-[0.68] min-[380px]:scale-[0.72] min-[480px]:scale-[0.80] sm:scale-[0.90] lg:scale-100 transition-transform duration-200 -mb-27.5 min-[380px]:-mb-20 min-[480px]:-mb-12.5 sm:-mb-6.25 lg:mb-0">
                                        <HikerTicketPass currentPass={selectedPass} />
                                    </div>
                                </div>
                                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-outline-variant/20 pt-4">
                                    <Button type="button" size="lg" onClick={handleCheckIn} className="min-h-11 cursor-pointer gap-2">
                                        {selectedCheckIn ? <Undo2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                        {selectedCheckIn ? 'Undo check-in' : 'Mark jump-off check-in'}
                                    </Button>
                                    {selectedCheckIn && <span className="text-xs text-on-surface-variant">Checked in at {formatCheckInTime(selectedCheckIn.checkedInAt)} by {selectedCheckIn.checkedInBy}</span>}
                                </div>
                            </section>

                            <section aria-labelledby="document-check-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Physical documents</p>
                                        <h2 id="document-check-heading" className="mt-1 text-lg font-bold text-on-surface">Checklist for {selectedBooking.leadHiker}</h2>
                                        <p className="mt-1 text-sm text-on-surface-variant">{completeDocuments} of {documents.length} items complete.</p>
                                    </div>
                                    <FileCheck2 className="h-6 w-6 text-primary" />
                                </div>
                                <div className="mt-5">
                                    <StaffDocumentChecklist statuses={Object.fromEntries(documents.map((document) => [document.id, { status: document.status }]))} onChange={handleDocumentChange} compact />
                                </div>
                            </section>

                            <section aria-labelledby="selected-booking-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UsersRound className="h-5 w-5" /></span>
                                    <div>
                                        <h2 id="selected-booking-heading" className="text-base font-bold text-on-surface">Booking {selectedBooking.reference}</h2>
                                        <p className="mt-1 text-xs text-on-surface-variant">{selectedBooking.participants} hikers · {selectedBooking.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link to={`/staff/groups/${selectedPass.scheduleId}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-3 text-xs font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open group roster</Link>
                                    <Link to={`/staff/bookings?booking=${encodeURIComponent(selectedBooking.id)}`} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-outline-variant px-3 text-xs font-semibold text-on-surface hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Review permit</Link>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <StaffEmptyState icon={ClipboardCheck} title="Select a pass to begin" description="Choose an assigned pass from the list or search for a pass ID to review the ticket, documents, and check-in state." />
                    )}
                </div>
            </div>

            <PassScannerModal
                open={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScannedValue}
            />
        </>
    );
}
