import { HEALTH_QUESTIONS } from '../../mockData';
import PrintableDocument from './PrintableDocument';

const SANS = 'Helvetica, Arial, sans-serif';
const MONO = 'Courier New, Courier, monospace';

const INK = '#141e18';
const MUTED = '#737969';
const LINE = '#c2c9b7';

function DetailRow({ hiker, trail, hikeDate, guideHiker }) {
    const rows = [
        ['Hiker name', hiker.fullName],
        ['Date of birth', hiker.dateOfBirth],
        ['Assigned trail', trail],
        ['Climb date', hikeDate],
        ['Accredited guide', guideHiker],
        ['Emergency contact', hiker.emergencyName ? `${hiker.emergencyName} (${hiker.emergencyRelationship}) · ${hiker.emergencyContact}` : ''],
    ];

    return (
        <div style={{ display: 'grid', gap: '9px 0.18in', gridTemplateColumns: '1fr 1fr', marginTop: '15px' }}>
            {rows.map(([label, value]) => (
                <div key={label} style={{ minWidth: 0 }}>
                    <p style={{ color: MUTED, fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
                        {label}
                    </p>
                    <p style={{ color: INK, fontFamily: SANS, fontSize: '10px', fontWeight: 700, lineHeight: 1.25, margin: '3px 0 0', overflowWrap: 'anywhere' }}>
                        {value || 'Not provided'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function AnswerChip({ selected, children }) {
    return (
        <span
            style={{
                background: selected ? '#749455' : '#ffffff',
                border: `1px solid ${selected ? '#749455' : LINE}`,
                borderRadius: '0.04in',
                color: selected ? '#ffffff' : '#9aa093',
                display: 'inline-block',
                fontFamily: SANS,
                fontSize: '8px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                lineHeight: 1,
                minWidth: '0.34in',
                padding: '4px 0',
                textAlign: 'center',
                textTransform: 'uppercase',
            }}
        >
            {children}
        </span>
    );
}

export default function HealthDeclarationDocument({
    hiker,
    trail,
    hikeDate,
    guideHiker,
    documentCode,
    issuedAt,
}) {
    const healthAnswers = hiker.healthAnswers || {};
    const flagged = HEALTH_QUESTIONS.filter((question) => healthAnswers[question.id] === 'yes');

    return (
        <PrintableDocument
            documentTitle="Health Declaration"
            documentCode={documentCode}
            issuedAt={issuedAt}
            intro="This declaration was completed by the hiker at the time of booking and is reproduced here by the park system. Hikers with a flagged condition must be briefed by their accredited guide before departure."
        >
            <DetailRow hiker={hiker} trail={trail} hikeDate={hikeDate} guideHiker={guideHiker} />

            <div style={{ marginTop: '20px' }}>
                <h2 style={{ color: INK, fontFamily: SANS, fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.06em', lineHeight: 1.2, margin: 0, textTransform: 'uppercase' }}>
                    Declared medical history
                </h2>

                <div style={{ display: 'grid', gap: '6px', marginTop: '9px' }}>
                    {HEALTH_QUESTIONS.map((question, index) => (
                        <div
                            key={question.id}
                            style={{
                                alignItems: 'center',
                                background: '#f7f9f4',
                                border: `1px solid ${LINE}`,
                                borderRadius: '0.05in',
                                boxSizing: 'border-box',
                                display: 'flex',
                                gap: '0.12in',
                                justifyContent: 'space-between',
                                padding: '7px 9px',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '7px', minWidth: 0 }}>
                                <span style={{ color: MUTED, fontFamily: MONO, fontSize: '8px', fontWeight: 800, lineHeight: 1.35 }}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <p style={{ color: INK, fontFamily: SANS, fontSize: '9px', lineHeight: 1.4, margin: 0 }}>
                                    {question.question}
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexShrink: 0, gap: '4px' }}>
                                <AnswerChip selected={healthAnswers[question.id] === 'yes'}>Yes</AnswerChip>
                                <AnswerChip selected={healthAnswers[question.id] === 'no'}>No</AnswerChip>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    background: flagged.length > 0 ? '#fdf1e7' : '#ebf7ed',
                    border: `1px solid ${flagged.length > 0 ? '#e0b98d' : LINE}`,
                    borderRadius: '0.05in',
                    boxSizing: 'border-box',
                    marginTop: '16px',
                    padding: '10px 11px',
                }}
            >
                <p style={{ color: INK, fontFamily: SANS, fontSize: '9px', fontWeight: 800, lineHeight: 1.3, margin: 0 }}>
                    {flagged.length > 0
                        ? `${flagged.length} condition${flagged.length === 1 ? '' : 's'} flagged for guide review`
                        : 'No conditions flagged'}
                </p>
                <p style={{ color: MUTED, fontFamily: SANS, fontSize: '8.5px', lineHeight: 1.45, margin: '4px 0 0' }}>
                    {flagged.length > 0
                        ? 'Flagged: ' + flagged.map((question, index) => `Q${index + 1}`).join(', ') + '. Carry any prescribed medication and inform your guide at jump-off.'
                        : 'The hiker declared no history of the conditions listed above and confirmed they can walk or jog for one hour without severe shortness of breath or dizziness.'}
                </p>
            </div>

            <p style={{ color: MUTED, fontFamily: SANS, fontSize: '8.5px', lineHeight: 1.5, margin: '14px 0 0', textAlign: 'justify' }}>
                I confirm that the answers recorded above are true and complete to the best of my knowledge. I
                understand that this declaration is shared with my accredited guide and park rangers for safety
                purposes, and that withholding or misrepresenting a medical condition may endanger my own life
                and the lives of my companions on the trail.
            </p>

            <div style={{ display: 'flex', gap: '0.3in', marginTop: '26px' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ color: INK, fontFamily: SANS, fontSize: '10px', fontWeight: 700, lineHeight: 1.2, margin: '4px 0 0' }}>
                        {hiker.fullName}
                    </p>
                    <p style={{ borderTop: `1px solid ${LINE}`, paddingTop: '6px', color: MUTED, fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
                        Hiker signature over printed name
                    </p>
                </div>
                <div style={{ flexShrink: 0, width: '1.05in' }}>
                    <p style={{ color: INK, fontFamily: SANS, fontSize: '10px', fontWeight: 700, lineHeight: 1.2, margin: '4px 0 0' }}>
                        {issuedAt}
                    </p>
                    <p style={{ borderTop: `1px solid ${LINE}`, paddingTop: '6px', color: MUTED, fontFamily: SANS, fontSize: '7px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
                        Date signed
                    </p>
                </div>
            </div>
        </PrintableDocument>
    );
}
