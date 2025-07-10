import React from 'react';
import { cn } from '@/lib/utils';

interface EcoProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showValue?: boolean;
    label?: string;
    className?: string;
    animated?: boolean;
}

export function EcoProgress({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showValue = false,
    label,
    className,
    animated = true,
}: EcoProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };
    
    const variantClasses = {
        default: 'bg-eco-green',
        success: 'bg-eco-green',
        warning: 'bg-eco-orange',
        danger: 'bg-eco-red',
    };
    
    return (
        <div className={cn('space-y-2', className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center text-sm">
                    {label && <span className="font-medium">{label}</span>}
                    {showValue && (
                        <span className="text-muted-foreground">
                            {value}/{max}
                        </span>
                    )}
                </div>
            )}
            <div className={cn(
                'w-full bg-muted rounded-full overflow-hidden',
                sizeClasses[size]
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        variantClasses[variant],
                        animated && 'animate-pulse'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

interface EcoCircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    showValue?: boolean;
    label?: string;
    className?: string;
}

export function EcoCircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'default',
    showValue = true,
    label,
    className,
}: EcoCircularProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const variantColors = {
        default: 'stroke-eco-green',
        success: 'stroke-eco-green',
        warning: 'stroke-eco-orange',
        danger: 'stroke-eco-red',
    };
    
    return (
        <div className={cn('flex flex-col items-center space-y-2', className)}>
            <div className="relative">
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="none"
                        className="text-muted/20"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={cn(
                            'transition-all duration-500 ease-out',
                            variantColors[variant]
                        )}
                    />
                </svg>
                {showValue && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold eco-text-gradient">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
            </div>
            {label && (
                <span className="text-sm font-medium text-center">{label}</span>
            )}
        </div>
    );
}
