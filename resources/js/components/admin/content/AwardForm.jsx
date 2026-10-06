import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import ImageDropZone from './ImageDropZone';

const EMPTY_FORM = {
    title: '',
    badge: '',
    awardingBody: '',
    dateReceived: '',
    category: '',
    summary: '',
    description: '',
    image: '',
    imageAlt: '',
};

export default function AwardForm({ item, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!item;

    const [form, setForm] = useState(() => {
        if (item) {
            return {
                title: item.title || '',
                badge: item.badge || '',
                awardingBody: item.awardingBody || '',
                dateReceived: item.dateReceived || '',
                category: item.category || '',
                summary: item.summary || '',
                description: item.description || '',
                image: item.image || '',
                imageAlt: item.imageAlt || '',
            };
        }
        return EMPTY_FORM;
    });

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

    const setField = (key) => (e) => setForm((c) => ({ ...c, [key]: e.target.value }));

    const handleImageDrop = (file) => {
        const url = URL.createObjectURL(file);
        setForm((c) => ({ ...c, image: url, imageAlt: c.imageAlt || file.name }));
    };

    const handleImageRemove = () => {
        setForm((c) => ({ ...c, image: '', imageAlt: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...form, name: form.title });
    };

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
                aria-label={isEditing ? 'Edit award' : 'Create award'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{isEditing ? 'Edit' : 'Create'} Award</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Update award' : 'New award'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Title</label>
                        <Input value={form.title} onChange={setField('title')} required placeholder="Award title" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Badge label</label>
                        <Input value={form.badge} onChange={setField('badge')} placeholder="e.g. 2023 Recognition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Awarding body</label>
                        <Input value={form.awardingBody} onChange={setField('awardingBody')} placeholder="Who gave this award" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Date received</label>
                            <Input value={form.dateReceived} onChange={setField('dateReceived')} placeholder="Month Day, Year" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Category</label>
                            <Input value={form.category} onChange={setField('category')} placeholder="Award category" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Summary</label>
                        <textarea
                            rows={3}
                            ref={(node) => {
                                if (node) {
                                    node.style.height = 'auto';
                                    node.style.height = `${node.scrollHeight}px`;
                                }
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            value={form.summary}
                            onChange={setField('summary')}
                            placeholder="Brief summary"
                            className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Image</label>
                        <ImageDropZone label="Award image" image={form.image} onDrop={handleImageDrop} onRemove={handleImageRemove} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Image alt text</label>
                        <Input value={form.imageAlt} onChange={setField('imageAlt')} placeholder="Describe the image" />
                    </div>
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer">Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} className="gap-2 cursor-pointer">{isEditing ? 'Save changes' : 'Create award'}</Button>
                </div>
            </aside>
        </div>
    );
}
