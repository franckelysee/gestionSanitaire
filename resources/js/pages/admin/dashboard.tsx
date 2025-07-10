import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoStats, EcoStatsGrid } from '@/components/ui/eco-stats';
import { cn } from '@/lib/utils';
import { 
    MapPin, 
    AlertTriangle, 
    Users, 
    CheckCircle,
    TrendingUp,
    Clock,
    Trophy,
    BarChart3,
    Eye,
    ArrowRight
} from 'lucide-react';

interface Stats {
    total_zones: number;
    total_reports: number;
    total_users: number;
    urgent_zones: number;
    pending_reports: number;
    verified_reports: number;
}

interface ReportEvolution {
    date: string;
    count: number;
}

interface CriticalZone {
    id: number;
    name: string;
    district: string;
    city: string;
    fill_percentage: number;
    priority: string;
    last_emptied: string;
}

interface TopUser {
    id: number;
    name: string;
    district: string;
    reports_count: number;
    points: number;
    level: number;
}

interface RecentReport {
    id: number;
    user_name: string;
    zone_name: string;
    district_name: string;
    priority: string;
    status: string;
    fill_level: number;
    created_at: string;
}

interface DashboardProps {
    stats: Stats;
    reportsEvolution: ReportEvolution[];
    criticalZones: CriticalZone[];
    topUsers: TopUser[];
    recentReports: RecentReport[];
}

export default function AdminDashboard({ 
    stats, 
    reportsEvolution, 
    criticalZones, 
    topUsers, 
    recentReports 
}: DashboardProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

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

    return (
        <AdminLayout title="Dashboard Administrateur">
            <Head title="Dashboard Administrateur" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Dashboard Administrateur
                        </h1>
                        <p className="text-muted-foreground">
                            Vue d'ensemble du système de gestion sanitaire
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <EcoButton variant="outline" icon={<BarChart3 size={16} />}>
                            Rapport Complet
                        </EcoButton>
                        <EcoButton icon={<TrendingUp size={16} />}>
                            Analytics
                        </EcoButton>
                    </div>
                </div>

                {/* Statistiques principales */}
                <EcoStatsGrid>
                    <EcoStats
                        title="Zones de Collecte"
                        value={stats.total_zones}
                        icon={<MapPin size={20} />}
                        color="blue"
                    />
                    <EcoStats
                        title="Zones Urgentes"
                        value={stats.urgent_zones}
                        icon={<AlertTriangle size={20} />}
                        color="red"
                        change={{
                            value: 15,
                            type: 'increase',
                            period: 'aujourd\'hui'
                        }}
                    />
                    <EcoStats
                        title="Signalements"
                        value={stats.total_reports}
                        icon={<CheckCircle size={20} />}
                        color="green"
                        change={{
                            value: 8,
                            type: 'increase',
                            period: 'cette semaine'
                        }}
                    />
                    <EcoStats
                        title="Utilisateurs Actifs"
                        value={stats.total_users}
                        icon={<Users size={20} />}
                        color="orange"
                    />
                </EcoStatsGrid>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Zones critiques */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <AlertTriangle size={20} className="text-eco-red" />
                                    <span>Zones Critiques</span>
                                </div>
                                <EcoButton variant="ghost" size="sm" icon={<Eye size={14} />}>
                                    Voir tout
                                </EcoButton>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-3">
                                {criticalZones.map((zone) => (
                                    <div 
                                        key={zone.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-eco-red/5 border border-eco-red/20 hover:bg-eco-red/10 transition-colors cursor-pointer"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-medium text-sm">{zone.name}</h4>
                                                <EcoBadge 
                                                    variant={getPriorityColor(zone.priority)}
                                                    size="sm"
                                                >
                                                    {zone.priority.toUpperCase()}
                                                </EcoBadge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {zone.district}, {zone.city}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Dernière collecte: {zone.last_emptied}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-eco-red">
                                                {zone.fill_percentage}%
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Remplissage
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    {/* Utilisateurs les plus actifs */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Trophy size={20} className="text-eco-yellow" />
                                    <span>Top Contributeurs</span>
                                </div>
                                <EcoButton variant="ghost" size="sm" icon={<Eye size={14} />}>
                                    Voir tout
                                </EcoButton>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-3">
                                {topUsers.map((user, index) => (
                                    <div 
                                        key={user.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className={cn(
                                                'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                                                index === 0 ? 'bg-eco-yellow' :
                                                index === 1 ? 'bg-muted' :
                                                index === 2 ? 'bg-eco-orange' : 'bg-eco-blue'
                                            )}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{user.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {user.district}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-eco-green">
                                                {user.reports_count} signalements
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {user.points} points • Niv. {user.level}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Signalements récents */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Clock size={20} className="text-eco-blue" />
                                <span>Signalements Récents</span>
                            </div>
                            <EcoButton variant="ghost" size="sm" icon={<ArrowRight size={14} />}>
                                Voir tous les signalements
                            </EcoButton>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Utilisateur
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Zone
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Priorité
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Statut
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Remplissage
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map((report) => (
                                        <tr 
                                            key={report.id}
                                            className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-2">
                                                <div>
                                                    <div className="font-medium text-sm">{report.user_name}</div>
                                                    <div className="text-xs text-muted-foreground">{report.district_name}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="font-medium text-sm">{report.zone_name}</div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <EcoBadge 
                                                    variant={getPriorityColor(report.priority)}
                                                    size="sm"
                                                >
                                                    {report.priority.toUpperCase()}
                                                </EcoBadge>
                                            </td>
                                            <td className="py-3 px-2">
                                                <EcoBadge 
                                                    variant={getStatusColor(report.status)}
                                                    size="sm"
                                                >
                                                    {getStatusText(report.status)}
                                                </EcoBadge>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="font-medium text-sm">{report.fill_level}%</div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="text-sm text-muted-foreground">{report.created_at}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </EcoCardContent>
                </EcoCard>
            </div>
        </AdminLayout>
    );
}
