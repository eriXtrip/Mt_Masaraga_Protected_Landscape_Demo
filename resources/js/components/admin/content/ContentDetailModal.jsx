import React, { useEffect, useRef } from 'react';
import { X, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';

export default function ContentDetailModal({ item, type, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-40">
            <div
                className={`absolute inset-0 bg-inverse-surface/60 ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                onClick={requestClose}
                aria-hidden="true"
            />
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={`View ${type}`}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Details</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface truncate">{item.title || item.name || 'Untitled'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    {item.leadImage && (
                        <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
                            <img src={item.leadImage} alt={item.leadImageAlt || item.title} className="w-full h-48 object-cover" />
                        </div>
                    )}
                    {item.image && !item.leadImage && (
                        <div className="rounded-xl border border-outline-variant/30 overflow-hidden">
                            <img src={item.image} alt={item.imageAlt || item.title} className="w-full h-48 object-cover" />
                        </div>
                    )}

                    {item.category && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.category}</span>
                    )}

                    {item.leadParagraph && (
                        <p className="text-sm leading-relaxed text-on-surface-variant">{item.leadParagraph}</p>
                    )}

                    {item.summary && (
                        <p className="text-sm leading-relaxed text-on-surface-variant">{item.summary}</p>
                    )}

                    {item.awardingBody && (
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span className="font-semibold text-on-surface">Awarding body:</span> {item.awardingBody}
                        </div>
                    )}

                    {item.dateReceived && (
                        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <Calendar className="h-4 w-4 text-primary shrink-0" />
                            {item.dateReceived}
                        </div>
                    )}

                    {item.sections && item.sections.length > 0 && (
                        <div className="space-y-3">
                            {item.sections.map((section, index) => {
                                if (section.type === 'heading') {
                                    return <h3 key={index} className="text-sm font-bold text-on-surface">{section.text}</h3>;
                                }
                                if (section.type === 'list' && section.items) {
                                    return (
                                        <div key={index} className="space-y-1.5">
                                            {section.items.map((li, liIndex) => (
                                                <div key={liIndex} className="flex gap-2 text-sm">
                                                    <span className="font-semibold text-on-surface shrink-0">{li.label}:</span>
                                                    <span className="text-on-surface-variant">{li.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return <p key={index} className="text-sm leading-relaxed text-on-surface-variant">{section.text}</p>;
                            })}
                        </div>
                    )}

                    {item.contact && (
                        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-4 space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contact</p>
                            {item.contact.phone && (
                                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                    <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                                    {item.contact.phone}
                                </div>
                            )}
                            {item.contact.email && (
                                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                                    {item.contact.email}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-outline-variant/20 px-5 py-4">
                    <button type="button" onClick={requestClose} className="w-full rounded-lg bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-highest cursor-pointer">Close</button>
                </div>
            </aside>
        </div>
    );
}
