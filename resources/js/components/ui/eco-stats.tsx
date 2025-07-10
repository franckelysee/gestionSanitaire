import React from 'react';
import { cn } from '@/lib/utils';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from './eco-card';

interface EcoStatsProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
        period?: string;
    };
    icon?: React.ReactNode;
    color?: 'green' | 'blue' | 'orange' | 'red' | 'yellow';
    className?: string;
    loading?: boolean;
}

export function EcoStats({ 
    title, 
    value, 
    change, 
    icon, 
    color = 'green',
    className,
    loading = false
}: EcoStatsProps) {
    const colorClasses = {
        green: 'text-eco-green bg-eco-green/10 border-eco-green/20',
        blue: 'text-eco-blue bg-eco-blue/10 border-eco-blue/20',
        orange: 'text-eco-orange bg-eco-orange/10 border-eco-orange/20',
        red: 'text-eco-red bg-eco-red/10 border-eco-red/20',
        yellow: 'text-eco-yellow bg-eco-yellow/10 border-eco-yellow/20',
    };

    if (loading) {
        return (
            <EcoCard className={cn('animate-pulse', className)}>
                <EcoCardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-8 w-8 bg-muted rounded-lg"></div>
                    </div>
                </EcoCardHeader>
                <EcoCardContent>
                    <div className="h-8 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                </EcoCardContent>
            </EcoCard>
        );
    }

    return (
        <EcoCard className={cn('eco-fade-in', className)}>
            <EcoCardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <EcoCardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </EcoCardTitle>
                    {icon && (
                        <div className={cn(
                            'p-2 rounded-lg border',
                            colorClasses[color]
                        )}>
                            {icon}
                        </div>
                    )}
                </div>
            </EcoCardHeader>
            <EcoCardContent>
                <div className="text-2xl font-bold eco-text-gradient">
                    {value}
                </div>
                {change && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <span className={cn(
                            'flex items-center gap-1',
                            change.type === 'increase' ? 'text-eco-green' : 'text-eco-red'
                        )}>
                            {change.type === 'increase' ? '↗' : '↘'}
                            {Math.abs(change.value)}%
                        </span>
                        {change.period && (
                            <span>depuis {change.period}</span>
                        )}
                    </div>
                )}
            </EcoCardContent>
        </EcoCard>
    );
}

interface EcoStatsGridProps {
    children: React.ReactNode;
    className?: string;
}

export function EcoStatsGrid({ children, className }: EcoStatsGridProps) {
    return (
        <div className={cn(
            'grid gap-4 md:grid-cols-2 lg:grid-cols-4',
            className
        )}>
            {children}
        </div>
    );
}
