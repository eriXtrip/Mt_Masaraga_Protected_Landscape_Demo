import { Bell, MessageSquare, Users, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from 'cn';

const ICONS = {
    total: MessageSquare,
    sent: Bell,
    draft: MessageSquare,
    audiences: Users,
};

const COLORS = {
    total: 'bg-primary/10 text-primary',
    sent: 'bg-emerald/10 text-emerald-600 dark:text-emerald-400',
    draft: 'bg-amber/10 text-amber-600 dark:text-amber-400',
    audiences: 'bg-purple/10 text-purple-600 dark:text-purple-400',
};

function StatCard({ label, value, icon: Icon, colorKey, trend }) {
    return (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-on-surface">{value}</p>
                    {trend && (
                        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{trend}</p>
                    )}
                </div>
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', COLORS[colorKey])}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function AnnouncementSummary({ announcements }) {
    const total = announcements.length;
    const sent = announcements.filter((a) => a.status === 'sent').length;
    const draft = announcements.filter((a) => a.status === 'draft').length;
    const audiences = new Set(announcements.map((a) => a.audience)).size;

    const thisMonth = announcements.filter((a) => {
        const created = new Date(a.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Announcement statistics">
            <StatCard
                label="Total Announcements"
                value={total}
                icon={ICONS.total}
                colorKey="total"
                trend={thisMonth > 0 ? `+${thisMonth} this month` : null}
            />
            <StatCard
                label="Sent"
                value={sent}
                icon={ICONS.sent}
                colorKey="sent"
            />
            <StatCard
                label="Drafts"
                value={draft}
                icon={ICONS.draft}
                colorKey="draft"
            />
            <StatCard
                label="Audiences Used"
                value={audiences}
                icon={ICONS.audiences}
                colorKey="audiences"
            />
        </div>
    );
}