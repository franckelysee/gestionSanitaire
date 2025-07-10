import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { 
    Settings, 
    Save,
    Bell,
    Globe,
    Shield,
    Database,
    Mail,
    Smartphone,
    AlertTriangle,
    Clock,
    Palette,
    Users,
    MapPin
} from 'lucide-react';

interface SettingsData {
    system: {
        app_name: string;
        app_version: string;
        timezone: string;
        language: string;
    };
    notifications: {
        email_enabled: boolean;
        sms_enabled: boolean;
        push_enabled: boolean;
    };
    thresholds: {
        critical_fill_level: number;
        warning_fill_level: number;
        max_response_time: number;
    };
}

interface SettingsPageProps {
    settings: SettingsData;
}

export default function SettingsPage({ settings }: SettingsPageProps) {
    const [formData, setFormData] = useState(settings);
    const [activeTab, setActiveTab] = useState('system');

    const handleInputChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof SettingsData],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        // Logique de sauvegarde
        console.log('Saving settings:', formData);
    };

    const tabs = [
        { id: 'system', name: 'Système', icon: Settings },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'thresholds', name: 'Seuils d\'Alerte', icon: AlertTriangle },
        { id: 'security', name: 'Sécurité', icon: Shield },
        { id: 'appearance', name: 'Apparence', icon: Palette },
    ];

    return (
        <AdminLayout title="Paramètres Système">
            <Head title="Paramètres Système" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Paramètres Système
                        </h1>
                        <p className="text-gray-600">
                            Configurez les paramètres globaux de l'application
                        </p>
                    </div>
                    
                    <EcoButton icon={<Save size={16} />} onClick={handleSave}>
                        Sauvegarder
                    </EcoButton>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Navigation des onglets */}
                    <div className="lg:col-span-1">
                        <EcoCard>
                            <EcoCardContent className="p-4">
                                <nav className="space-y-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <tab.icon size={18} />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    ))}
                                </nav>
                            </EcoCardContent>
                        </EcoCard>
                    </div>

                    {/* Contenu des onglets */}
                    <div className="lg:col-span-3">
                        {/* Onglet Système */}
                        {activeTab === 'system' && (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center space-x-2">
                                        <Settings size={20} />
                                        <span>Configuration Système</span>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom de l'Application
                                            </label>
                                            <EcoInput
                                                value={formData.system.app_name}
                                                onChange={(e) => handleInputChange('system', 'app_name', e.target.value)}
                                                placeholder="EcoSmart City"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Version
                                            </label>
                                            <EcoInput
                                                value={formData.system.app_version}
                                                onChange={(e) => handleInputChange('system', 'app_version', e.target.value)}
                                                placeholder="1.0.0"
                                                disabled
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fuseau Horaire
                                            </label>
                                            <select 
                                                className="eco-input"
                                                value={formData.system.timezone}
                                                onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
                                            >
                                                <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                                                <option value="Africa/Yaoundé">Africa/Yaoundé (GMT+1)</option>
                                                <option value="UTC">UTC (GMT+0)</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Langue par Défaut
                                            </label>
                                            <select 
                                                className="eco-input"
                                                value={formData.system.language}
                                                onChange={(e) => handleInputChange('system', 'language', e.target.value)}
                                            >
                                                <option value="fr">Français</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        )}

                        {/* Onglet Notifications */}
                        {activeTab === 'notifications' && (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center space-x-2">
                                        <Bell size={20} />
                                        <span>Configuration des Notifications</span>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Mail size={20} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Notifications Email</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Envoyer des notifications par email
                                                    </p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.notifications.email_enabled}
                                                    onChange={(e) => handleInputChange('notifications', 'email_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Smartphone size={20} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Notifications SMS</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Envoyer des notifications par SMS
                                                    </p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.notifications.sms_enabled}
                                                    onChange={(e) => handleInputChange('notifications', 'sms_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Bell size={20} className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Notifications Push</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Envoyer des notifications push
                                                    </p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.notifications.push_enabled}
                                                    onChange={(e) => handleInputChange('notifications', 'push_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        )}

                        {/* Onglet Seuils d'Alerte */}
                        {activeTab === 'thresholds' && (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center space-x-2">
                                        <AlertTriangle size={20} />
                                        <span>Seuils d'Alerte</span>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Niveau Critique (%)
                                            </label>
                                            <EcoInput
                                                type="number"
                                                value={formData.thresholds.critical_fill_level}
                                                onChange={(e) => handleInputChange('thresholds', 'critical_fill_level', parseInt(e.target.value))}
                                                min="0"
                                                max="100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Seuil pour déclencher une alerte critique
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Niveau d'Avertissement (%)
                                            </label>
                                            <EcoInput
                                                type="number"
                                                value={formData.thresholds.warning_fill_level}
                                                onChange={(e) => handleInputChange('thresholds', 'warning_fill_level', parseInt(e.target.value))}
                                                min="0"
                                                max="100"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Seuil pour déclencher un avertissement
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Temps de Réponse Max (heures)
                                            </label>
                                            <EcoInput
                                                type="number"
                                                value={formData.thresholds.max_response_time}
                                                onChange={(e) => handleInputChange('thresholds', 'max_response_time', parseInt(e.target.value))}
                                                min="1"
                                                max="72"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Temps maximum pour répondre à un signalement
                                            </p>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        )}

                        {/* Onglet Sécurité */}
                        {activeTab === 'security' && (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center space-x-2">
                                        <Shield size={20} />
                                        <span>Paramètres de Sécurité</span>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <h3 className="font-medium mb-2">Authentification à Deux Facteurs</h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Activez l'authentification à deux facteurs pour plus de sécurité
                                            </p>
                                            <EcoButton variant="outline">
                                                Configurer 2FA
                                            </EcoButton>
                                        </div>
                                        
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <h3 className="font-medium mb-2">Sessions Actives</h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Gérez les sessions actives des utilisateurs
                                            </p>
                                            <EcoButton variant="outline">
                                                Voir les Sessions
                                            </EcoButton>
                                        </div>
                                        
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <h3 className="font-medium mb-2">Logs de Sécurité</h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Consultez les logs de sécurité du système
                                            </p>
                                            <EcoButton variant="outline">
                                                Voir les Logs
                                            </EcoButton>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        )}

                        {/* Onglet Apparence */}
                        {activeTab === 'appearance' && (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center space-x-2">
                                        <Palette size={20} />
                                        <span>Apparence</span>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Thème
                                            </label>
                                            <select className="eco-input">
                                                <option value="light">Clair</option>
                                                <option value="dark">Sombre</option>
                                                <option value="auto">Automatique</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Couleur Principale
                                            </label>
                                            <div className="flex space-x-2">
                                                <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer border-2 border-green-600"></div>
                                                <div className="w-8 h-8 bg-blue-500 rounded-full cursor-pointer"></div>
                                                <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer"></div>
                                                <div className="w-8 h-8 bg-orange-500 rounded-full cursor-pointer"></div>
                                            </div>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
