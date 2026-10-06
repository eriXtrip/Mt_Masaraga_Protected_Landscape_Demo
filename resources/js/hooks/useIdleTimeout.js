import { useCallback, useEffect, useRef, useState } from 'react';

export const IDLE_WARNING_MS = 30 * 60 * 1000;
export const IDLE_COUNTDOWN_MS = 60 * 1000;

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'focus'];

/**
 * Warns after `idleMs` of inactivity, then counts down `warningMs` before firing
 * `onTimeout`. Activity is deliberately ignored while the warning is open: a
 * stray mouse movement must not silently dismiss a security prompt.
 *
 * `totalSeconds` is the full countdown length, so the dialog can show how much of
 * the warning window is left without knowing `warningMs` itself.
 */
export function useIdleTimeout({
    idleMs = IDLE_WARNING_MS,
    warningMs = IDLE_COUNTDOWN_MS,
    onTimeout,
} = {}) {
    const totalSeconds = Math.max(1, Math.ceil(warningMs / 1000));
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

    const onTimeoutRef = useRef(onTimeout);
    const idleTimerRef = useRef(null);
    const countdownRef = useRef(null);
    const deadlineRef = useRef(0);
    const isWarningOpenRef = useRef(false);

    onTimeoutRef.current = onTimeout;

    const clearTimers = useCallback(() => {
        if (idleTimerRef.current !== null) {
            window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
        if (countdownRef.current !== null) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, []);

    const startCountdown = useCallback(() => {
        deadlineRef.current = Date.now() + warningMs;
        isWarningOpenRef.current = true;
        setIsWarningOpen(true);
        setSecondsLeft(totalSeconds);

        countdownRef.current = window.setInterval(() => {
            const remaining = deadlineRef.current - Date.now();
            if (remaining <= 0) {
                clearTimers();
                isWarningOpenRef.current = false;
                setIsWarningOpen(false);
                setSecondsLeft(0);
                onTimeoutRef.current?.();
                return;
            }
            setSecondsLeft(Math.ceil(remaining / 1000));
        }, 250);
    }, [clearTimers, totalSeconds, warningMs]);

    const scheduleIdleWarning = useCallback(() => {
        clearTimers();
        idleTimerRef.current = window.setTimeout(startCountdown, idleMs);
    }, [clearTimers, idleMs, startCountdown]);

    const continueSession = useCallback(() => {
        isWarningOpenRef.current = false;
        deadlineRef.current = 0;
        setIsWarningOpen(false);
        setSecondsLeft(totalSeconds);
        scheduleIdleWarning();
    }, [scheduleIdleWarning, totalSeconds]);

    useEffect(() => {
        scheduleIdleWarning();

        const handleActivity = () => {
            if (isWarningOpenRef.current) return;
            scheduleIdleWarning();
        };

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, handleActivity, { passive: true });
        });

        return () => {
            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, handleActivity);
            });
            clearTimers();
        };
    }, [clearTimers, scheduleIdleWarning]);

    return { isWarningOpen, secondsLeft, totalSeconds, continueSession };
}
