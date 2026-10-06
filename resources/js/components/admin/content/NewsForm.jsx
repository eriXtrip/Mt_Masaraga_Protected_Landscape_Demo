import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { NEWS_CATEGORIES } from './contentUtils';
import ImageDropZone from './ImageDropZone';

const EMPTY_FORM = {
    title: '',
    category: 'Advisory',
    leadParagraph: '',
    leadImage: '',
    leadImageAlt: '',
    sections: [],
    contact: { phone: '', email: '' },
};

export default function NewsForm({ item, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!item;

    const [form, setForm] = useState(() => {
        if (item) {
            return {
                title: item.title || '',
                category: item.category || 'Advisory',
                leadParagraph: item.leadParagraph || '',
                leadImage: item.leadImage || '',
                leadImageAlt: item.leadImageAlt || '',
                sections: item.sections || [],
                contact: item.contact || { phone: '', email: '' },
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
    const setContact = (key) => (e) => setForm((c) => ({ ...c, contact: { ...c.contact, [key]: e.target.value } }));

    const handleImageDrop = (file) => {
        const url = URL.createObjectURL(file);
        setForm((c) => ({ ...c, leadImage: url, leadImageAlt: c.leadImageAlt || file.name }));
    };

    const handleImageRemove = () => {
        setForm((c) => ({ ...c, leadImage: '', leadImageAlt: '' }));
    };

    const addSection = () => {
        setForm((c) => ({ ...c, sections: [...c.sections, { type: 'paragraph', text: '' }] }));
    };

    const updateSection = (index, updates) => {
        setForm((c) => ({ ...c, sections: c.sections.map((s, i) => (i === index ? { ...s, ...updates } : s)) }));
    };

    const removeSection = (index) => {
        setForm((c) => ({ ...c, sections: c.sections.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = item?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const badgeClassMap = {
            Advisory: 'bg-red-50 text-red-700 border-red-200',
            Weather: 'bg-blue-50 text-blue-700 border-blue-200',
            Update: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            News: 'bg-slate-50 text-slate-700 border-slate-200',
        };
        onSave({ ...form, date, badgeClass: badgeClassMap[form.category] || badgeClassMap.News });
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
                aria-label={isEditing ? 'Edit news' : 'Create news'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{isEditing ? 'Edit' : 'Create'} News</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Update news item' : 'New news item'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Title</label>
                        <Input value={form.title} onChange={setField('title')} required placeholder="News title" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Category</label>
                        <select value={form.category} onChange={setField('category')} className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                            {NEWS_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Lead paragraph</label>
                        <textarea rows={3}
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
                            value={form.leadParagraph}
                            onChange={setField('leadParagraph')}
                            placeholder="Brief summary shown in cards"
                            className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Lead image</label>
                        <ImageDropZone label="Lead image" image={form.leadImage} onDrop={handleImageDrop} onRemove={handleImageRemove} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Image alt text</label>
                        <Input value={form.leadImageAlt} onChange={setField('leadImageAlt')} placeholder="Describe the image" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Content sections</label>
                            <Button type="button" variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={addSection}>
                                <Plus className="h-3.5 w-3.5" /> Add section
                            </Button>
                        </div>
                        {form.sections.map((section, index) => (
                            <div key={index} className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <select value={section.type} onChange={(e) => updateSection(index, { type: e.target.value })} className="rounded-lg border border-outline-variant bg-surface px-2.5 py-1.5 text-xs font-medium text-on-surface cursor-pointer">
                                        <option value="paragraph">Paragraph</option>
                                        <option value="heading">Heading</option>
                                        <option value="list">List</option>
                                    </select>
                                    <button type="button" onClick={() => removeSection(index)} className="ml-auto rounded-lg p-1 text-on-surface-variant hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <textarea rows={3}
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
                                    value={section.text || ''}
                                    onChange={(e) => updateSection(index, { text: e.target.value })}
                                    placeholder="Section content"
                                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Contact phone</label>
                            <Input value={form.contact.phone} onChange={setContact('phone')} placeholder="+63 ..." />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Contact email</label>
                            <Input value={form.contact.email} onChange={setContact('email')} placeholder="email@example.com" />
                        </div>
                    </div>
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer">Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} className="gap-2 cursor-pointer">{isEditing ? 'Save changes' : 'Create news'}</Button>
                </div>
            </aside>
        </div>
    );
}
