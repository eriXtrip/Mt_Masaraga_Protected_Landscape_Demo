import { useMemo, useState } from 'react';
import { ScanLine, Search } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PassScannerModal from '../../components/common/PassScannerModal';
import BookingConfirmation from '../booking/BookingConfirmation';
import { toast } from '../../components/ui/toast';
import { useAdminStore } from '../../state/adminStore';
import { getBookingPasses } from '../../state/staffStore';
import { getPassIdentifier } from '../../lib/passScanner';

// Mirrors airline "Manage Booking": the PNR is a high-entropy secret, the last name is
// low-entropy, so both are required together before anything personal is revealed.
const normalizeReference = (value) => value.replace(/[\s-]+/g, '').toUpperCase();

const getLastName = (fullName = '') => fullName.trim().split(/\s+/).pop() || '';

// Case-insensitive diacritic-tolerant compare, since the PNR and last name are both
// hand-keyed from a printed pass or email.
const looseEquals = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;

// Adapt a stored booking to the receipt shape BookingConfirmation expects.
const buildReceipt = (booking) => {
    const breakdown = (booking.feeBreakdown || []).map((line) => ({
        label: line.label,
        amount: `₱${Number(line.amount).toFixed(2)}`,
    }));

    const totalPaid = booking.totalPaid ?? breakdown.reduce((sum, line) => sum + Number(line.amount), 0);

    return {
        breakdown: breakdown.length ? breakdown : [{ label: 'Total', amount: `₱${Number(totalPaid).toFixed(2)}` }],
        totalPaid: `₱${Number(totalPaid).toFixed(2)}`,
        paymentMethod: `Paid via ${booking.paymentMethod || 'GCash'}`,
        referenceNo: `Ref: ${booking.reference}`,
    };
};

// The lookup renders the full BookingConfirmation, so access control is the only thing
// standing between a stranger and someone's payment, address, and health answers.
export default function ScheduleLookup() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { bookings } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [referenceInput, setReferenceInput] = useState('');
    const [lastNameInput, setLastNameInput] = useState('');
    const [results, setResults] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [lookupMode, setLookupMode] = useState('credential');

    const switchMode = (mode) => {
        setLookupMode(mode);
        resetLookup();
    };

    const passesByBooking = useMemo(() => {
        const index = new Map();
        getBookingPasses(bookings).forEach((pass) => {
            const entry = index.get(pass.bookingId) || [];
            entry.push(pass);
            index.set(pass.bookingId, entry);
        });
        return index;
    }, [bookings]);

    const findByPassId = (passId) => {
        const wanted = normalizeReference(passId);

        for (const booking of bookings) {
            const pass = (passesByBooking.get(booking.id) || []).find(
                (item) => normalizeReference(item.id) === wanted || wanted.endsWith(normalizeReference(item.id))
            );
            if (pass) {
                return { booking, pass, passes: passesByBooking.get(booking.id) || [] };
            }
        }
        return null;
    };

    // A single input that auto-detects whether it holds a PNR or a pass ID. Used for
    // quick single-field lookups; the PNR + last name form below is the guarded path.
    const findByCredential = (term) => {
        const normalized = term.trim();
        if (!normalized) return [];

        const asReference = normalizeReference(normalized);
        const referenceMatch = bookings.filter(
            (booking) => normalizeReference(booking.reference) === asReference
        );

        if (referenceMatch.length) {
            return referenceMatch.map((booking) => ({ booking, passes: passesByBooking.get(booking.id) || [] }));
        }

        const passMatch = findByPassId(normalizeReference(normalized));
        return passMatch ? [passMatch] : [];
    };

    const resetLookup = () => {
        setResults(null);
    };

    const showResults = (matches) => {
        if (!matches.length) {
            toast.add({ type: 'error', title: 'No climb found', description: 'Check the reference on your confirmation or the Ecotourism Trail ID on your pass.' });
            return;
        }
        setResults(matches);
    };

    const handleLookup = (event) => {
        event.preventDefault();
        const term = searchTerm.trim();
        if (!term) return;
        showResults(findByCredential(term));
    };

    // Two-factor guard: the PNR alone is treated as insufficient, mirroring airline
    // "manage booking". A correct reference paired with the wrong last name gives the
    // same message as an unknown reference, so this cannot be used to probe for valid PNRs.
    const handleReferenceLookup = (event) => {
        event.preventDefault();

        const reference = referenceInput.trim();
        const lastName = lastNameInput.trim();

        if (!reference || !lastName) {
            toast.add({ type: 'error', title: 'Both fields needed', description: 'Enter your booking reference and the last name of any hiker on the booking.' });
            return;
        }

        const booking = bookings.find(
            (item) => normalizeReference(item.reference) === normalizeReference(reference)
        );

        const nameMatches = booking
            && (booking.hikers || []).some((hiker) => looseEquals(getLastName(hiker.fullName), lastName));

        if (!booking || !nameMatches) {
            toast.add({ type: 'error', title: 'No matching booking', description: 'We could not match that reference with that last name. Check both and try again.' });
            return;
        }

        resetLookup();
        setResults([{ booking, passes: passesByBooking.get(booking.id) || [] }]);
        toast.add({ type: 'success', title: 'Booking found', description: `${booking.trail} on ${booking.date}.` });
    };

    const handleScan = (rawValue) => {
        setIsScannerOpen(false);
        const identifier = getPassIdentifier(rawValue);
        if (!identifier) {
            toast.add({ type: 'error', title: 'Pass not recognised', description: 'That QR code did not contain a pass ID.' });
            return;
        }

        const match = findByPassId(identifier);
        if (!match) {
            toast.add({ type: 'error', title: 'Pass not found', description: 'No booked climb matches that pass.' });
            return;
        }

        setSearchTerm('');
        setReferenceInput('');
        setLastNameInput('');
        setResults([match]);
        toast.add({ type: 'success', title: 'Pass scanned', description: 'Your booking is shown below.' });
    };

    const resultCount = results?.length || 0;

    return (
        <div ref={sectionRef} className="bg-surface font-sans">
            <div className={`mx-auto max-w-6xl space-y-6 px-4 py-8 transition-all duration-700 ease-out md:px-8 md:py-12 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                <header className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Mt. Masaraga · Manage your booking</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Find your scheduled climb</h1>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-on-surface-variant md:text-base">
                        Retrieve your booking with the reference from your confirmation and the last name of any
                        hiker on it. Already holding your pass? Scan it instead.
                    </p>
                </header>

                <section aria-labelledby="lookup-heading" className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xs md:p-6">
                    <h2 id="lookup-heading" className="sr-only">Look up a booking</h2>

                    <form onSubmit={handleReferenceLookup} className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
                        <div className="min-w-0">
                            <label htmlFor="lookup-reference" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                Booking Reference (TXN)
                            </label>
                            <Input
                                id="lookup-reference"
                                value={referenceInput}
                                onChange={(event) => { setReferenceInput(event.target.value); resetLookup(); }}
                                placeholder="TXN-2026-0928"
                                autoComplete="off"
                                spellCheck="false"
                                className="min-h-11 font-mono"
                            />
                        </div>

                        <div className="min-w-0">
                            <label htmlFor="lookup-lastname" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                                Last name
                            </label>
                            <Input
                                id="lookup-lastname"
                                value={lastNameInput}
                                onChange={(event) => { setLastNameInput(event.target.value); resetLookup(); }}
                                placeholder="Dela Cruz"
                                autoComplete="off"
                                className="min-h-11"
                            />
                        </div>

                        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => setIsScannerOpen(true)}
                                className="min-h-11 flex-1 cursor-pointer gap-2 sm:flex-none lg:flex-1"
                            >
                                <ScanLine className="h-4 w-4" />
                                <span className="truncate">Scan pass</span>
                            </Button>

                            <Button
                                type="submit"
                                size="lg"
                                className="min-h-11 flex-1 cursor-pointer gap-2 sm:flex-none lg:flex-1"
                            >
                                <Search className="h-4 w-4" />
                                <span className="truncate">Retrieve</span>
                            </Button>
                        </div>
                    </form>

                    <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                        Your reference is on your booking confirmation, alongside the last name of any hiker on the
                        booking. The pass or scan option needs only the Ecotourism Trail ID printed on your pass.
                    </p>
                </section>

                {results && resultCount > 0 ? (
                    results.map(({ booking, passes }) => (
                        <BookingConfirmation
                            key={booking.id}
                            selectedDate={booking.date}
                            passesData={passes.map((pass) => ({
                                ...pass,
                                guideHiker: booking.guideHiker,
                                status: pass.seededStatus,
                            }))}
                            receiptData={buildReceipt(booking)}
                            hikerData={booking.hikers || []}
                            bookingReference={booking.reference}
                            contactEmail={booking.contactEmail || ''}
                        />
                    ))
                ) : (
                    results && (
                        <p className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant">
                            No climb matched that search.
                        </p>
                    )
                )}
            </div>

            <PassScannerModal
                open={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScan}
            />
        </div>
    );
}