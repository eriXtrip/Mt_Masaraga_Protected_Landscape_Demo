import React from 'react';
import { MoreVertical, Edit2, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getInitials } from '../booking/bookingUtils';

const ROLE_BADGES = {
    Admin: 'bg-primary/10 text-primary border-primary/20',
    Staff: 'bg-blue-50 text-blue-700 border-blue-200',
    Hiker: 'bg-green-50 text-green-700 border-green-200',
};

const STATUS_STYLES = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Inactive: 'bg-red-50 text-red-700 border-red-200',
};

const LABEL_MAP = {
    bookings: 'Bookings',
    trails: 'Trails',
    guides: 'Guides',
    payments: 'Payments',
    content: 'Content',
    announcements: 'Announcements',
    reports: 'Reports',
};

function ActionMenu({ user, onEdit, onDelete, onToggleStatus }) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(!open)} aria-label="More options" className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <MoreVertical className="h-4 w-4" />
            </Button>
            {open && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg py-1.5 animate-in fade-in-0 zoom-in-95 duration-150">
                    <Button variant="ghost" className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container cursor-pointer" onClick={() => { onEdit(); setOpen(false); }}>
                        <Edit2 className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container cursor-pointer" onClick={() => { onToggleStatus(); setOpen(false); }}>
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => { onDelete(); setOpen(false); }}>
                        <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function UserCard({ user, onEdit, onDelete, onToggleStatus }) {
    const role = user.role === 1 ? 'Admin' : user.role === 2 ? 'Staff' : 'Hiker';

    return (
        <article className="group rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs transition-all hover:border-outline-variant/50 hover:shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {getInitials(user.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="truncate text-sm font-bold text-on-surface">{user.name}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${ROLE_BADGES[role] || ''}`}>
                                {role}
                            </span>
                        </div>
                        <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                        <p className="text-xs text-on-surface-variant">{user.subtitle || ''}</p>
                        {role === 'Staff' && user.permissions?.length > 0 && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                                <Shield className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-semibold text-primary">
                                    {user.permissions.length} module{user.permissions.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold border ${STATUS_STYLES[user.status] || ''}`}>
                        {user.status}
                    </span>
                    <ActionMenu user={user} onEdit={() => onEdit?.(user)} onDelete={() => onDelete?.(user.id)} onToggleStatus={() => onToggleStatus?.(user)} />
                </div>
            </div>
        </article>
    );
}
