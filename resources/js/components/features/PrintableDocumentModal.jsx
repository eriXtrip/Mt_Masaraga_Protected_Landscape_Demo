import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { downloadElementAsImage } from '@/lib/printImage';

const PREVIEW_SCALE = 0.48;

export default function PrintableDocumentModal({
    isOpen,
    onClose,
    eyebrow = 'System generated',
    title,
    description,
    documents = [],
}) {
    const nodeRefs = useRef(new Map());
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

    const downloadDocument = async (document_) => {
        const element = nodeRefs.current.get(document_.id);
        if (!element) throw new Error('The document preview is not ready.');
        await downloadElementAsImage(element, {
            fileName: document_.fileName,
            widthInches: document_.widthInches,
            heightInches: document_.heightInches,
        });
    };

    const handleDownload = async (document_) => {
        if (isDownloading) return;
        setIsDownloading(true);
        setDownloadingId(document_.id);
        try {
            await downloadDocument(document_);
            toast.add({
                type: 'success',
                title: 'Document downloaded',
                description: `${document_.fileName} is ready to print.`,
            });
        } catch (error) {
            toast.add({ type: 'error', title: 'Download failed', description: error.message || 'Please try again.' });
        } finally {
            setDownloadingId(null);
            setIsDownloading(false);
        }
    };

    const handleDownloadAll = async () => {
        if (isDownloading || documents.length === 0) return;
        setIsDownloading(true);
        try {
            for (const document_ of documents) {
                setDownloadingId(document_.id);
                await downloadDocument(document_);
                await new Promise((resolve) => window.setTimeout(resolve, 180));
            }
            toast.add({
                type: 'success',
                title: 'Documents downloaded',
                description: `${documents.length} PNG ${documents.length === 1 ? 'file' : 'files'} are ready.`,
            });
        } catch (error) {
            toast.add({ type: 'error', title: 'Download failed', description: error.message || 'Please try again.' });
        } finally {
            setDownloadingId(null);
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-100 isolate flex items-center justify-center overflow-y-auto bg-inverse-surface/60 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="printable-document-title"
                className="my-auto max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{eyebrow}</p>
                        <h2 id="printable-document-title" className="mt-1 text-lg font-bold text-on-surface">{title}</h2>
                        {description && (
                            <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close document preview"
                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    {documents.length > 0 ? (
                        <>
                            {documents.length > 1 && (
                                <div className="flex justify-end">
                                    <Button type="button" onClick={handleDownloadAll} disabled={isDownloading} className="min-h-11 cursor-pointer gap-2">
                                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        {isDownloading ? 'Preparing images...' : 'Download all documents'}
                                    </Button>
                                </div>
                            )}
                            <div className="grid gap-5 sm:grid-cols-2">
                                {documents.map((document_) => {
                                    const { widthInches, heightInches } = document_;
                                    return (
                                        <div
                                            key={document_.id}
                                            className="flex min-w-0 flex-col  items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4"
                                        >
                                            <div className="w-full flex justify-center">
                                                <div
                                                    style={{
                                                        height: heightInches * 96 * PREVIEW_SCALE,
                                                        overflow: 'hidden',
                                                        width: widthInches * 96 * PREVIEW_SCALE,
                                                    }}
                                                >
                                                    <div
                                                        ref={(element) => {
                                                            if (element) nodeRefs.current.set(document_.id, element);
                                                            else nodeRefs.current.delete(document_.id);
                                                        }}
                                                        style={{
                                                            transform: `scale(${PREVIEW_SCALE})`,
                                                            transformOrigin: 'top left',
                                                        }}
                                                    >
                                                        {document_.content}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full text-center">
                                                <p className="truncate text-sm font-bold text-on-surface">{document_.label}</p>
                                                {document_.meta && (
                                                    <p className="truncate font-mono text-[11px] text-on-surface-variant">{document_.meta}</p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleDownload(document_)}
                                                disabled={isDownloading}
                                                className="min-h-11 w-full cursor-pointer gap-2"
                                            >
                                                {isDownloading && downloadingId === document_.id
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : <Download className="h-4 w-4" />}
                                                {isDownloading && downloadingId === document_.id ? 'Preparing image...' : 'Download PNG'}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="py-8 text-center text-sm text-on-surface-variant">There are no documents to download.</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
