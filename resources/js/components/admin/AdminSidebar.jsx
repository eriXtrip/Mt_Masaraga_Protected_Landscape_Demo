import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, ShieldCheck, ExternalLink } from 'lucide-react';
import { ADMIN_NAV_GROUPS } from '../../admin/navConfig';
import { MOCK_USERS } from '../../mockData';
import { signOutCurrentUser } from '@/lib/auth';

const ADMIN_USER = MOCK_USERS.find((user) => user.role === 1) || MOCK_USERS[0];

const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function AdminSidebar({ open, onClose }) {
    const [closing, setClosing] = useState(false);
    const [entered, setEntered] = useState(false);
    const closeTimerRef = useRef(null);
    const prevOpenRef = useRef(open);

    const handleLogout = () => {
        signOutCurrentUser();
    };

    // Slide the sidebar in once this page is reached (after navigating to admin).
    useEffect(() => {
        const timer = window.setTimeout(() => setEntered(true), 50);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const wasOpen = prevOpenRef.current;
        prevOpenRef.current = open;

        if (open) {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
            }
            setClosing(false);
            return;
        }

        if (wasOpen) {
            setClosing(true);
            closeTimerRef.current = window.setTimeout(() => setClosing(false), 300);
        }
    }, [open]);

    useEffect(() => () => {
        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
        }
    }, []);

    return (
        <>
            {(open || closing) && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onClose}
                    className={`fixed inset-0 z-30 cursor-pointer bg-inverse-surface/60 lg:hidden ${closing ? 'animate-out fade-out animation-duration-300' : 'animate-in fade-in animation-duration-300'} motion-reduce:animate-none`}
                />
            )}

            <aside
                id="admin-sidebar"
                aria-label="Admin navigation"
                className={`fixed inset-y-4 z-40 flex w-72 max-w-[calc(100vw-2rem)] flex-col rounded-r-2xl bg-secondary text-on-secondary shadow-sm transition-transform duration-500 ease-out ${entered
                    ? 'lg:translate-x-0'
                    : 'lg:-translate-x-full'
                    } ${open
                        ? 'translate-x-0'
                        : '-translate-x-[calc(100%+1rem)]'
                    }`}
            >
                {/* Brand */}
                <div className="flex flex-col gap-1 items-start border-b border-white/10 px-5 py-4">
                    <img
                        src="/assets/logo/MT. MASARAGA LOGO.svg"
                        alt="Mt. Masaraga Protected Landscape"
                        className="h-10 w-auto shrink-0"
                    />
                </div>

                {/* Navigation groups with custom sidebar scrollbar styling */}
                <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] custom-sidebar-scrollbar">
                    {ADMIN_NAV_GROUPS.map((group) => (
                        <div key={group.label}>
                            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-on-secondary/80">
                                {group.label}
                            </p>
                            <ul className="space-y-0.5">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                onClick={onClose}
                                                className={({ isActive }) =>
                                                    `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${isActive
                                                        ? 'bg-white/10 text-on-secondary'
                                                        : 'text-on-secondary/80 hover:bg-white/10 hover:text-on-secondary'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        {isActive && (
                                                            <span
                                                                aria-hidden="true"
                                                                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                                                            />
                                                        )}
                                                        <Icon
                                                            className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive
                                                                ? 'text-on-secondary'
                                                                : 'text-on-secondary/80 group-hover:text-on-secondary'
                                                                }`}
                                                        />
                                                        <span className="truncate">{item.label}</span>
                                                    </>
                                                )}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Account footer */}
                <div className="space-y-3 border-t border-white/10 p-3">
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-600 text-xs font-bold text-white">
                                {getInitials(ADMIN_USER.name)}
                            </span>
                            <div className="min-w-0 leading-tight">
                                <p className="flex items-center gap-1 truncate text-xs font-bold">
                                    {ADMIN_USER.name}
                                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                                </p>
                                <p className="truncate text-[10px] text-on-secondary/80">{ADMIN_USER.subtitle}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Log out of admin console"
                            onClick={handleLogout}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-secondary/70 transition-colors hover:bg-white/10 hover:text-on-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}