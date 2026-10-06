import { useEffect, useRef } from 'react';
import { Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const URGENT_SECONDS = 10;

export default function IdleTimeoutDialog({
    isOpen,
    secondsLeft = 0,
    totalSeconds = 0,
    consoleLabel = 'this console',
    onContinue,
    onSignOut,
}) {
    const dialogRef = useRef(null);
    const continueButtonRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        continueButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';

        // This dialog has no dismiss affordance, so focus must never escape it.
        const handleKeyDown = (event) => {
            if (event.key !== 'Tab') return;
            const focusable = dialogRef.current?.querySelectorAll('button:not([disabled])');
            if (!focusable?.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    const countdownLabel = minutes > 0 ? `${minutes}:${seconds}` : seconds;
    const isUrgent = secondsLeft > 0 && secondsLeft <= URGENT_SECONDS;
    const remainingPercent = totalSeconds > 0
        ? Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100))
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 p-4 animate-in fade-in duration-200 motion-reduce:animate-none">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="idle-timeout-heading"
                aria-describedby="idle-timeout-description"
                className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-xl motion-reduce:animate-none md:p-6"
            >
                <div className="flex items-start gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error-container text-on-error-container">
                        <Clock className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Session timeout</p>
                        <h2 id="idle-timeout-heading" className="mt-1 text-lg font-bold tracking-tight text-on-surface">
                            Still working?
                        </h2>
                    </div>
                </div>

                <p id="idle-timeout-description" className="mt-4 text-sm leading-relaxed text-on-surface-variant">
                    You have been inactive for a while. To protect the park records, you will be signed out automatically.
                </p>

                <div className="mt-5 rounded-xl bg-surface-container-low px-4 py-3">
                    <p className="flex items-baseline gap-2">
                        <span
                            role="timer"
                            aria-label={`Signing out in ${secondsLeft} seconds`}
                            className={`text-3xl font-bold tabular-nums tracking-tight ${isUrgent ? 'text-error' : 'text-on-surface'}`}
                        >
                            {countdownLabel}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">remaining</span>
                    </p>
                    {totalSeconds > 0 && (
                        <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-on-surface/10">
                            <div
                                className={`h-full rounded-full transition-[width] duration-1000 ease-linear motion-reduce:transition-none ${isUrgent ? 'bg-error' : 'bg-primary'}`}
                                style={{ width: `${remainingPercent}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={onSignOut} className="min-h-11 cursor-pointer gap-2">
                        <LogOut className="h-4 w-4" />
                        Log out now
                    </Button>
                    <Button ref={continueButtonRef} onClick={onContinue} className="min-h-11 cursor-pointer gap-2">
                        Continue session
                    </Button>
                </div>
            </div>
        </div>
    );
}
