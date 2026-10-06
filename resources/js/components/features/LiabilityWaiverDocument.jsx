import PrintableDocument from './PrintableDocument';

const SANS = 'Helvetica, Arial, sans-serif';

const INK = '#141e18';
const MUTED = '#737969';
const LINE = '#c2c9b7';

function Clause({ number, heading, children }) {
    return (
        <div style={{ margin: '0 0 12px' }}>
            <p style={{ color: INK, fontFamily: SANS, fontSize: '10.5px', fontWeight: 800, lineHeight: 1.3, margin: '0 0 3px' }}>
                {number}. {heading}
            </p>
            <p style={{ color: INK, fontFamily: SANS, fontSize: '9.5px', lineHeight: 1.55, margin: 0, textAlign: 'justify' }}>
                {children}
            </p>
        </div>
    );
}

function SignatureLine({ label, sublabel }) {
    return (
        <div style={{ minWidth: 0 }}>
            <div style={{ borderTop: `1px solid ${LINE}` }} />
            <p style={{ color: MUTED, fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, margin: '6px 0 0', textTransform: 'uppercase' }}>
                {label}
            </p>
            <p style={{ color: INK, fontFamily: SANS, fontSize: '8.5px', lineHeight: 1.3, margin: '3px 0 0' }}>
                {sublabel}
            </p>
        </div>
    );
}

export default function LiabilityWaiverDocument({ documentCode, issuedAt }) {
    return (
        <PrintableDocument
            documentTitle="Liability Waiver"
            documentCode={documentCode}
            issuedAt={issuedAt}
            intro="Every hiker entering Mount Masaraga Protected Landscape must accept this waiver. It is signed once per booking and countersigned by the hiker and their accredited guide at jump-off."
        >
            <div style={{ marginTop: '17px' }}>
                <Clause number="1" heading="Assumption of Risk">
                    I understand that hiking Mount Masaraga involves inherent risks, including physical
                    exertion, unpredictable weather, steep and unstable terrain, and encounters with wildlife.
                    I accept these risks voluntarily and confirm that I am physically capable of undertaking
                    the climb.
                </Clause>

                <Clause number="2" heading="Waiver of Liability">
                    I hereby release Mount Masaraga Protected Landscape management, its accredited guides,
                    park rangers, and DENR personnel from any liability for personal injury, loss of life,
                    property damage, or loss of property incurred during the activity, whether resulting from
                    the inherent dangers of the climb, from negligence, or from any other cause.
                </Clause>

                <Clause number="3" heading="Regulatory Compliance">
                    I agree to follow designated trails, obey park rangers and guide instructions at all
                    times, and observe the park's rules on waste, wildlife, and camp behaviour. I understand
                    that breaching protected-area rules may result in administrative fines or penalties under
                    applicable law.
                </Clause>

                <Clause number="4" heading="Environmental Commitment">
                    I commit to Leave No Trace principles throughout my visit: pack out what I bring in,
                    leave trails and campsites as I found them, and take no plant, animal, or natural feature
                    from the mountain.
                </Clause>
            </div>

            <div style={{ background: '#f7f9f4', border: `1px solid ${LINE}`, borderRadius: '0.06in', boxSizing: 'border-box', marginTop: '20px', padding: '11px 12px' }}>
                <p style={{ color: MUTED, fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.1em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
                    Emergency contact on record
                </p>
                <p style={{ color: INK, fontFamily: SANS, fontSize: '9.5px', lineHeight: 1.45, margin: '5px 0 0', textAlign: 'justify' }}>
                    Your emergency contact is recorded against this booking and is the first person the guide
                    will call in an incident. Update it with park staff if it changes before your climb.
                </p>
            </div>

            <p style={{ color: INK, fontFamily: SANS, fontSize: '9.5px', lineHeight: 1.55, margin: '18px 0 0', textAlign: 'justify' }}>
                I have read, understood, and agree to the four clauses above. I accept that this waiver
                applies to me and to the members of my group listed on this booking.
            </p>

            <div style={{ display: 'grid', gap: '0.28in', gridTemplateColumns: '1.4fr 1fr', marginTop: '30px' }}>
                <SignatureLine label="Hiker signature" sublabel="Printed name over signature" />
                <SignatureLine label="Accredited guide" sublabel="Countersigned at jump-off" />
            </div>

            <div style={{ display: 'grid', gap: '0.28in', gridTemplateColumns: '1.4fr 1fr', marginTop: '22px' }}>
                <SignatureLine label="Date signed" sublabel="Booking date" />
                <SignatureLine label="Group size" sublabel="Hikers covered by this waiver" />
            </div>
        </PrintableDocument>
    );
}
