import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoProgress } from '@/components/ui/eco-progress';
import {
    Trophy,
    MapPin,
    Plus,
    TrendingUp,
    Clock,
    CheckCircle,
    Star,
    Target,
    Award
} from 'lucide-react';

interface UserStats {
    reports_count: number;
    points: number;
    level: number;
    verified_reports: number;
}

interface RecentReport {
    id: number;
    status: string;
    priority: string;
    created_at: string;
    waste_collection_zone: {
        name: string;
    };
    district: {
        name: string;
    };
}

interface GeneralStats {
    total_zones: number;
    urgent_zones: number;
    average_fill_level: number;
    last_update: string;
}

interface DashboardProps {
    userStats: UserStats;
    recentReports: RecentReport[];
    generalStats: GeneralStats;
}

export default function CitizenDashboard({ userStats, recentReports, generalStats }: DashboardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'success';
            case 'resolved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'danger';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Vérifié';
            case 'resolved': return 'Résolu';
            case 'pending': return 'En attente';
            case 'rejected': return 'Rejeté';
            default: return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    // Calcul du progrès vers le niveau suivant
    const pointsForNextLevel = (userStats.level * 100);
    const progressToNextLevel = (userStats.points % 100);

    return (
        <CitizenLayout title="Dashboard Citoyen">
            <Head title="Dashboard Citoyen" />
            
            <div className="space-y-6">
                {/* En-tête de bienvenue */}
                <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Trophy size={28} className="text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold eco-text-gradient mb-2">
                        Bienvenue, Éco-Citoyen !
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Continuez à contribuer pour un Cameroun plus propre.
                        Chaque signalement compte !
                    </p>
                </div>

                {/* Statistiques utilisateur */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                                <MapPin size={20} className="text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {userStats.reports_count}
                            </div>
                            <div className="text-sm text-gray-600">
                                Signalements
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                                <Star size={20} className="text-yellow-600" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {userStats.points}
                            </div>
                            <div className="text-sm text-gray-600">
                                Points
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                                <Award size={20} className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {userStats.level}
                            </div>
                            <div className="text-sm text-gray-600">
                                Niveau
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {userStats.verified_reports}
                            </div>
                            <div className="text-sm text-gray-600">
                                Vérifiés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Actions rapides */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>Actions Rapides</EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Link href="/citizen/report">
                                <EcoButton className="w-full h-20 flex-col space-y-2" size="lg">
                                    <Plus size={24} />
                                    <span>Nouveau Signalement</span>
                                </EcoButton>
                            </Link>
                            
                            <Link href="/citizen/map">
                                <EcoButton variant="secondary" className="w-full h-20 flex-col space-y-2" size="lg">
                                    <MapPin size={24} />
                                    <span>Voir la Carte</span>
                                </EcoButton>
                            </Link>
                            
                            <Link href="/citizen/achievements">
                                <EcoButton variant="outline" className="w-full h-20 flex-col space-y-2" size="lg">
                                    <Trophy size={24} />
                                    <span>Mes Récompenses</span>
                                </EcoButton>
                            </Link>
                        </div>
                    </EcoCardContent>
                </EcoCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Progression du niveau */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <Target size={20} />
                                <span>Progression</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent className="space-y-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold eco-text-gradient mb-2">
                                    Niveau {userStats.level}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {100 - progressToNextLevel} points pour le niveau suivant
                                </p>
                            </div>
                            
                            <EcoProgress
                                value={progressToNextLevel}
                                max={100}
                                variant="success"
                                showValue={true}
                                label="Progrès vers le niveau suivant"
                                animated={true}
                            />

                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 rounded-lg bg-eco-green/10">
                                    <div className="text-lg font-bold text-eco-green">
                                        {userStats.points}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Points totaux
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-eco-blue/10">
                                    <div className="text-lg font-bold text-eco-blue">
                                        {Math.round((userStats.verified_reports / Math.max(userStats.reports_count, 1)) * 100)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Taux de validation
                                    </div>
                                </div>
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    {/* Signalements récents */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock size={20} />
                                    <span>Signalements Récents</span>
                                </div>
                                <Link href="/citizen/reports">
                                    <EcoButton variant="ghost" size="sm">
                                        Voir tout
                                    </EcoButton>
                                </Link>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            {recentReports.length > 0 ? (
                                <div className="space-y-3">
                                    {recentReports.map((report) => (
                                        <div 
                                            key={report.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h4 className="font-medium text-sm">
                                                        {report.waste_collection_zone.name}
                                                    </h4>
                                                    <EcoBadge 
                                                        variant={getPriorityColor(report.priority)}
                                                        size="sm"
                                                    >
                                                        {report.priority.toUpperCase()}
                                                    </EcoBadge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {report.district.name} • {new Date(report.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <EcoBadge variant={getStatusColor(report.status)} size="sm">
                                                {getStatusText(report.status)}
                                            </EcoBadge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucun signalement pour le moment
                                    </p>
                                    <Link href="/citizen/report">
                                        <EcoButton className="mt-4" size="sm">
                                            Faire mon premier signalement
                                        </EcoButton>
                                    </Link>
                                </div>
                            )}
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Statistiques générales */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center space-x-2">
                            <TrendingUp size={20} />
                            <span>État Général de la Ville</span>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 rounded-lg bg-eco-blue/10">
                                <div className="text-2xl font-bold text-eco-blue mb-1">
                                    {generalStats.total_zones}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Zones totales
                                </div>
                            </div>
                            
                            <div className="text-center p-4 rounded-lg bg-eco-red/10">
                                <div className="text-2xl font-bold text-eco-red mb-1">
                                    {generalStats.urgent_zones}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Zones urgentes
                                </div>
                            </div>
                            
                            <div className="text-center p-4 rounded-lg bg-eco-orange/10">
                                <div className="text-2xl font-bold text-eco-orange mb-1">
                                    {Math.round(generalStats.average_fill_level)}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Remplissage moyen
                                </div>
                            </div>
                            
                            <div className="text-center p-4 rounded-lg bg-eco-green/10">
                                <div className="text-2xl font-bold text-eco-green mb-1">
                                    {generalStats.last_update}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Dernière MAJ
                                </div>
                            </div>
                        </div>
                    </EcoCardContent>
                </EcoCard>
            </div>
        </CitizenLayout>
    );
}
