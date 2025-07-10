import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const ecoBadgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'bg-primary/10 text-primary border border-primary/20',
                secondary: 'bg-secondary text-secondary-foreground border border-border/50',
                success: 'eco-badge-low',
                warning: 'eco-badge-medium',
                danger: 'eco-badge-high',
                info: 'bg-eco-blue/10 text-eco-blue border border-eco-blue/20',
                outline: 'text-foreground border border-border',
                glass: 'eco-glass text-foreground',
            },
            size: {
                default: 'px-3 py-1 text-xs',
                sm: 'px-2 py-0.5 text-xs',
                lg: 'px-4 py-1.5 text-sm',
            },
            priority: {
                low: 'eco-badge-low',
                medium: 'eco-badge-medium',
                high: 'eco-badge-high',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface EcoBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof ecoBadgeVariants> {
    icon?: React.ReactNode;
    pulse?: boolean;
}

function EcoBadge({ 
    className, 
    variant, 
    size, 
    priority,
    icon,
    pulse = false,
    children,
    ...props 
}: EcoBadgeProps) {
    // Priority overrides variant
    const finalVariant = priority ? undefined : variant;
    
    return (
        <div
            className={cn(
                ecoBadgeVariants({ variant: finalVariant, size, priority }),
                pulse && 'eco-pulse',
                className
            )}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </div>
    );
}

export { EcoBadge, ecoBadgeVariants };
