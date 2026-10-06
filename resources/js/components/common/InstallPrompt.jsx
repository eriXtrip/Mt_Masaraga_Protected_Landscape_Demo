import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

// The only way to drop Android's browser address bar and toolbar is to launch the
// site as an installed app, so this bar only appears when the browser reports the
// app as installable, and it stays dismissed once the visitor says no.
export default function InstallPrompt() {
    const { isVisible, install, dismiss } = useInstallPrompt();

    if (!isVisible) return null;

    return (
        // Sits above the demo pill in the same corner (see DemoNoticeBanner), which
        // is always on screen, so bottom-4 would cover these buttons.
        <div className="pointer-events-none fixed inset-x-4 bottom-20 z-40 mx-auto w-auto max-w-sm pb-[env(safe-area-inset-bottom)] sm:left-auto sm:right-4 sm:mx-0">
            <section aria-label="Install Mt. Masaraga app" className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-lg">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Download className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-on-surface">Add Mt. Masaraga to your home screen</h2>
                    <p className="mt-1 text-xs leading-snug text-on-surface-variant">
                        It opens without the browser address bar and toolbar, so your pass and the trail details get the whole screen.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <Button type="button" size="lg" onClick={install} className="min-h-11 flex-1 cursor-pointer gap-2">
                            <Download className="h-4 w-4" aria-hidden="true" />
                            Install app
                        </Button>
                        <Button type="button" variant="outline" size="lg" onClick={dismiss} className="min-h-11 cursor-pointer">
                            Not now
                        </Button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss install prompt"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </section>
        </div>
    );
}
