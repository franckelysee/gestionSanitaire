import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const ecoButtonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'eco-button-primary',
                secondary: 'eco-button-secondary',
                outline: 'border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                success: 'bg-eco-green text-white hover:bg-eco-green/90 shadow-lg hover:shadow-xl',
                warning: 'bg-eco-orange text-white hover:bg-eco-orange/90 shadow-lg hover:shadow-xl',
                danger: 'bg-eco-red text-white hover:bg-eco-red/90 shadow-lg hover:shadow-xl',
                glass: 'eco-glass text-foreground hover:bg-background/80',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-lg px-3',
                lg: 'h-12 rounded-xl px-8',
                xl: 'h-14 rounded-xl px-10 text-base',
                icon: 'h-10 w-10',
            },
            animation: {
                none: '',
                pulse: 'eco-pulse',
                bounce: 'hover:eco-bounce',
                scale: 'hover:scale-105 active:scale-95',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            animation: 'scale',
        },
    }
);

export interface EcoButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof ecoButtonVariants> {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const EcoButton = React.forwardRef<HTMLButtonElement, EcoButtonProps>(
    ({ 
        className, 
        variant, 
        size, 
        animation,
        asChild = false, 
        loading = false,
        icon,
        iconPosition = 'left',
        children,
        disabled,
        ...props 
    }, ref) => {
        const Comp = asChild ? Slot : 'button';
        
        return (
            <Comp
                className={cn(ecoButtonVariants({ variant, size, animation, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                )}
                {!loading && icon && iconPosition === 'left' && icon}
                {children}
                {!loading && icon && iconPosition === 'right' && icon}
            </Comp>
        );
    }
);

EcoButton.displayName = 'EcoButton';

export { EcoButton, ecoButtonVariants };
