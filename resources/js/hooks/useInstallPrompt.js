import { useCallback, useEffect, useState } from 'react';

const DISMISSED_KEY = 'hasDismissedInstallPrompt';

function isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstall = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };
        const handleInstalled = () => setDeferredPrompt(null);

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, []);

    const dismiss = useCallback(() => {
        window.localStorage.setItem(DISMISSED_KEY, 'true');
        setDeferredPrompt(null);
    }, []);

    const install = useCallback(async () => {
        if (!deferredPrompt) return;

        // Clear first so a double tap cannot call prompt() twice, which throws.
        setDeferredPrompt(null);
        try {
            await deferredPrompt.prompt();
        } catch {
            return;
        }
        await deferredPrompt.userChoice;
    }, [deferredPrompt]);

    const isVisible = Boolean(deferredPrompt)
        && !isRunningStandalone()
        && !window.localStorage.getItem(DISMISSED_KEY);

    return { isVisible, install, dismiss };
}
