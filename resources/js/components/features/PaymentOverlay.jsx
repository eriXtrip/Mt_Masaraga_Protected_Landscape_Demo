import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Lock,
    ShieldCheck,
    X,
    ArrowRight,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentOverlay({
    isOpen = false,
    paymentMethod = 'GCash',
    amount = 1850.0,
    onClose,
    onComplete,
}) {
    // States: 'idle' | 'processing' | 'success' | 'failed'
    const [status, setStatus] = useState('idle');

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(val);

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
        }
    }, [isOpen]);

    const handleStartPayment = () => {
        setStatus('processing');

        // Simulate Payment Gateway Response after 2.5 seconds
        setTimeout(() => {
            // Set success by default (change to 'failed' to test error handling)
            setStatus('success');
        }, 2500);
    };

    const handleRetry = () => {
        setStatus('idle');
    };

    const handleFinish = () => {
        if (onComplete) onComplete();
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden transition-all">

                {/* Close Icon (Only visible during idle state) */}
                {status === 'idle' && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {/* --- STATE 1: IDLE / CONFIRM PAYMENT --- */}
                {status === 'idle' && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <Lock className="h-8 w-8" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-on-surface">Confirm Payment</h3>
                            <p className="text-sm text-on-surface-variant">
                                You are paying via <strong className="text-on-surface">{paymentMethod}</strong>
                            </p>
                        </div>

                        <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-2 text-left">
                            <div className="flex justify-between text-xs text-on-surface-variant">
                                <span>Transaction Type</span>
                                <span className="font-semibold text-on-surface">Trail Booking</span>
                            </div>
                            <div className="flex justify-between text-xs text-on-surface-variant">
                                <span>Payment Provider</span>
                                <span className="font-semibold text-on-surface">{paymentMethod}</span>
                            </div>
                            <div className="h-px bg-outline-variant/30 w-full my-2" />
                            <div className="flex justify-between text-base font-bold text-on-surface">
                                <span>Total Amount</span>
                                <span className="text-primary text-xl font-black">
                                    {formatCurrency(amount)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span>Your receipt and e-passes will appear after payment.</span>
                        </div>

                        <div className="w-full flex flex-col gap-3 pt-2">
                            <Button
                                size="lg"
                                onClick={handleStartPayment}
                                className="w-full font-bold gap-2 text-base"
                            >
                                <span>Confirm & Pay {formatCurrency(amount)}</span>
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="lg" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* --- STATE 2: PROCESSING ANIMATION --- */}
                {status === 'processing' && (
                    <div className="flex flex-col items-center text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-24 w-24 rounded-full border-4 border-primary/20 animate-ping" />
                            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-on-surface">Processing Payment...</h3>
                            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                                Please do not close this window or navigate away while we secure your booking.
                            </p>
                        </div>
                    </div>
                )}

                {/* --- STATE 3: SUCCESS ANIMATION --- */}
                {status === 'success' && (
                    <div className="flex flex-col items-center text-center py-4 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-full bg-secondary-container text-primary flex items-center justify-center border border-primary/20">
                            <CheckCircle2 className="h-12 w-12" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-on-surface">Payment Successful!</h3>
                            <p className="text-xs text-on-surface-variant">
                                Your booking has been confirmed. A confirmation ticket has been issued.
                            </p>
                        </div>

                        <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-xs space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Reference No:</span>
                                <span className="font-mono font-bold text-on-surface">MSG-{Math.floor(100000 + Math.random() * 900000)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Amount Paid:</span>
                                <span className="font-bold text-on-surface">{formatCurrency(amount)}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            onClick={handleFinish}
                            className="w-full"
                        >
                            View Booking Ticket
                        </Button>
                    </div>
                )}

                {/* --- STATE 4: FAILED ANIMATION --- */}
                {status === 'failed' && (
                    <div className="flex flex-col items-center text-center py-4 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="w-20 h-20 rounded-full bg-error-container text-error flex items-center justify-center border border-error/20">
                            <XCircle className="h-12 w-12" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-on-surface">Payment Failed</h3>
                            <p className="text-xs text-on-surface-variant">
                                Transaction declined by bank or session timed out. Please try again.
                            </p>
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <Button size="lg" onClick={handleRetry} className="w-full gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}