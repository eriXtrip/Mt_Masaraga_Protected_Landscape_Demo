import React from 'react';

const fieldClasses = `
    w-full h-10 px-3.5 rounded-lg text-sm font-medium
    bg-surface border border-outline-variant text-on-surface
    placeholder:text-on-surface-variant/50
    focus:border-primary focus:ring-1 focus:ring-primary outline-none
    transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
`;

export const Input = React.forwardRef(({ className = '', type = 'text', ...props }, ref) => {
    return (
        <input
            type={type}
            ref={ref}
            className={`${fieldClasses} ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export const Select = React.forwardRef(({ className = '', children, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={`${fieldClasses} cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </select>
    );
});

Select.displayName = 'Select';