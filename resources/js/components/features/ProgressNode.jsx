import React from 'react';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProgressNode({
    step,
    name,
    isActive,
    isCompleted,
    onClick,
    color = 'primary',
    variant = 'node', // 'node' (default) or 'line'
    isLastStep = false,
    activeStepName // Optional: pass current active step name if different from this node's name
}) {
    const getColorClasses = () => {
        if (color === 'primary') {
            return {
                active: 'border-primary bg-primary text-white shadow-sm ring-4 ring-primary/20',
                completed: 'border-primary bg-primary text-white shadow-sm',
                textActive: 'font-semibold text-primary',
                lineActive: 'bg-primary',
                borderAccent: 'border-primary text-on-surface'
            };
        }
        if (color === 'secondary') {
            return {
                active: 'border-secondary bg-secondary text-on-secondary shadow-sm ring-4 ring-secondary/20',
                completed: 'border-secondary bg-secondary text-on-secondary shadow-sm',
                textActive: 'font-semibold text-secondary',
                lineActive: 'bg-secondary',
                borderAccent: 'border-secondary text-on-surface'
            };
        }
        return {
            active: `border-${color} bg-${color} text-white shadow-sm ring-4 ring-${color}/20`,
            completed: `border-${color} bg-${color} text-white shadow-sm`,
            textActive: `font-semibold text-${color}`,
            lineActive: `bg-${color}`,
            borderAccent: `border-${color} text-on-surface`
        };
    };

    const colors = getColorClasses();
    const inactiveClasses = 'border-outline-variant bg-surface-container-lowest text-outline';
    const textInactiveClasses = 'font-medium text-outline';
    const isCurrentOrDone = isActive || isCompleted;

    // 1. Line-only version
    if (variant === 'line') {
        const isFirstStep = step === 1;

        return (
            <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                {/* Progress Bar Line Segment */}
                <div
                    className={`h-1.5 w-full rounded-full transition-colors ${isCurrentOrDone ? colors.lineActive : 'bg-outline-variant/30'
                        }`}
                />

                {/* Step Name label ONLY rendered on the first step slot */}
                {isFirstStep ? (
                    <div className="flex items-center pt-0.5">
                        <div className={`text-xs font-semibold tracking-tight ${colors.borderAccent}`}>
                            <h3 className="whitespace-nowrap text-xs font-bold tracking-tight text-on-surface">
                                {activeStepName || name}
                            </h3>
                        </div>
                    </div>
                ) : (
                    /* Spacer to keep vertical layout equal across steps */
                    <div className="h-5" />
                )}
            </div>
        );
    }

    // 2. Node version (Circular button with connector line)
    return (
        <div className={`flex items-center ${!isLastStep ? 'flex-1' : ''}`}>
            {/* Circle Node & Label */}
            <div className="relative z-10 flex flex-col items-center shrink-0">
                <Button
                    type="button"
                    onClick={onClick}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${isCompleted
                        ? colors.completed
                        : isActive
                            ? colors.active
                            : inactiveClasses
                        }`}
                >
                    {isCompleted ? <Check className="h-4 w-4" /> : step}
                </Button>
                <span
                    className={`absolute top-10 left-1/2 -translate-x-1/2 hidden whitespace-nowrap text-[11px] sm:block ${isCurrentOrDone ? colors.textActive : textInactiveClasses
                        }`}
                >
                    {name}
                </span>
            </div>

            {/* Connecting Line between circular nodes */}
            {!isLastStep && (
                <div className="mx-2 h-0.75 flex-1 rounded-full bg-surface-container-highest overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                </div>
            )}
        </div>
    );
}