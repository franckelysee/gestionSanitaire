import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EcoCard } from './eco-card';
import { EcoButton } from './eco-button';
import { 
    CheckCircle, 
    AlertTriangle, 
    Info, 
    X, 
    Bell,
    Trophy,
    Star
} from 'lucide-react';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'achievement';
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface EcoNotificationProps {
    notification: Notification;
    onClose: (id: string) => void;
}

export function EcoNotification({ notification, onClose }: EcoNotificationProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification.duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose(notification.id);
        }, 300);
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle size={20} className="text-eco-green" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-eco-orange" />;
            case 'error':
                return <AlertTriangle size={20} className="text-eco-red" />;
            case 'achievement':
                return <Trophy size={20} className="text-eco-yellow" />;
            default:
                return <Info size={20} className="text-eco-blue" />;
        }
    };

    const getColorClasses = () => {
        switch (notification.type) {
            case 'success':
                return 'border-eco-green/30 bg-eco-green/5';
            case 'warning':
                return 'border-eco-orange/30 bg-eco-orange/5';
            case 'error':
                return 'border-eco-red/30 bg-eco-red/5';
            case 'achievement':
                return 'border-eco-yellow/30 bg-gradient-to-r from-eco-yellow/5 to-eco-green/5';
            default:
                return 'border-eco-blue/30 bg-eco-blue/5';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'transform transition-all duration-300 ease-out',
                isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            )}
        >
            <EcoCard 
                className={cn(
                    'border-2 shadow-lg max-w-sm',
                    getColorClasses()
                )}
            >
                <div className="p-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground mb-1">
                                {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {notification.message}
                            </p>
                            
                            {notification.action && (
                                <div className="mt-3">
                                    <EcoButton
                                        size="sm"
                                        variant="outline"
                                        onClick={notification.action.onClick}
                                    >
                                        {notification.action.label}
                                    </EcoButton>
                                </div>
                            )}
                        </div>
                        
                        <EcoButton
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="flex-shrink-0 h-6 w-6"
                        >
                            <X size={14} />
                        </EcoButton>
                    </div>
                </div>
            </EcoCard>
        </div>
    );
}

interface EcoNotificationContainerProps {
    notifications: Notification[];
    onClose: (id: string) => void;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function EcoNotificationContainer({ 
    notifications, 
    onClose, 
    position = 'top-right' 
}: EcoNotificationContainerProps) {
    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            default:
                return 'top-4 right-4';
        }
    };

    return (
        <div className={cn(
            'fixed z-50 space-y-3 max-w-sm w-full',
            getPositionClasses()
        )}>
            {notifications.map((notification) => (
                <EcoNotification
                    key={notification.id}
                    notification={notification}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}

// Hook pour gérer les notifications
export function useEcoNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration ?? 5000,
        };
        
        setNotifications(prev => [...prev, newNotification]);
        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const success = (title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'success',
            title,
            message,
            ...options,
        });
    };

    const error = (title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'error',
            title,
            message,
            duration: 7000,
            ...options,
        });
    };

    const warning = (title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'warning',
            title,
            message,
            ...options,
        });
    };

    const info = (title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'info',
            title,
            message,
            ...options,
        });
    };

    const achievement = (title: string, message: string, options?: Partial<Notification>) => {
        return addNotification({
            type: 'achievement',
            title,
            message,
            duration: 8000,
            ...options,
        });
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
        achievement,
    };
}
