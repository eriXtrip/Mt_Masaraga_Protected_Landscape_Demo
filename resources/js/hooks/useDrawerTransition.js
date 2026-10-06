import { useCallback, useEffect, useRef, useState } from 'react';

export function useDrawerTransition(onClose, duration = 300) {
    const [closing, setClosing] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }
    }, []);

    const requestClose = useCallback(() => {
        if (timerRef.current) {
            return;
        }

        timerRef.current = window.setTimeout(onClose, duration);
        setClosing(true);
    }, [duration, onClose]);

    const handleAnimationEnd = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
            onClose();
        }
    }, [onClose]);

    return { closing, requestClose, handleAnimationEnd };
}