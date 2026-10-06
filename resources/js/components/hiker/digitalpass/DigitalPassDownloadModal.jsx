import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Loader2, X } from 'lucide-react';
import MtMasaragaLogo from '../../../../../public/assets/logo/MT. MASARAGA LOGO.png';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { downloadElementAsImage } from '@/lib/printImage';

const PASS_WIDTH_INCHES = 3.39;
const PASS_HEIGHT_INCHES = 1.80;

function getExpirationDate(dateString) {
    const baseDate = dateString ? new Date(dateString) : new Date();
    if (Number.isNaN(baseDate.getTime())) {
        return 'Not available';
    }
    baseDate.setMonth(baseDate.getMonth() + 6);
    return baseDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function PassField({ label, value }) {
    return (
        <div style={{ minWidth: 0 }}>
            <p style={{ color: '#737969', fontSize: '4.8px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, textTransform: 'uppercase' }}>{label}</p>
            <p title={value} style={{ color: '#141e18', fontSize: '7px', fontWeight: 700, lineHeight: 1.2, margin: '2px 0 0', overflow: 'hidden', whiteSpace: 'wrap' }}>{value || 'Not provided'}</p>
        </div>
    );
}

export const DigitalPassPreview = forwardRef(function DigitalPassPreview({ pass }, ref) {
    const validUntil = getExpirationDate(pass.date || pass.hikeDate);
    const guideHiker = pass.guideHiker || pass.hikerName;

    return (
        <div
            ref={ref}
            style={{ background: '#ffffff', border: '1px solid #c2c9b7', borderRadius: '0.16in', boxSizing: 'border-box', color: '#141e18', fontFamily: 'Inter, sans-serif', height: '1.80in', overflow: 'hidden', position: 'relative', width: '3.39in' }}
        >
            <div style={{ alignItems: 'center', background: '#749455', borderBottom: '1px solid rgba(193, 201, 183, 0.8)', boxSizing: 'border-box', display: 'flex', height: '0.39in', justifyContent: 'space-between', padding: '0.07in 0.13in' }}>
                <img src={MtMasaragaLogo} alt="Mt. Masaraga logo" style={{ height: '0.25in', maxWidth: '1.25in', objectFit: 'contain' }} />
                <div style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#f9ffec', fontSize: '4px', fontWeight: 800, letterSpacing: '0.1em', lineHeight: 1 }}>ECOTOURISM TRAIL ID</span>
                    <span style={{ background: '#e8f4ea', borderRadius: '0.03in', color: '#0f1b18', fontFamily: 'monospace', fontSize: '4px', fontWeight: 800, lineHeight: 1.2, marginTop: '2px', padding: '2px 3px', alignContent: 'center', alignItems: 'center' }}>{pass.id}</span>
                </div>
            </div>

            <div style={{ boxSizing: 'border-box', display: 'flex', gap: '0.2in', height: '1in', padding: '0.1in 0.13in' }}>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ borderBottom: '1px solid rgba(193,201,183,0.5)', paddingBottom: '0.045in' }}>
                        <p style={{ color: '#737969', fontSize: '4.5px', fontWeight: 800, letterSpacing: '0.08em', lineHeight: 1.1, textTransform: 'uppercase' }}>HIKER NAME / CARDHOLDER</p>
                        <p title={pass.hikerName} style={{ color: '#141e18', fontSize: '15px', fontWeight: 800, lineHeight: 1.1, margin: '3px 0 0', maxHeight: '0.27in', overflow: 'hidden' }}>{pass.hikerName}</p>
                    </div>
                    <div style={{ display: 'grid', gap: '0.09in 0.12in', gridTemplateColumns: '1fr 1fr', marginTop: '0.13in' }}>
                        <PassField label="GUIDE HIKER" value={guideHiker} />
                        <PassField label="ASSIGNED TRAIL" value={pass.trail} />
                        <PassField label="CLIMB DATE" value={pass.date || pass.hikeDate} />
                        <PassField label="VALID UNTIL" value={validUntil} />
                    </div>
                </div>

                <div style={{ alignItems: 'center', borderLeft: '1px solid rgba(193, 201, 183, 0.8)', display: 'flex', flexDirection: 'column', flexShrink: 0, paddingLeft: '0.1in', width: '0.9in' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #c2c9b7', borderRadius: '0.07in', boxSizing: 'border-box', padding: '0.045in' }}>
                        <img src={pass.qrCodeUrl} alt="QR code pass" style={{ display: 'block', height: '0.65in', objectFit: 'cover', width: '0.65in' }} />
                    </div>
                    <span style={{ color: '#42493b', fontFamily: 'monospace', fontSize: '4px', fontWeight: 800, letterSpacing: '0.07em', lineHeight: 1.1, marginTop: '0.04in', textAlign: 'center', textTransform: 'uppercase' }}>Scan at jump-off</span>
                </div>
            </div>

            <div style={{ alignItems: 'center', background: '#ebf7ed', borderTop: '1px solid rgba(193,201,183,0.5)', bottom: 0, boxSizing: 'border-box', color: '#42493b', display: 'flex', fontSize: '4.5px', fontWeight: 600, height: '0.15in', justifyContent: 'space-between', left: 0, padding: '0 0.13in', position: 'absolute', right: 0 }}>
                <span>Mount Masaraga Protected Landscape</span>
                <span style={{ fontFamily: 'monospace' }}>AUTHORIZED PASS</span>
            </div>
        </div>
    );
});

function renderPassImage(element, pass) {
    return downloadElementAsImage(element, {
        fileName: `${pass.id || 'digital-pass'}.png`,
        widthInches: PASS_WIDTH_INCHES,
        heightInches: PASS_HEIGHT_INCHES,
    });
}

export default function DigitalPassDownloadModal({ isOpen, passes = [], onClose, title = 'Download pass images' }) {
    const previewRefs = useRef(new Map());
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const downloadPass = async (pass) => {
        const element = previewRefs.current.get(pass.id);
        if (!element) throw new Error('The pass preview is not ready.');
        await renderPassImage(element, pass);
    };

    const handleDownload = async (pass) => {
        if (isDownloading) return;
        setIsDownloading(true);
        setDownloadingId(pass.id);
        try {
            await downloadPass(pass);
            toast.add({ type: 'success', title: 'Pass image downloaded', description: `${pass.id}.png is ready to print or share.` });
        } catch (error) {
            toast.add({ type: 'error', title: 'Pass download failed', description: error.message || 'Please try again.' });
        } finally {
            setDownloadingId(null);
            setIsDownloading(false);
        }
    };

    const handleDownloadAll = async () => {
        if (isDownloading || passes.length === 0) return;
        setIsDownloading(true);
        try {
            for (const pass of passes) {
                setDownloadingId(pass.id);
                await downloadPass(pass);
                await new Promise((resolve) => window.setTimeout(resolve, 180));
            }
            toast.add({ type: 'success', title: 'Pass images downloaded', description: `${passes.length} PNG ${passes.length === 1 ? 'file' : 'files'} are ready.` });
        } catch (error) {
            toast.add({ type: 'error', title: 'Pass download failed', description: error.message || 'Please try again.' });
        } finally {
            setDownloadingId(null);
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 isolate flex items-center justify-center overflow-y-auto bg-inverse-surface/60 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div role="dialog" aria-modal="true" aria-labelledby="digital-pass-download-title" className="my-auto max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Print-ready download</p>
                        <h2 id="digital-pass-download-title" className="mt-1 text-lg font-bold text-on-surface">{title}</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close pass download" className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    {passes.length > 0 ? (
                        <>
                            {passes.length > 1 && (
                                <div className="flex justify-end">
                                    <Button type="button" onClick={handleDownloadAll} disabled={isDownloading} className="min-h-11 cursor-pointer gap-2">
                                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        {isDownloading ? 'Preparing images...' : 'Download all images'}
                                    </Button>
                                </div>
                            )}
                            <div className="grid gap-5 sm:grid-cols-2">
                                {passes.map((pass) => (
                                    <div key={pass.id} className="flex min-w-0 flex-col items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                                        <div className="w-full flex justify-center transition-opacity duration-300">
                                            <div className="transform origin-top scale-[0.68] min-[380px]:scale-[0.90] min-[480px]:scale-[0.95] sm:scale-[0.90] lg:scale-100 transition-transform duration-200 -mb-27.5 min-[380px]:-mb-20 min-[480px]:-mb-12.5 sm:-mb-6.25 lg:mb-0">
                                                <DigitalPassPreview ref={(element) => { if (element) previewRefs.current.set(pass.id, element); else previewRefs.current.delete(pass.id); }} pass={pass} />
                                            </div>
                                        </div>
                                        <div className="w-full text-center pt-15 sm:pt-5">
                                            <p className="truncate text-sm font-bold text-on-surface">{pass.hikerName}</p>
                                            <p className="truncate font-mono text-[11px] text-on-surface-variant">{pass.id}</p>
                                        </div>
                                        <Button type="button" variant="outline" onClick={() => handleDownload(pass)} disabled={isDownloading} className="min-h-11 w-full cursor-pointer gap-2">
                                            {isDownloading && downloadingId === pass.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                            {isDownloading && downloadingId === pass.id ? 'Preparing image...' : 'Download PNG'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="py-8 text-center text-sm text-on-surface-variant">There are no digital passes to download.</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
