import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import {
    Bell,
    CheckCircle,
    AlertTriangle,
    Info,
    Trophy,
    MapPin,
    Calendar,
    Eye,
    Trash2,
    Settings
} from 'lucide-react';

interface Notification {
    id: number;
    type: 'report_verified' | 'report_resolved' | 'achievement_unlocked' | 'system_alert' | 'zone_update';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    created_at: string;
}

interface NotificationsPageProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        unread_count: number;
    };
}

export default function NotificationsPage({ notifications }: NotificationsPageProps) {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'report_verified':
            case 'report_resolved':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'achievement_unlocked':
                return <Trophy size={20} className="text-yellow-600" />;
            case 'system_alert':
                return <AlertTriangle size={20} className="text-red-600" />;
            case 'zone_update':
                return <MapPin size={20} className="text-blue-600" />;
            default:
                return <Info size={20} className="text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'report_verified':
            case 'report_resolved':
                return 'border-l-green-500 bg-green-50';
            case 'achievement_unlocked':
                return 'border-l-yellow-500 bg-yellow-50';
            case 'system_alert':
                return 'border-l-red-500 bg-red-50';
            case 'zone_update':
                return 'border-l-blue-500 bg-blue-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'report_verified': return 'Signalement vérifié';
            case 'report_resolved': return 'Signalement résolu';
            case 'achievement_unlocked': return 'Nouveau badge';
            case 'system_alert': return 'Alerte système';
            case 'zone_update': return 'Mise à jour zone';
            default: return 'Notification';
        }
    };

    const handleSelectNotification = (id: number) => {
        setSelectedNotifications(prev => 
            prev.includes(id) 
                ? prev.filter(nId => nId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === notifications.data.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.data.map(n => n.id));
        }
    };

    const handleMarkAsRead = () => {
        // Logique pour marquer comme lu
        console.log('Mark as read:', selectedNotifications);
    };

    const handleDelete = () => {
        // Logique pour supprimer
        console.log('Delete:', selectedNotifications);
    };

    const filteredNotifications = notifications.data.filter(notification => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'unread') return !notification.read;
        if (selectedFilter === 'read') return notification.read;
        return notification.type === selectedFilter;
    });

    return (
        <CitizenLayout title="Notifications">
            <Head title="Notifications" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold eco-text-gradient">
                            Notifications
                        </h1>
                        <p className="text-gray-600">
                            Restez informé de l'évolution de vos signalements
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {notifications.unread_count > 0 && (
                            <EcoBadge variant="danger">
                                {notifications.unread_count} non lues
                            </EcoBadge>
                        )}
                        <EcoButton variant="outline" icon={<Settings size={16} />}>
                            Paramètres
                        </EcoButton>
                    </div>
                </div>

                {/* Filtres et actions */}
                <EcoCard>
                    <EcoCardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Filtres */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: 'Toutes' },
                                    { value: 'unread', label: 'Non lues' },
                                    { value: 'read', label: 'Lues' },
                                    { value: 'report_verified', label: 'Vérifications' },
                                    { value: 'achievement_unlocked', label: 'Badges' },
                                    { value: 'system_alert', label: 'Alertes' },
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setSelectedFilter(filter.value)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            selectedFilter === filter.value
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            {/* Actions groupées */}
                            {selectedNotifications.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">
                                        {selectedNotifications.length} sélectionnée(s)
                                    </span>
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm" 
                                        icon={<Eye size={14} />}
                                        onClick={handleMarkAsRead}
                                    >
                                        Marquer comme lues
                                    </EcoButton>
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm" 
                                        icon={<Trash2 size={14} />}
                                        onClick={handleDelete}
                                    >
                                        Supprimer
                                    </EcoButton>
                                </div>
                            )}
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {notifications.total}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total notifications
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {notifications.unread_count}
                            </div>
                            <div className="text-sm text-gray-600">
                                Non lues
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {notifications.data.filter(n => n.type === 'report_verified' || n.type === 'report_resolved').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Signalements
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {notifications.data.filter(n => n.type === 'achievement_unlocked').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Nouveaux badges
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des notifications */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center justify-between">
                            <span>Notifications ({filteredNotifications.length})</span>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.length === notifications.data.length}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Tout sélectionner</span>
                            </div>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-3">
                            {filteredNotifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    className={`p-4 rounded-lg border-l-4 transition-all cursor-pointer ${
                                        getNotificationColor(notification.type)
                                    } ${
                                        !notification.read ? 'border-2 border-blue-200' : 'border border-gray-200'
                                    }`}
                                    onClick={() => handleSelectNotification(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => handleSelectNotification(notification.id)}
                                            className="mt-1 rounded border-gray-300"
                                            onClick={(e) => e.stopPropagation()}
                                        />

                                        {/* Icône */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {getTypeText(notification.type)}
                                                    </span>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                    <Calendar size={12} />
                                                    <span>{new Date(notification.created_at).toLocaleString('fr-FR')}</span>
                                                </div>
                                                
                                                {notification.data && (
                                                    <div className="flex items-center space-x-2">
                                                        {notification.type === 'achievement_unlocked' && (
                                                            <EcoBadge variant="success" size="sm">
                                                                <Trophy size={10} />
                                                                +{notification.data.points} points
                                                            </EcoBadge>
                                                        )}
                                                        {notification.type === 'report_verified' && (
                                                            <EcoBadge variant="outline" size="sm">
                                                                #{notification.data.report_id}
                                                            </EcoBadge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {notifications.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Affichage de {((notifications.current_page - 1) * notifications.per_page) + 1} à{' '}
                                    {Math.min(notifications.current_page * notifications.per_page, notifications.total)} sur {notifications.total} notifications
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={notifications.current_page === 1}
                                    >
                                        Précédent
                                    </EcoButton>
                                    
                                    <span className="px-3 py-1 text-sm">
                                        Page {notifications.current_page} sur {notifications.last_page}
                                    </span>
                                    
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={notifications.current_page === notifications.last_page}
                                    >
                                        Suivant
                                    </EcoButton>
                                </div>
                            </div>
                        )}

                        {filteredNotifications.length === 0 && (
                            <div className="text-center py-12">
                                <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">
                                    Aucune notification
                                </h3>
                                <p className="text-gray-500">
                                    {selectedFilter === 'all' 
                                        ? "Vous n'avez pas encore de notifications"
                                        : `Aucune notification ${selectedFilter === 'unread' ? 'non lue' : 'de ce type'} trouvée`
                                    }
                                </p>
                            </div>
                        )}
                    </EcoCardContent>
                </EcoCard>
            </div>
        </CitizenLayout>
    );
}
