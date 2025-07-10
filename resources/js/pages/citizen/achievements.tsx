import React from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoProgress, EcoCircularProgress } from '@/components/ui/eco-progress';
import {
    Trophy,
    Star,
    Award,
    Target,
    Crown,
    Gem,
    Flame,
    Leaf,
    RefreshCw,
    Map,
    Globe,
    Zap,
    Lock,
    Plus
} from 'lucide-react';

interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    badge_color: string;
    points_required: number;
    condition_type: string;
    condition_value: number;
    is_active: boolean;
    earned?: boolean;
    earned_at?: string;
    progress?: number;
}

interface UserStats {
    points: number;
    level: number;
    reports_count: number;
    verified_reports: number;
    consecutive_days: number;
    zones_covered: number;
}

interface AchievementsPageProps {
    achievements: Achievement[];
    userStats: UserStats;
    userAchievements: Achievement[];
}

export default function AchievementsPage({ achievements, userStats, userAchievements }: AchievementsPageProps) {
    const getIconComponent = (iconName: string) => {
        const icons: { [key: string]: React.ComponentType<any> } = {
            leaf: Leaf,
            fire: Flame,
            star: Star,
            crown: Crown,
            gem: Gem,
            target: Target,
            'refresh-cw': RefreshCw,
            map: Map,
            globe: Globe,
            zap: Zap,
        };
        return icons[iconName] || Trophy;
    };

    const calculateProgress = (achievement: Achievement): number => {
        switch (achievement.condition_type) {
            case 'reports_count':
                return Math.min((userStats.reports_count / achievement.condition_value) * 100, 100);
            case 'points_earned':
                return Math.min((userStats.points / achievement.condition_value) * 100, 100);
            case 'consecutive_days':
                return Math.min((userStats.consecutive_days / achievement.condition_value) * 100, 100);
            case 'zone_coverage':
                return Math.min((userStats.zones_covered / achievement.condition_value) * 100, 100);
            default:
                return 0;
        }
    };

    const earnedAchievements = achievements.filter(a => 
        userAchievements.some(ua => ua.id === a.id)
    );

    const availableAchievements = achievements.filter(a => 
        !userAchievements.some(ua => ua.id === a.id)
    );

    const nextLevelPoints = (userStats.level * 100);
    const currentLevelProgress = (userStats.points % 100);

    return (
        <CitizenLayout title="Mes Récompenses">
            <Head title="Mes Récompenses" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                        <Trophy size={32} className="text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold eco-text-gradient mb-2">
                        Mes Récompenses
                    </h1>
                    <p className="text-gray-600">
                        Vos accomplissements pour un Cameroun plus propre
                    </p>
                </div>

                {/* Statistiques du niveau */}
                <EcoCard variant="gradient">
                    <EcoCardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Award size={24} className="dark:text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-white">
                                            Niveau {userStats.level}
                                        </h2>
                                        <p className="dark:text-white/80">
                                            {userStats.points} points totaux
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between dark:text-white/80 text-sm">
                                        <span>Progrès vers le niveau {userStats.level + 1}</span>
                                        <span>{currentLevelProgress}/100</span>
                                    </div>
                                    <EcoProgress
                                        value={currentLevelProgress}
                                        max={100}
                                        variant="success"
                                        className="bg-white/20"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-center">
                                <EcoCircularProgress
                                    value={currentLevelProgress}
                                    max={100}
                                    size={120}
                                    strokeWidth={8}
                                    variant="success"
                                    showValue={true}
                                    label="Progression"
                                />
                            </div>
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-eco-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Target size={20} className="text-eco-blue" />
                            </div>
                            <div className="text-2xl font-bold text-eco-blue mb-1">
                                {userStats.reports_count}
                            </div>
                            <div className="text-sm text-gray-600">
                                Signalements
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star size={20} className="text-eco-green" />
                            </div>
                            <div className="text-2xl font-bold text-eco-green mb-1">
                                {userStats.verified_reports}
                            </div>
                            <div className="text-sm text-gray-600">
                                Vérifiés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-eco-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <RefreshCw size={20} className="text-eco-orange" />
                            </div>
                            <div className="text-2xl font-bold text-eco-orange mb-1">
                                {userStats.consecutive_days}
                            </div>
                            <div className="text-sm text-gray-600">
                                Jours consécutifs
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-eco-red/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Map size={20} className="text-eco-red" />
                            </div>
                            <div className="text-2xl font-bold text-eco-red mb-1">
                                {userStats.zones_covered}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Zones couvertes
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Récompenses obtenues */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center space-x-2">
                            <Trophy size={20} className="text-eco-green" />
                            <span>Récompenses Obtenues ({earnedAchievements.length})</span>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        {earnedAchievements.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {earnedAchievements.map((achievement) => {
                                    const IconComponent = getIconComponent(achievement.icon);
                                    return (
                                        <div
                                            key={achievement.id}
                                            className="p-4 rounded-xl border-2 border-eco-green/30 bg-eco-green/5 eco-fade-in"
                                        >
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div 
                                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: achievement.badge_color + '20' }}
                                                >
                                                    <IconComponent 
                                                        size={20} 
                                                        style={{ color: achievement.badge_color }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm">{achievement.name}</h3>
                                                    <EcoBadge variant="success" size="sm">
                                                        +{achievement.points_required} pts
                                                    </EcoBadge>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <EcoBadge variant="success" size="sm">
                                                    ✓ Obtenue
                                                </EcoBadge>
                                                <span className="text-xs text-muted-foreground">
                                                    100%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    Aucune récompense obtenue pour le moment
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Continuez à signaler pour débloquer vos premières récompenses !
                                </p>
                            </div>
                        )}
                    </EcoCardContent>
                </EcoCard>

                {/* Récompenses disponibles */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center space-x-2">
                            <Target size={20} className="text-eco-orange" />
                            <span>Récompenses Disponibles ({availableAchievements.length})</span>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableAchievements.map((achievement) => {
                                const IconComponent = getIconComponent(achievement.icon);
                                const progress = calculateProgress(achievement);
                                const isLocked = progress < 100;
                                
                                return (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            isLocked 
                                                ? 'border-border bg-muted/20' 
                                                : 'border-eco-green/50 bg-eco-green/5 hover:border-eco-green'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div 
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    isLocked ? 'bg-muted' : 'bg-eco-green/20'
                                                }`}
                                            >
                                                {isLocked ? (
                                                    <Lock size={20} className="text-muted-foreground" />
                                                ) : (
                                                    <IconComponent 
                                                        size={20} 
                                                        style={{ color: achievement.badge_color }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-medium text-sm ${isLocked ? 'text-muted-foreground' : ''}`}>
                                                    {achievement.name}
                                                </h3>
                                                <EcoBadge 
                                                    variant={isLocked ? 'outline' : 'warning'} 
                                                    size="sm"
                                                >
                                                    +{achievement.points_required} pts
                                                </EcoBadge>
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {achievement.description}
                                        </p>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Progrès</span>
                                                <span className={isLocked ? 'text-muted-foreground' : 'text-eco-green'}>
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                            <EcoProgress
                                                value={progress}
                                                max={100}
                                                variant={isLocked ? 'default' : 'success'}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Call to action */}
                <div className="text-center">
                    <EcoButton 
                        size="lg"
                        onClick={() => window.location.href = '/citizen/report'}
                        icon={<Plus size={20} />}
                    >
                        Faire un Signalement
                    </EcoButton>
                </div>
            </div>
        </CitizenLayout>
    );
}
