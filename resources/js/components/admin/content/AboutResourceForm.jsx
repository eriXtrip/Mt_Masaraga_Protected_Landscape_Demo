import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import FilePicker from './FilePicker';

export default function AboutResourceForm({ item, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!item;

    const [form, setForm] = useState({
        title: item?.title || '',
        description: item?.description || '',
        href: item?.href || '',
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

    const handleFileDrop = (file) => {
        const url = URL.createObjectURL(file);
        setForm((c) => ({ ...c, href: url, fileName: file.name }));
    };

    const handleFileRemove = () => {
        setForm((c) => ({ ...c, href: '', fileName: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...form, id: item?.id });
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
                aria-label={isEditing ? 'Edit resource' : 'Add resource'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">About</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Edit resource' : 'Add resource'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Title</label>
                        <Input value={form.title} onChange={setField('title')} required placeholder="Resource title" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Description</label>
                        <textarea
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
                            value={form.description}
                            onChange={setField('description')}
                            rows={3}
                            placeholder="Brief description"
                            className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Resource file</label>
                        <FilePicker label="Resource file" file={form.fileName || form.href} accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.txt" onDrop={handleFileDrop} onRemove={handleFileRemove} />
                    </div>
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer">Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} className="gap-2 cursor-pointer">{isEditing ? 'Save changes' : 'Add resource'}</Button>
                </div>
            </aside>
        </div>
    );
}
