import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function AdminAuthModal({ isOpen, onClose, user, onConfirm }) {
    // Determine target PIN length dynamically based on mock user data (defaults to 4 if unspecified)
    const expectedPin = user?.secondaryPin || '1234';
    const pinLength = expectedPin.length;

    const [pin, setPin] = useState(Array(pinLength).fill(''));
    const [error, setError] = useState('');
    const otpRefs = useRef([]);

    // Reset state & auto-focus first box on open
    useEffect(() => {
        if (isOpen) {
            setPin(Array(pinLength).fill(''));
            setError('');
            setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen, pinLength]);

    if (!isOpen) return null;

    const handleOtpChange = (index, value) => {
        const cleanVal = value.replace(/[^0-9]/g, '');
        if (!cleanVal && value !== '') return;

        const newPin = [...pin];
        newPin[index] = cleanVal.slice(-1);
        setPin(newPin);
        setError('');

        if (cleanVal && index < pinLength - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, pinLength);
        if (!pastedData) return;

        const newPin = [...pin];
        pastedData.split('').forEach((char, i) => {
            newPin[i] = char;
        });
        setPin(newPin);
        setError('');

        const nextFocusIndex = Math.min(pastedData.length, pinLength - 1);
        otpRefs.current[nextFocusIndex]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredPin = pin.join('');

        if (enteredPin.length < pinLength) {
            setError(`Please enter the full ${pinLength}-digit security PIN.`);
            return;
        }

        if (enteredPin !== expectedPin) {
            setError('Invalid secondary security PIN. Please try again.');
            return;
        }

        onConfirm(enteredPin);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 px-4 sm:pt-16 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface-container-lowest border border-amber-500/30 p-6 shadow-2xl space-y-5 animate-in slide-in-from-top-6 duration-200">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-on-secondary-fixed-variant text-inverse-on-surface dark:text-amber-400 shrink-0">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-on-surface leading-tight">
                                Admin Authentication
                            </h3>
                            <p className="text-xs font-medium text-on-surface-variant">
                                Requires secondary PIN code
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-variant/40 transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>

                        {/* PIN Inputs Array */}
                        <div className="flex justify-center items-center gap-2" onPaste={handlePaste}>
                            {pin.map((val, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { otpRefs.current[i] = el; }}
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={val}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    placeholder="·"
                                    className={`h-11 w-9 rounded-lg border-2 bg-surface-container-lowest text-center text-lg font-bold text-on-surface transition-all focus:ring-2 focus:ring-primary focus:outline-none sm:h-12 sm:w-10 ${val ? 'border-primary' : 'border-outline-variant'
                                        }`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="mt-3 text-center text-xs font-semibold text-red-500">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/40">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={onClose}
                            className="cursor-pointer font-semibold rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            size="lg"
                        >
                            <span>Verify & Login</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}