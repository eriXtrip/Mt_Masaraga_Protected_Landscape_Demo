import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { createQrDetector, decodeImageFile, getCameraErrorMessage } from '@/lib/passScanner';

export default function PassScannerModal({ open, onClose, onScan }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const frameRef = useRef(null);
    const activeRef = useRef(false);
    const closeButtonRef = useRef(null);
    const uploadInputRef = useRef(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [status, setStatus] = useState('idle');
    const [isDecodingUpload, setIsDecodingUpload] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose, 200);

    const stopCamera = useCallback(() => {
        activeRef.current = false;
        if (frameRef.current !== null) {
            window.cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const reset = useCallback(() => {
        stopCamera();
        setError('');
        setNotice('');
        setStatus('idle');
        setUploadError('');
        setIsDecodingUpload(false);
        if (uploadInputRef.current) {
            uploadInputRef.current.value = '';
        }
    }, [stopCamera]);

    const closeScanner = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    const dismissScanner = useCallback(() => {
        stopCamera();
        requestClose();
    }, [requestClose, stopCamera]);

    const handleScannedValue = useCallback((rawValue) => {
        stopCamera();
        reset();
        onScan(rawValue);
    }, [onScan, reset, stopCamera]);

    const handleUploadChange = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError('');
        setIsDecodingUpload(true);
        try {
            const rawValue = await decodeImageFile(file);
            if (rawValue) {
                handleScannedValue(rawValue);
            } else {
                setUploadError('No QR code was found in that image. Try a closer, sharper photo of the pass.');
            }
        } catch {
            setUploadError('That image could not be read. Try a different photo of the pass.');
        } finally {
            setIsDecodingUpload(false);
        }
    }, [handleScannedValue]);

    useEffect(() => {
        if (!open) return undefined;

        let cancelled = false;
        const startCamera = async () => {
            if (typeof window === 'undefined' || window.isSecureContext === false) {
                setError('This page is not on HTTPS or localhost, so the browser blocks camera access. Upload a photo of the pass instead, or open the app on localhost.');
                return;
            }
            if (!navigator.mediaDevices?.getUserMedia) {
                setError('This browser does not provide camera access. Upload a photo of the pass instead, or use the pass ID lookup.');
                return;
            }

            try {
                const detector = await createQrDetector();
                if (cancelled) return;
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        facingMode: { ideal: 'environment' },
                        height: { ideal: 720 },
                        width: { ideal: 1280 },
                    },
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                const video = videoRef.current;
                if (!video) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                video.srcObject = stream;
                await video.play();
                if (cancelled) return;

                setStatus('scanning');
                activeRef.current = true;
                let lastScanAt = 0;

                const scanFrame = async (timestamp) => {
                    if (cancelled || !activeRef.current) return;

                    if (timestamp - lastScanAt >= 250) {
                        lastScanAt = timestamp;
                        try {
                            const barcodes = await detector.detect(video);
                            if (cancelled || !activeRef.current) return;
                            const rawValue = barcodes.find((barcode) => barcode.rawValue)?.rawValue;
                            if (rawValue) {
                                activeRef.current = false;
                                handleScannedValue(rawValue);
                                return;
                            }
                        } catch (scanError) {
                            if (scanError?.name === 'NotSupportedError') {
                                activeRef.current = false;
                                stopCamera();
                                setError('QR scanning is not supported by this browser. Upload a photo of the pass instead.');
                                return;
                            }
                        }
                    }

                    if (!cancelled && activeRef.current) {
                        frameRef.current = window.requestAnimationFrame(scanFrame);
                    }
                };

                frameRef.current = window.requestAnimationFrame(scanFrame);
            } catch (cameraError) {
                if (!cancelled) {
                    activeRef.current = false;
                    stopCamera();
                    setError(getCameraErrorMessage(cameraError));
                }
            }
        };

        setStatus('starting');
        startCamera();
        return () => {
            cancelled = true;
            stopCamera();
        };
    }, [handleScannedValue, open, stopCamera]);

    useEffect(() => {
        if (!open) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') dismissScanner();
        };
        window.addEventListener('keydown', handleKeyDown);
        closeButtonRef.current?.focus();
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dismissScanner, open]);

    if (!open) return null;

    const statusMessage = status === 'starting'
        ? 'Starting camera...'
        : notice || 'Align the QR code inside the frame.';

    return (
        <>
            {/* Keyframes live inline so the scanner sweep needs no external CSS configuration */}
            <style>{`
                @keyframes scanSweep {
                    0% {
                        top: 0%;
                        opacity: 0;
                    }
                    12% {
                        opacity: 1;
                    }
                    88% {
                        opacity: 1;
                    }
                    100% {
                        top: 100%;
                        opacity: 0;
                    }
                }
            `}</style>

            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 ${closing ? 'animate-out fade-out duration-200' : 'animate-in fade-in duration-200'} motion-reduce:animate-none`}
                onClick={(event) => { if (event.target === event.currentTarget) dismissScanner(); }}
            >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pass-scanner-heading"
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xl ${closing ? 'animate-out fade-out zoom-out-95 duration-200' : 'animate-in fade-in zoom-in-95 duration-200'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pass scanner</p>
                        <h2 id="pass-scanner-heading" className="mt-1 text-lg font-bold text-on-surface">Scan physical pass</h2>
                        <p className="mt-1 text-xs text-on-surface-variant">Point the camera at the QR code, or upload a photo of the hiker pass.</p>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={dismissScanner} aria-label="Close QR scanner" className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4">
                    {error ? (
                        <div role="alert" className="animate-in fade-in duration-200 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            <p className="font-semibold">Camera unavailable</p>
                            <p className="mt-1">{error}</p>
                            <p className="mt-3 text-xs">You can still upload a photo of the pass or enter the pass ID in the lookup field.</p>
                        </div>
                    ) : (
                        <>
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
                                <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" aria-label="Live QR scanner camera feed" />
                                <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-white/90" />
                                <div className="pointer-events-none absolute inset-8 overflow-hidden rounded-xl">
                                    {status === 'scanning' && !closing && (
                                        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/85 motion-reduce:hidden" style={{ animation: 'scanSweep 2.4s ease-in-out infinite' }} />
                                    )}
                                </div>
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center text-xs text-white" aria-live="polite">
                                    <span key={statusMessage} className="inline-block animate-in fade-in duration-200 motion-reduce:animate-none">{statusMessage}</span>
                                </div>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">Camera frames are decoded on this device. Close the scanner when you are done.</p>
                        </>
                    )}

                    <div className="mt-4 border-t border-outline-variant/20 pt-4">
                        <input
                            ref={uploadInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUploadChange}
                            className="sr-only"
                            aria-label="Upload a photo of the hiker pass QR code"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => uploadInputRef.current?.click()}
                            disabled={isDecodingUpload}
                            className="min-h-11 w-full cursor-pointer gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ImageUp className="h-4 w-4" />
                            {isDecodingUpload ? 'Reading QR code...' : 'Upload pass photo'}
                        </Button>
                        {uploadError && (
                            <p role="alert" className="mt-2 text-xs text-red-700">{uploadError}</p>
                        )}
                        <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">Decoding happens in your browser. Nothing is uploaded to the server.</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}