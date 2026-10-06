import { useEffect, useRef, useState } from 'react';
import { Ban, ChevronDown, ChevronUp, KeyRound, TriangleAlert } from 'lucide-react';
import { MOCK_USERS } from '../../mockData';

const STORAGE_KEY = 'masaraga_demo_notice_expanded';

const STEPS = [
    {
        title: 'Front-end only',
        body: 'Not every feature is fully functional. Email confirmation, validation, and data saving are simulated.',
    },
    {
        title: 'Opening a console',
        body: 'Go to the /login page and use one of the demo accounts below. Any password is accepted — the email decides which console opens.',
    },
    {
        title: 'Data stays in this browser',
        body: 'Anything you add as admin is stored in this browser only. It does not survive a refresh and will not appear in another browser.',
    },
    {
        title: 'Verification codes',
        body: 'Sign Up and Forgot Password both ask for a 6-digit code. Email delivery is not active, so enter any 6 digits to continue. The admin console also asks for a 6-digit security PIN.',
    },
];

const NOT_AVAILABLE = [
    'Email confirmation and verification codes',
    'QR Code Scanning',
    'Server-side data validation',
    'Persistent data saving (data is only stored locally in your browser)',
    'Real booking, payment, and pass issuance end-to-end',
    'Any other feature that depends on a live backend server',
];

// Login never reads the stored password (see pages/loginSignup/login.jsx), so the
// panel advertises "any password" instead of the seeded values. Pull the rest from
// MOCK_USERS so the listed accounts cannot drift from the ones that exist.
const ACCOUNTS = [
    MOCK_USERS.find((user) => user.role === 1),
    MOCK_USERS.find((user) => user.role === 2),
].filter(Boolean);

// Floating corner widget: a collapsed pill in the bottom right that expands
// upward into the instructions. Kept below the toast layer (z-50 in ui/toast.jsx)
// so transient feedback is never hidden behind it.
export default function DemoNoticeBanner() {
    const [expanded, setExpanded] = useState(() => {
        try {
            return window.localStorage.getItem(STORAGE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const toggleRef = useRef(null);
    const panelRef = useRef(null);

    const toggleExpanded = () => {
        const next = !expanded;
        setExpanded(next);

        try {
            window.localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
            // Private browsing can refuse writes; the panel still toggles.
        }
    };

    // Escape collapses the panel and returns focus to the pill that opened it.
    useEffect(() => {
        if (!expanded) return undefined;

        const onKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            setExpanded(false);
            try {
                window.localStorage.setItem(STORAGE_KEY, 'false');
            } catch {
                // Ignore storage failures; the panel still collapses.
            }
            toggleRef.current?.focus();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [expanded]);

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end sm:inset-x-auto sm:bottom-0 sm:right-4 pr-3 sm:p-0">
            <div className="pointer-events-auto flex w-full flex-col items-stretch gap-2 sm:w-96 sm:max-w-full">
                {/* Instructions, growing upward from the pill. */}
                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                >
                    <div className="min-h-0 overflow-hidden">
                        <section
                            ref={panelRef}
                            id="demo-notice-panel"
                            inert={!expanded}
                            aria-hidden={!expanded}
                            aria-label="How to try this demo"
                            className="max-h-[min(34rem,70dvh)] overflow-y-auto rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-amber-950 shadow-lg shadow-black/10 dark:border-amber-800/70 dark:bg-amber-950 dark:text-amber-50"
                        >
                            <p className="flex items-start gap-2 text-xs leading-snug">
                                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                                <span>
                                    <span className="font-bold uppercase tracking-wider">Demo build.</span>{' '}
                                    This is a front-end only demo. The following will not work or may fail without a
                                    complete, properly configured backend.
                                </span>
                            </p>

                            <h2 className="mt-4 text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                                How to try this demo
                            </h2>
                            <ol className="mt-2.5 space-y-2.5">
                                {STEPS.map((step, index) => (
                                    <li key={step.title} className="flex gap-2.5">
                                        <span
                                            aria-hidden="true"
                                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-[10px] font-bold text-amber-50 dark:bg-amber-200 dark:text-amber-950"
                                        >
                                            {index + 1}
                                        </span>
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-bold">{step.title}.</span>{' '}
                                            <span className="text-amber-900/90 dark:text-amber-100/90">{step.body}</span>
                                        </p>
                                    </li>
                                ))}
                                <li className="flex gap-2.5">
                                    <span
                                        aria-hidden="true"
                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-[10px] font-bold text-amber-50 dark:bg-amber-200 dark:text-amber-950"
                                    >
                                        {STEPS.length + 1}
                                    </span>
                                    <p className="text-xs leading-relaxed">
                                        <span className="font-bold">Live demo.</span>{' '}
                                        <a
                                            href="/"
                                            className="font-semibold underline underline-offset-2 transition-colors hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 dark:hover:text-amber-200"
                                        >
                                            Open the public site
                                        </a>{' '}
                                        <span className="text-amber-900/90 dark:text-amber-100/90">
                                            to explore the hiker-facing pages.
                                        </span>
                                        {" "}
                                        <span className="text-amber-900/90 dark:text-amber-100/90">
                                            To login to an account
                                        </span>
                                        {" "}
                                        <a
                                            href="/login"
                                            className="font-semibold underline underline-offset-2 transition-colors hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 dark:hover:text-amber-200"
                                        >
                                            Open the Login page
                                        </a>{' '}
                                    </p>
                                </li>
                            </ol>

                            <h2 className="mt-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                                Demo accounts
                            </h2>
                            <ul className="mt-2.5 space-y-2">
                                {ACCOUNTS.map((account) => (
                                    <li
                                        key={account.id}
                                        className="select-all rounded-xl border border-amber-300/80 bg-amber-100/70 px-3 py-2 dark:border-amber-800/80 dark:bg-amber-900/40"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100">
                                                {account.subtitle}
                                            </span>
                                            <span className="font-mono text-xs text-amber-900/90 dark:text-amber-100/90">
                                                {account.email}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-100/80">
                                            Password: any. Security PIN:{' '}
                                            <span className="font-mono font-semibold">
                                                {account.secondaryPin || 'none'}
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <h2 className="mt-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                                Will not work in this demo
                            </h2>
                            <ul className="mt-2.5 space-y-1.5">
                                {NOT_AVAILABLE.map((item) => (
                                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                                        <span aria-hidden="true">&mdash;</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-3 text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                                These screens and flows are present in the UI for demonstration purposes only.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Pill: always visible so the demo caveat is never missed. */}
                <button
                    ref={toggleRef}
                    type="button"
                    onClick={toggleExpanded}
                    aria-expanded={expanded}
                    aria-controls="demo-notice-panel"
                    className="pointer-events-auto inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 self-end rounded-t-xl border border-amber-400/80 bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-950 shadow-lg shadow-black/10 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none dark:border-amber-300/50 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-surface"
                >
                    Demo
                    {expanded ? (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
}
