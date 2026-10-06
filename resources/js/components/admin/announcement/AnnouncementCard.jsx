import React from 'react';
import { MoreVertical, Edit2, Trash2, Send, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from 'cn';

const CATEGORY_STYLES = {
    Advisory: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    Weather: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    Update: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
    News: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800',
    Announcement: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
};

const AUDIENCE_STYLES = {
    all: 'bg-primary/10 text-primary border-primary/20',
    hikers: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    staff: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    admins: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

function StatusBadge({ status }) {
    const isSent = status === 'sent';
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
            isSent
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
        )}>
            {isSent ? <Bell className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
            {isSent ? 'Sent' : 'Draft'}
        </span>
    );
}

function CategoryBadge({ category }) {
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border',
            CATEGORY_STYLES[category] || CATEGORY_STYLES.News
        )}>
            {category}
        </span>
    );
}

function AudienceBadge({ audience }) {
    return (
        <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border',
            AUDIENCE_STYLES[audience] || AUDIENCE_STYLES.all
        )}>
            {audience.charAt(0).toUpperCase() + audience.slice(1)}
        </span>
    );
}

function ActionMenu({ onEdit, onDelete, onSend }) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                size="icon-sm"
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                onClick={() => setOpen(!open)}
                aria-label="More options"
                aria-expanded={open}
                aria-haspopup="true"
            >
                <MoreVertical className="h-4 w-4" />
            </Button>
            {open && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg py-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container cursor-pointer"
                        onClick={() => { onEdit(); setOpen(false); }}
                    >
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 cursor-pointer"
                        onClick={() => { onSend(); setOpen(false); }}
                    >
                        <Send className="h-4 w-4" />
                        Send / Resend
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => { onDelete(); setOpen(false); }}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function AnnouncementCard({ announcement, onEdit, onDelete, onSend }) {
    const { id, title, category, audience, content, status, createdAt, sentAt, author } = announcement;

    const excerpt = content?.length > 120 ? content.slice(0, 120) + '...' : content;

    return (
        <article className="group rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs transition-all hover:border-outline-variant/50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <CategoryBadge category={category} />
                        <AudienceBadge audience={audience} />
                        <StatusBadge status={status} />
                    </div>
                    <h3 className="text-lg font-bold text-on-surface truncate">{title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{excerpt}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            By {author || 'Admin'}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Created: {createdAt ? new Date(createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                        {sentAt && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <Bell className="h-3 w-3" />
                                Sent: {new Date(sentAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        )}
                    </div>
                </div>
                <ActionMenu onEdit={onEdit} onDelete={onDelete} onSend={onSend} />
            </div>
        </article>
    );
}