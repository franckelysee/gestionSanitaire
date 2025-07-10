import React from 'react';
import { cn } from '@/lib/utils';

export interface EcoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    error?: string;
    label?: string;
    helper?: string;
    variant?: 'default' | 'glass' | 'minimal';
}

const EcoInput = React.forwardRef<HTMLInputElement, EcoInputProps>(
    ({ 
        className, 
        type = 'text',
        icon,
        iconPosition = 'left',
        error,
        label,
        helper,
        variant = 'default',
        ...props 
    }, ref) => {
        const inputClasses = cn(
            'flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            {
                'eco-input': variant === 'default',
                'eco-glass border-glass-border': variant === 'glass',
                'border-0 bg-transparent focus:bg-background/50': variant === 'minimal',
                'border-eco-red focus:ring-eco-red/20': error,
                'pl-10': icon && iconPosition === 'left',
                'pr-10': icon && iconPosition === 'right',
            },
            className
        );

        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && iconPosition === 'left' && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={inputClasses}
                        ref={ref}
                        {...props}
                    />
                    {icon && iconPosition === 'right' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-eco-red">{error}</p>
                )}
                {helper && !error && (
                    <p className="text-sm text-muted-foreground">{helper}</p>
                )}
            </div>
        );
    }
);

EcoInput.displayName = 'EcoInput';

export { EcoInput };
