import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ExternalLink, Menu } from 'lucide-react';
import StaffSidebar from './StaffSidebar';
import { STAFF_SECTION_FALLBACK, STAFF_SECTIONS } from '../../staff/navConfig';
import { Button } from '@/components/ui/button';
import IdleTimeoutDialog from '@/components/common/IdleTimeoutDialog';
import DemoNoticeBanner from '@/components/common/DemoNoticeBanner';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { signOutCurrentUser } from '@/lib/auth';

export default function StaffLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const { pathname } = useLocation();

    const handleSignOut = useCallback(() => {
        signOutCurrentUser({ redirectTo: '/login' });
    }, []);

    const { isWarningOpen, secondsLeft, totalSeconds, continueSession } = useIdleTimeout({ onTimeout: handleSignOut });

    const section = STAFF_SECTIONS[pathname]
        || (pathname.startsWith('/staff/groups/') ? STAFF_SECTIONS['/staff/groups/:id'] : STAFF_SECTION_FALLBACK);

    const titleText = section?.title ?? 'Park staff';

    const todayLabel = new Intl.DateTimeFormat('en-PH', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(new Date());

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
                menuButtonRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sidebarOpen]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-dvh bg-surface font-sans text-on-surface">
            {/* Inject keyframes directly inline so no external CSS configuration is needed */}
            <style>{`
                @keyframes charIn {
                    0% {
                        opacity: 0;
                        transform: translateY(6px) scale(0.95);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>

            <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Fixed bottom-right corner, so it sits outside the padded column. */}
            <DemoNoticeBanner />

            <div className="lg:pl-76">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-outline-variant/40 bg-surface px-4 md:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button
                            ref={menuButtonRef}
                            variant="ghost"
                            className="h-11! w-11! cursor-pointer lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open staff navigation"
                            aria-controls="staff-sidebar"
                            aria-expanded={sidebarOpen}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Park Staff Console</p>
                            <h1 className="truncate text-base font-bold tracking-tight text-on-surface md:text-lg inline-flex overflow-hidden">
                                {Array.from(titleText).map((char, index) => (
                                    <span
                                        key={`${titleText}-${index}`}
                                        className="inline-block opacity-0"
                                        style={{
                                            animation: 'charIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                                            animationDelay: `${index * 35}ms`,
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))}
                            </h1>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <span className="hidden text-xs font-medium text-on-surface-variant md:inline">{todayLabel}</span>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View site</span>
                        </a>
                    </div>
                </header>

                <main className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
                    <Outlet />
                </main>
            </div>

            <IdleTimeoutDialog
                isOpen={isWarningOpen}
                secondsLeft={secondsLeft}
                totalSeconds={totalSeconds}
                consoleLabel="the staff console"
                onContinue={continueSession}
                onSignOut={handleSignOut}
            />
        </div>
    );
}
