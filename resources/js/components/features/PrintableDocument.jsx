import MtMasaragaLogo from '../../../../public/assets/logo/MT. MASARAGA LOGO.png';

// Documents are rasterised with `skipFonts: true`, so embedded webfonts are not
// available to the renderer. The template sticks to a generic sans stack that
// resolves reliably on every machine, and uses fixed point sizes and spacing
// rather than a utility-class scale.
const SANS = 'Helvetica, Arial, sans-serif';
const MONO = 'Courier New, Courier, monospace';

const INK = '#141e18';
const MUTED = '#737969';
const LINE = '#c2c9b7';
const BRAND = '#749455';
const TINT = '#ebf7ed';
const CHIP = '#e8f4ea';

export default function PrintableDocument({
    children,
    documentTitle,
    documentCode,
    intro,
    issuedAt,
}) {
    return (
        <div
            style={{
                background: '#ffffff',
                border: `1px solid ${LINE}`,
                boxSizing: 'border-box',
                color: INK,
                display: 'flex',
                flexDirection: 'column',
                fontFamily: SANS,
                height: '11.69in',
                overflow: 'hidden',
                width: '8.27in',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    background: BRAND,
                    borderBottom: '1px solid rgba(255,255,255,0.35)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexShrink: 0,
                    gap: '0.14in',
                    justifyContent: 'space-between',
                    padding: '0.16in 0.2in',
                }}
            >
                <div style={{ alignItems: 'center', display: 'flex', gap: '0.12in', minWidth: 0 }}>
                    <img
                        src={MtMasaragaLogo}
                        alt="Mt. Masaraga Protected Landscape"
                        style={{ flexShrink: 0, height: '0.52in', objectFit: 'contain' }}
                    />
                    <div style={{ minWidth: 0 }}>
                        <p style={{ color: '#ffffff', fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.14em', lineHeight: 1, margin: 0, textTransform: 'uppercase' }}>
                            Mt. Masaraga Protected Landscape
                        </p>
                        <p style={{ color: '#f2f8e8', fontFamily: SANS, fontSize: '8px', lineHeight: 1.2, margin: '3px 0 0' }}>
                            DENR / Protected Area Management Board
                        </p>
                    </div>
                </div>
                <div style={{ alignItems: 'flex-end', display: 'flex', flexShrink: 0, flexDirection: 'column' }}>
                    <span style={{ color: '#f2f8e8', fontFamily: SANS, fontSize: '6.5px', fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1, textTransform: 'uppercase' }}>
                        Official document
                    </span>
                    {documentCode && (
                        <span style={{ background: CHIP, borderRadius: '0.04in', color: INK, fontFamily: MONO, fontSize: '7.5px', fontWeight: 800, lineHeight: 1.2, marginTop: '4px', padding: '3px 5px' }}>
                            {documentCode}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ boxSizing: 'border-box', flex: 1, overflow: 'hidden', padding: '0.22in 0.2in' }}>
                <h1 style={{ color: INK, fontFamily: SANS, fontSize: '17px', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15, margin: 0 }}>
                    {documentTitle}
                </h1>
                {issuedAt && (
                    <p style={{ color: MUTED, fontFamily: SANS, fontSize: '8.5px', margin: '5px 0 0' }}>
                        Issued {issuedAt}
                    </p>
                )}
                {intro && (
                    <div style={{ background: TINT, border: `1px solid ${LINE}`, borderRadius: '0.06in', boxSizing: 'border-box', margin: '13px 0 0', padding: '9px 11px' }}>
                        <p style={{ color: INK, fontFamily: SANS, fontSize: '9px', lineHeight: 1.5, margin: 0, textAlign: 'justify' }}>
                            {intro}
                        </p>
                    </div>
                )}
                {children}
            </div>

            <div
                style={{
                    alignItems: 'center',
                    background: TINT,
                    borderTop: `1px solid ${LINE}`,
                    boxSizing: 'border-box',
                    color: '#42493b',
                    display: 'flex',
                    flexShrink: 0,
                    fontFamily: SANS,
                    fontSize: '7.5px',
                    fontWeight: 600,
                    justifyContent: 'space-between',
                    padding: '7px 0.2in',
                }}
            >
                <span>Mount Masaraga Protected Landscape · Brgy. Amtic, Ligao City, Albay</span>
                <span style={{ fontFamily: MONO }}>Retain this document for trail entry</span>
            </div>
        </div>
    );
}
