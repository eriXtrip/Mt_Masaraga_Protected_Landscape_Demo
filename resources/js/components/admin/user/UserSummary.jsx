import { UserCog, User, UserPlus, ShieldCheck } from 'lucide-react';

export default function UserSummary({ users }) {
    const admins = users.filter((u) => u.role === 1).length;
    const staff = users.filter((u) => u.role === 2).length;
    const hikers = users.filter((u) => u.role === 3).length;
    const active = users.filter((u) => u.status === 'Active').length;

    const kpis = [
        {
            icon: UserCog,
            value: String(users.length),
            label: 'Total users',
            sub: `${active} active · ${users.length - active} inactive`,
        },
        {
            icon: ShieldCheck,
            value: String(admins),
            label: 'Admins',
            sub: 'System administrators',
        },
        {
            icon: User,
            value: String(staff),
            label: 'Staff / Guides',
            sub: 'Park staff and accredited guides',
        },
        {
            icon: UserPlus,
            value: String(hikers),
            label: 'Hikers',
            sub: 'Registered hikers',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4" role="region" aria-label="User statistics">
            {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{kpi.label}</p>
                            <p className="mt-1.5 text-2xl font-bold tracking-tight text-on-surface">{kpi.value}</p>
                            {kpi.sub && (
                                <p className="mt-1 text-xs text-on-surface-variant">{kpi.sub}</p>
                            )}
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <kpi.icon className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
