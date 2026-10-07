import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronDown,
    LogOut,
    Menu,
    ShieldCheck,
    MessageSquare,
    LayoutDashboard,
    CalendarDays,
    ScanLine,
    Search,
    Ticket,
    X
} from 'lucide-react';
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

import { MOCK_USERS } from '../../mockData';

const ADMIN_ROLE = 1;
const HIKER_ROLE = 3;

const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Help', to: '/help' },
    { label: 'Find my climb', to: '/lookup' },
    { label: 'Contact Us', to: '/contact' },
];

const ACCOUNT_NAV = {
    [ADMIN_ROLE]: {
        label: 'Admin workspace',
        links: [
            { label: 'Admin console', to: '/admin/dashboard', icon: LayoutDashboard },
        ],
    },
    2: {
        label: 'Staff workspace',
        links: [
            { label: 'Staff dashboard', to: '/staff/dashboard', icon: LayoutDashboard },
            { label: 'My schedules', to: '/staff/schedules', icon: CalendarDays },
            { label: 'Pass verification', to: '/staff/verify', icon: ScanLine },
            { label: 'Staff messages', to: '/staff/messages', icon: MessageSquare },
        ],
    },
    [HIKER_ROLE]: {
        label: 'Hiker account',
        links: [
            { label: 'Find my climb', to: '/lookup', icon: Search },
            { label: 'My Digital Passes', to: '/hiker/passes', icon: Ticket },
        ],
    },
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function AccountNavLink({ item, onClick, mobile = false }) {
    const location = useLocation();
    const IconComponent = item.icon;

    const content = (
        <>
            <IconComponent className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item.label}</span>
        </>
    );

    // Dynamic class generator matching your reference pattern
    const getClassName = (isActive) => {
        const baseClasses = mobile
            ? 'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            : 'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

        const stateClasses = isActive
            ? 'bg-on-secondary-container/20 sm:bg-surface-container text-on-primary-container sm:text-on-surface'
            : mobile
                ? 'text-white hover:bg-surface-container'
                : 'text-on-surface hover:bg-surface-container';

        return `${baseClasses} ${stateClasses}`;
    };

    // External or non-router links (/staff, /admin) using standard <a> tag
    if (item.to.startsWith('/staff') || item.to.startsWith('/admin')) {
        const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

        return (
            <a href={item.to} onClick={onClick} className={getClassName(isActive)}>
                {content}
            </a>
        );
    }

    // Router links using NavLink
    return (
        <NavLink
            to={item.to}
            onClick={onClick}
            className={({ isActive }) => getClassName(isActive)}
        >
            {content}
        </NavLink>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { pathname } = useLocation();

    // Only a stored session logs someone in; there is no default account.
    const [currentUser, setCurrentUser] = useState(null);
    const isLoggedIn = Boolean(currentUser);
    const account = ACCOUNT_NAV[currentUser?.role] ?? ACCOUNT_NAV[HIKER_ROLE];

    const userDropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const readStoredUser = () => {
            try {
                const stored = window.localStorage.getItem('currentUser');
                if (!stored) {
                    setCurrentUser(null);
                    return;
                }

                const parsedUser = JSON.parse(stored);
                setCurrentUser(MOCK_USERS.find((user) => user.id === parsedUser?.id) || null);
            } catch {
                setCurrentUser(null);
            }
        };

        readStoredUser();
        window.addEventListener('storage', readStoredUser);
        return () => window.removeEventListener('storage', readStoredUser);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== 'Escape') return;
            setUserDropdownOpen(false);
            setOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        setOpen(false);
        setUserDropdownOpen(false);
    }, [pathname]);

    const closeAll = () => {
        setOpen(false);
        setUserDropdownOpen(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        closeAll();
        navigate('/');
    };

    return (
        <header className={`sticky top-0 z-50 w-full animate-in border-b bg-on-background fade-in slide-in-from-top-2 duration-300 transition-shadow motion-reduce:animate-none ${isScrolled ? 'border-white/15 shadow-lg shadow-black/15' : 'border-white/10'}`}>
            <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

                {/* Logo / Brand */}
                <Link
                    to="/"
                    className="flex h-full shrink-0 items-center"
                    onClick={closeAll}
                >
                    <img
                        src="/assets/logo/MT. MASARAGA LOGO.svg"
                        alt="Mt. Masaraga Protected Landscape"
                        className="h-9 w-auto object-contain lg:h-11"
                    />
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `group relative rounded-lg px-3 py-2 text-sm transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-300 after:ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inverse-on-surface/60 motion-reduce:after:transition-none ${isActive
                                        ? 'text-inverse-on-surface after:scale-x-100'
                                        : 'text-inverse-on-surface/70 after:scale-x-0 hover:text-inverse-on-surface hover:after:scale-x-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Auth Actions / User Profile — hidden while the public pass lookup is the primary path */}
                {/*
                <div className="hidden items-center gap-2 md:flex">
                    {isLoggedIn ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen((prev) => !prev)}
                                aria-haspopup="true"
                                aria-expanded={userDropdownOpen}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inverse-on-surface/60"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-semibold text-on-primary-container">
                                    {getInitials(currentUser.name)}
                                </span>
                                <span className="hidden max-w-32 truncate text-sm font-medium text-inverse-on-surface lg:block">
                                    {currentUser.name}
                                </span>
                                {currentUser.role === ADMIN_ROLE && (
                                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary-fixed" aria-hidden="true" />
                                )}
                                <ChevronDown
                                    aria-hidden="true"
                                    className={`h-4 w-4 shrink-0 text-inverse-on-surface/60 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {userDropdownOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-in rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-1.5 shadow-lg shadow-black/10 fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
                                    <div className="border-b border-outline-variant/30 px-3 py-2.5">
                                        <p className="truncate text-sm font-semibold text-on-surface">{currentUser.name}</p>
                                        <p className="mt-0.5 truncate text-xs text-on-surface-variant">{currentUser.subtitle}</p>
                                    </div>

                                    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        {account.label}
                                    </p>
                                    <ul className="space-y-0.5">
                                        {account.links.map((item) => (
                                            <li key={item.to}>
                                                <AccountNavLink item={item} onClick={closeAll} />
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-t border-outline-variant/30 px-3 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
                                    >
                                        <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeAll}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-inverse-on-surface/80 transition-colors hover:bg-white/10 hover:text-inverse-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inverse-on-surface/60"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                onClick={closeAll}
                                className={cn(
                                    buttonVariants({ variant: 'default', size: 'lg' }),
                                    'bg-primary-container text-on-primary-container hover:bg-primary-fixed hover:text-on-primary-fixed'
                                )}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
                */}

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-inverse-on-surface/80 transition-colors hover:bg-white/10 hover:text-inverse-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inverse-on-surface/60 md:hidden"
                >
                    {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </button>
            </nav>

            {/* Mobile Menu Drawer */}
            <div
                id="mobile-nav"
                inert={!open}
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
            >
                <div className="overflow-hidden">
                    <ul className="flex flex-col gap-1 px-4 py-4">
                        {isLoggedIn && (
                            <li className="mb-2 flex items-center gap-3 border-b border-outline-variant/30 px-1 pb-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-semibold text-on-primary-container">
                                    {getInitials(currentUser.name)}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">{currentUser.name}</p>
                                    <p className="truncate text-xs text-white">{currentUser.subtitle}</p>
                                </div>
                            </li>
                        )}

                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    onClick={closeAll}
                                    className={({ isActive }) =>
                                        `flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
                                            ? 'bg-on-secondary-container/50 text-on-primary-container'
                                            : 'text-white hover:bg-surface-container'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}

                        {isLoggedIn && (
                            <li className="border-t border-outline-variant/30 pt-3">
                                <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                                    {account.label}
                                </p>
                                <ul>
                                    {account.links.map((item) => (
                                        <li key={item.to}>
                                            <AccountNavLink item={item} onClick={closeAll} mobile />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )}

                        {/* <li className="mt-2 border-t border-outline-variant/30 pt-4">
                            {isLoggedIn ? (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleLogout}
                                    className="min-h-11 w-full border-outline-variant text-error hover:bg-error/10 hover:text-error"
                                >
                                    Log out
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/login"
                                        onClick={closeAll}
                                        className={cn(
                                            buttonVariants({ variant: 'outline', size: 'lg' }),
                                            'min-h-11 border-outline-variant bg-transparent text-white sm:text-on-surface hover:bg-surface-container'
                                        )}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={closeAll}
                                        className={cn(
                                            buttonVariants({ variant: 'default', size: 'lg' }),
                                            'min-h-11 bg-primary text-on-secondary hover:bg-primary-container'
                                        )}
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </li> */}
                    </ul>
                </div>
            </div>
        </header>
    );
}
