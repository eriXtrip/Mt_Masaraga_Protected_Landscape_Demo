import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';
import { toast } from '@/components/ui/toast';

const CATEGORIES = ['Announcement', 'Advisory', 'Weather', 'Update', 'News'];
const AUDIENCES = [
    { value: 'all', label: 'All Users (Hikers, Staff, Admins)' },
    { value: 'hikers', label: 'Hikers Only' },
    { value: 'staff', label: 'Park Staff / Guides Only' },
    { value: 'admins', label: 'Admins Only' },
];

const EMPTY_FORM = {
    title: '',
    category: 'Announcement',
    audience: 'all',
    content: '',
};

export default function AnnouncementForm({ item, onSave, onClose }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);
    const isEditing = !!item;

    const [form, setForm] = useState(() => {
        if (item) {
            return {
                title: item.title || '',
                category: item.category || 'Announcement',
                audience: item.audience || 'all',
                content: item.content || '',
            };
        }
        return EMPTY_FORM;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e, action = 'save') => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Title and content are required');
            return;
        }
        setIsSubmitting(true);
        try {
            const data = {
                ...form,
                date: new Date().toISOString(),
                status: action === 'send' ? 'sent' : 'draft',
                sentAt: action === 'send' ? new Date().toISOString() : null,
                author: 'Admin',
            };
            onSave(data, isEditing ? item.id : null);
            toast.success(action === 'send' ? 'Announcement sent successfully' : 'Announcement saved as draft');
            requestClose();
        } catch (error) {
            toast.error('Failed to save announcement');
        } finally {
            setIsSubmitting(false);
        }
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
                aria-label={isEditing ? 'Edit announcement' : 'Create announcement'}
                onAnimationEnd={closing ? handleAnimationEnd : undefined}
                className={`absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-surface-container-lowest shadow-xl ${closing ? 'animate-out slide-out-to-right animation-duration-300' : 'animate-in slide-in-from-right animation-duration-300'} motion-reduce:animate-none`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{isEditing ? 'Edit' : 'Create'} Announcement</p>
                        <h2 className="mt-1 text-lg font-bold text-on-surface">{isEditing ? 'Update announcement' : 'New announcement'}</h2>
                    </div>
                    <button ref={closeButtonRef} type="button" onClick={requestClose} aria-label="Close" className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={(e) => handleSubmit(e, 'save')} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Title</label>
                        <Input value={form.title} onChange={setField('title')} required placeholder="Announcement title" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Category</label>
                            <select value={form.category} onChange={setField('category')} className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                                {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Audience</label>
                            <select value={form.audience} onChange={setField('audience')} className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                                {AUDIENCES.map((aud) => (<option key={aud.value} value={aud.value}>{aud.label}</option>))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5">Content</label>
                        <textarea
                            rows={8}
                            value={form.content}
                            onChange={setField('content')}
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
                            placeholder="Write your announcement here..."
                            required
                            className="w-full rounded-lg border border-outline-variant bg-surface px-3.5 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                        />
                        <p className="mt-1.5 text-xs text-on-surface-variant">Markdown is supported. Use **bold**, *italic*, `code`, and [links](url).</p>
                    </div>
                </form>

                <div className="border-t border-outline-variant/20 px-5 py-4 flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={requestClose} className="cursor-pointer" disabled={isSubmitting}>Cancel</Button>
                    <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, 'send')} className="gap-2 cursor-pointer" disabled={isSubmitting}>
                        <Send className="h-4 w-4" />
                        Send Now
                    </Button>
                    <Button type="submit" className="gap-2 cursor-pointer" disabled={isSubmitting}>
                        <Save className="h-4 w-4" />
                        {isEditing ? 'Save Changes' : 'Save Draft'}
                    </Button>
                </div>
            </aside>
        </div>
    );
}