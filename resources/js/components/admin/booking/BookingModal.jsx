import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDrawerTransition } from '@/hooks/useDrawerTransition';

export default function BookingModal({ title, subtitle, onClose, side = 'left', children }) {
    const closeButtonRef = useRef(null);
    const { closing, requestClose, handleAnimationEnd } = useDrawerTransition(onClose);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose();
        };
        window.addEventListener('keydown', onKeyDown);
        closeButtonRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [requestClose]);

    const content = typeof children === 'function' ? children({ requestClose }) : children;

    const isRight = side === 'right';

    return (
        <aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onAnimationEnd={closing ? handleAnimationEnd : undefined}
            className={`fixed inset-y-0 ${isRight ? 'right-0' : 'left-0'} z-40 flex w-full max-w-md flex-col bg-surface-container-lowest shadow-xl ${closing ? `animate-out ${isRight ? 'slide-out-to-right' : 'slide-out-to-left'} animation-duration-300` : `animate-in ${isRight ? 'slide-in-from-right' : 'slide-in-from-left'} animation-duration-300`} motion-reduce:animate-none`}
        >
            <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 px-5 py-4">
                <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight text-on-surface">{title}</h2>
                    {subtitle && <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>}
                </div>
                <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={requestClose}
                    aria-label="Close dialog"
                    className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">{content}</div>
        </aside>
    );
}