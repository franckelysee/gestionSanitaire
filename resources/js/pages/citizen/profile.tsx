import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoProgress } from '@/components/ui/eco-progress';
import { cn } from '@/lib/utils';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Edit, 
    Camera, 
    Trophy,
    Target,
    Star,
    Calendar,
    Settings,
    Shield,
    Bell,
    Globe
} from 'lucide-react';
import { EcoStats, EcoStatsGrid } from '@/components/ui/eco-stats';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: string;
    points: number;
    level: number;
    district?: {
        name: string;
        city: {
            name: string;
        };
    };
    created_at: string;
    last_activity_at?: string;
}

interface ProfileStats {
    total_reports: number;
    verified_reports: number;
    pending_reports: number;
    achievements_count: number;
    rank_in_district: number;
    total_users_in_district: number;
}

interface ProfilePageProps {
    user: UserProfile;
    stats: ProfileStats;
}

export default function ProfilePage({ user, stats }: ProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings'>('profile');

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('citizen.profile.update'), {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const getVerificationRate = () => {
        if (stats.total_reports === 0) return 0;
        return Math.round((stats.verified_reports / stats.total_reports) * 100);
    };

    const getRankSuffix = (rank: number) => {
        if (rank === 1) return 'er';
        return 'ème';
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'stats', label: 'Statistiques', icon: Target },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <CitizenLayout title="Mon Profil">
            <Head title="Mon Profil" />
            
            <div className="p-4 space-y-6">
                {/* En-tête du profil */}
                <EcoCard variant="gradient">
                    <EcoCardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                    {user.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User size={32} className="dark:text-white" />
                                    )}
                                </div>
                                <EcoButton
                                    variant="glass"
                                    size="icon"
                                    className="absolute -bottom-2 -right-2 w-8 h-8"
                                >
                                    <Camera size={14} />
                                </EcoButton>
                            </div>

                            {/* Informations utilisateur */}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold dark:text-white mb-2">
                                    {user.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                                    <EcoBadge variant="glass" className="dark:text-white border-white/30">
                                        <Trophy size={12} />
                                        Niveau {user.level}
                                    </EcoBadge>
                                    <EcoBadge variant="glass" className="dark:text-white border-white/30">
                                        <Star size={12} />
                                        {user.points} points
                                    </EcoBadge>
                                    {user.district && (
                                        <EcoBadge variant="glass" className="dark:text-white border-white/30">
                                            <MapPin size={12} />
                                            {user.district.name}
                                        </EcoBadge>
                                    )}
                                </div>
                                <p className="dark:text-white/80 text-sm">
                                    Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                                <EcoButton
                                    variant="glass"
                                    onClick={() => setIsEditing(!isEditing)}
                                    icon={<Edit size={16} />}
                                >
                                    Modifier
                                </EcoButton>
                            </div>
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Statistiques rapides */}
                <EcoStatsGrid>
                    <EcoStats
                        title="Signalements"
                        value={stats.total_reports}
                        icon={<Target size={20} />}
                        color="blue"
                    />
                    <EcoStats
                        title="Taux de Validation"
                        value={`${getVerificationRate()}%`}
                        icon={<Shield size={20} />}
                        color="green"
                    />
                    <EcoStats
                        title="Classement"
                        value={`${stats.rank_in_district}${getRankSuffix(stats.rank_in_district)}`}
                        icon={<Trophy size={20} />}
                        color="yellow"
                        change={{
                            value: 2,
                            type: 'increase',
                            period: 'ce mois'
                        }}
                    />
                    <EcoStats
                        title="Récompenses"
                        value={stats.achievements_count}
                        icon={<Star size={20} />}
                        color="orange"
                    />
                </EcoStatsGrid>

                {/* Onglets */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                'flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer',
                                activeTab === tab.id
                                    ? 'bg-white shadow-sm text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            )}
                        >
                            <tab.icon size={16} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'profile' && (
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle>Informations Personnelles</EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <EcoInput
                                        label="Nom complet"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                        icon={<User size={18} />}
                                    />
                                    
                                    <EcoInput
                                        label="Email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={errors.email}
                                        icon={<Mail size={18} />}
                                    />
                                    
                                    <EcoInput
                                        label="Téléphone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        error={errors.phone}
                                        icon={<Phone size={18} />}
                                        placeholder="+237 6XX XXX XXX"
                                    />

                                    <div className="flex space-x-3">
                                        <EcoButton
                                            type="submit"
                                            loading={processing}
                                            className="flex-1"
                                        >
                                            Sauvegarder
                                        </EcoButton>
                                        <EcoButton
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1"
                                        >
                                            Annuler
                                        </EcoButton>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">
                                                Nom complet
                                            </label>
                                            <p className="text-gray-900">{user.name}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">
                                                Email
                                            </label>
                                            <p className="text-gray-900">{user.email}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">
                                                Téléphone
                                            </label>
                                            <p className="text-gray-900">
                                                {user.phone || 'Non renseigné'}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-600">
                                                Localisation
                                            </label>
                                            <p className="text-gray-900">
                                                {user.district ?
                                                    `${user.district.name}, ${user.district.city.name}` :
                                                    'Non définie'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </EcoCardContent>
                    </EcoCard>
                )}

                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle>Statistiques Détaillées</EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="text-center p-4 rounded-lg bg-eco-blue/10">
                                        <div className="text-2xl font-bold text-eco-blue mb-1">
                                            {stats.total_reports}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Total signalements
                                        </div>
                                    </div>

                                    <div className="text-center p-4 rounded-lg bg-green-100">
                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                            {stats.verified_reports}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Vérifiés
                                        </div>
                                    </div>

                                    <div className="text-center p-4 rounded-lg bg-orange-100">
                                        <div className="text-2xl font-bold text-orange-600 mb-1">
                                            {stats.pending_reports}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            En attente
                                        </div>
                                    </div>

                                    <div className="text-center p-4 rounded-lg bg-yellow-100">
                                        <div className="text-2xl font-bold text-yellow-600 mb-1">
                                            {getVerificationRate()}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Taux de validation
                                        </div>
                                    </div>
                                </div>
                            </EcoCardContent>
                        </EcoCard>

                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle>Classement dans le Quartier</EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="text-center py-6">
                                    <div className="text-4xl font-bold eco-text-gradient mb-2">
                                        #{stats.rank_in_district}
                                    </div>
                                    <p className="text-gray-600">
                                        sur {stats.total_users_in_district} citoyens actifs
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        dans le quartier {user.district?.name}
                                    </p>
                                </div>
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-4">
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle className="flex items-center space-x-2">
                                    <Bell size={20} />
                                    <span>Notifications</span>
                                </EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Notifications push</h4>
                                            <p className="text-sm text-gray-600">
                                                Recevoir des notifications sur votre appareil
                                            </p>
                                        </div>
                                        <input type="checkbox" className="toggle cursor-pointer" defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Notifications email</h4>
                                            <p className="text-sm text-gray-600">
                                                Recevoir des résumés par email
                                            </p>
                                        </div>
                                        <input type="checkbox" className="toggle" />
                                    </div>
                                </div>
                            </EcoCardContent>
                        </EcoCard>

                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle className="flex items-center space-x-2">
                                    <Globe size={20} />
                                    <span>Préférences</span>
                                </EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Langue
                                        </label>
                                        <select className="w-full p-2 border border-border rounded-lg">
                                            <option value="fr">Français</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Thème
                                        </label>
                                        <select className="w-full p-2 border border-border rounded-lg">
                                            <option value="light">Clair</option>
                                            <option value="dark">Sombre</option>
                                            <option value="auto">Automatique</option>
                                        </select>
                                    </div>
                                </div>
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
