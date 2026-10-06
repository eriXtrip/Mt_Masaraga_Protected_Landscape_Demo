import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';

export default function FaqForm({ item, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!item;

    const [form, setForm] = useState({
        title: item?.title || '',
        items: item?.items || [],
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

    const addItem = () => {
        setForm((c) => ({ ...c, items: [...c.items, { question: '', answer: '' }] }));
    };

    const updateItem = (index, key, value) => {
        setForm((c) => ({
            ...c,
            items: c.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
        }));
    };

    const removeItem = (index) => {
        setForm((c) => ({ ...c, items: c.items.filter((_, i) => i !== index) }));
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
                aria-label={isEditing ? 'Edit FAQ category' : 'Add FAQ category'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">FAQ</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Edit category' : 'New category'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Category title</label>
                        <Input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} required placeholder="e.g. Booking & Payments" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Questions</label>
                            <Button type="button" variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={addItem}>
                                <Plus className="h-3.5 w-3.5" /> Add question
                            </Button>
                        </div>
                        {form.items.map((q, index) => (
                            <div key={index} className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Q{index + 1}</span>
                                    <button type="button" onClick={() => removeItem(index)} className="rounded-lg p-1 text-on-surface-variant hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <Input value={q.question} onChange={(e) => updateItem(index, 'question', e.target.value)} placeholder="Question" />
                                <textarea
                                    value={q.answer}
                                    onChange={(e) => updateItem(index, 'answer', e.target.value)}
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
                                    placeholder="Answer"
                                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer">Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} className="gap-2 cursor-pointer">{isEditing ? 'Save changes' : 'Create category'}</Button>
                </div>
            </aside>
        </div>
    );
}
