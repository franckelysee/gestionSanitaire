import React from 'react';
import { cn } from '@/lib/utils';

interface EcoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient';
    hover?: boolean;
    children: React.ReactNode;
}

export function EcoCard({ 
    className, 
    variant = 'default', 
    hover = true, 
    children, 
    ...props 
}: EcoCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border transition-all duration-300',
                {
                    'eco-card': variant === 'default',
                    'eco-glass': variant === 'glass',
                    'eco-gradient-bg border-border/30': variant === 'gradient',
                    'hover:shadow-xl hover:scale-[1.02]': hover,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface EcoCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function EcoCardHeader({ className, children, ...props }: EcoCardHeaderProps) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        >
            {children}
        </div>
    );
}

interface EcoCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    gradient?: boolean;
}

export function EcoCardTitle({ className, children, gradient = false, ...props }: EcoCardTitleProps) {
    return (
        <h3
            className={cn(
                'text-2xl font-semibold leading-none tracking-tight',
                gradient && 'eco-text-gradient',
                className
            )}
            {...props}
        >
            {children}
        </h3>
    );
}

interface EcoCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}

export function EcoCardDescription({ className, children, ...props }: EcoCardDescriptionProps) {
    return (
        <p
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        >
            {children}
        </p>
    );
}

interface EcoCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function EcoCardContent({ className, children, ...props }: EcoCardContentProps) {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}

interface EcoCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function EcoCardFooter({ className, children, ...props }: EcoCardFooterProps) {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}
