import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoProgress } from '@/components/ui/eco-progress';
import { 
    BarChart3, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    Download,
    Filter,
    MapPin,
    Users,
    AlertTriangle,
    CheckCircle,
    Clock,
    Trash2,
    Recycle,
    Leaf
} from 'lucide-react';

interface AnalyticsData {
    overview: {
        total_reports: number;
        verified_reports: number;
        resolved_reports: number;
        active_users: number;
        zones_critical: number;
        efficiency_rate: number;
    };
    trends: {
        reports_trend: number;
        users_trend: number;
        efficiency_trend: number;
    };
    monthly_data: Array<{
        month: string;
        reports: number;
        resolved: number;
        users: number;
    }>;
    districts_performance: Array<{
        name: string;
        reports: number;
        efficiency: number;
        zones: number;
    }>;
    waste_types: Array<{
        type: string;
        percentage: number;
        count: number;
    }>;
}

interface AnalyticsPageProps {
    analytics: AnalyticsData;
}

export default function AnalyticsPage({ analytics }: AnalyticsPageProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
    const [selectedMetric, setSelectedMetric] = useState<string>('reports');

    const getTrendIcon = (trend: number) => {
        return trend > 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
    };

    const getTrendColor = (trend: number) => {
        return trend > 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <AdminLayout title="Analytics & Rapports">
            <Head title="Analytics & Rapports" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Analytics & Rapports
                        </h1>
                        <p className="text-gray-600">
                            Analysez les performances et tendances du système
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <select 
                            className="eco-input"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="week">Cette semaine</option>
                            <option value="month">Ce mois</option>
                            <option value="quarter">Ce trimestre</option>
                            <option value="year">Cette année</option>
                        </select>
                        
                        <EcoButton variant="outline" icon={<Download size={16} />}>
                            Exporter
                        </EcoButton>
                    </div>
                </div>

                {/* Métriques principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <EcoCard>
                        <EcoCardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Signalements Total</p>
                                    <p className="text-3xl font-bold text-blue-600">{analytics.overview.total_reports}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {getTrendIcon(analytics.trends.reports_trend)}
                                        <span className={`text-sm font-medium ${getTrendColor(analytics.trends.reports_trend)}`}>
                                            {Math.abs(analytics.trends.reports_trend)}% vs mois dernier
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BarChart3 size={24} className="text-blue-600" />
                                </div>
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                                    <p className="text-3xl font-bold text-green-600">{analytics.overview.active_users}</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {getTrendIcon(analytics.trends.users_trend)}
                                        <span className={`text-sm font-medium ${getTrendColor(analytics.trends.users_trend)}`}>
                                            {Math.abs(analytics.trends.users_trend)}% vs mois dernier
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users size={24} className="text-green-600" />
                                </div>
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Taux d'Efficacité</p>
                                    <p className="text-3xl font-bold text-orange-600">{analytics.overview.efficiency_rate}%</p>
                                    <div className="flex items-center space-x-1 mt-2">
                                        {getTrendIcon(analytics.trends.efficiency_trend)}
                                        <span className={`text-sm font-medium ${getTrendColor(analytics.trends.efficiency_trend)}`}>
                                            {Math.abs(analytics.trends.efficiency_trend)}% vs mois dernier
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp size={24} className="text-orange-600" />
                                </div>
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Statistiques détaillées */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {analytics.overview.verified_reports}
                            </div>
                            <div className="text-sm text-gray-600">
                                Signalements Vérifiés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                                <Trash2 size={20} className="text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {analytics.overview.resolved_reports}
                            </div>
                            <div className="text-sm text-gray-600">
                                Problèmes Résolus
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {analytics.overview.zones_critical}
                            </div>
                            <div className="text-sm text-gray-600">
                                Zones Critiques
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                2.5h
                            </div>
                            <div className="text-sm text-gray-600">
                                Temps Moyen de Réponse
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance par district */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <MapPin size={20} />
                                <span>Performance par District</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-4">
                                {analytics.districts_performance.map((district, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{district.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {district.reports} signalements • {district.zones} zones
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {district.efficiency}%
                                            </div>
                                            <div className="text-xs text-gray-500">Efficacité</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    {/* Types de déchets */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <Recycle size={20} />
                                <span>Répartition des Déchets</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-4">
                                {analytics.waste_types.map((waste, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{waste.type}</span>
                                            <span className="text-sm text-gray-600">{waste.percentage}%</span>
                                        </div>
                                        <EcoProgress
                                            value={waste.percentage}
                                            max={100}
                                            variant={
                                                waste.percentage > 60 ? 'danger' :
                                                waste.percentage > 30 ? 'warning' : 'success'
                                            }
                                            size="sm"
                                        />
                                        <div className="text-xs text-gray-500">
                                            {waste.count} signalements
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Évolution mensuelle */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Calendar size={20} />
                                <span>Évolution Mensuelle</span>
                            </div>
                            <select 
                                className="eco-input text-sm"
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                            >
                                <option value="reports">Signalements</option>
                                <option value="users">Utilisateurs</option>
                                <option value="resolved">Résolus</option>
                            </select>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-4">
                            {analytics.monthly_data.map((month, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                                    <div className="w-16 text-sm font-medium text-gray-600">
                                        {month.month}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Signalements</span>
                                            <span className="text-sm font-medium">{month.reports}</span>
                                        </div>
                                        <EcoProgress
                                            value={month.reports}
                                            max={Math.max(...analytics.monthly_data.map(m => m.reports))}
                                            variant="success"
                                            size="sm"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm">Résolus</span>
                                            <span className="text-sm font-medium">{month.resolved}</span>
                                        </div>
                                        <EcoProgress
                                            value={month.resolved}
                                            max={Math.max(...analytics.monthly_data.map(m => m.resolved))}
                                            variant="warning"
                                            size="sm"
                                        />
                                    </div>
                                    <div className="w-20 text-right">
                                        <div className="text-lg font-bold text-blue-600">
                                            {Math.round((month.resolved / month.reports) * 100)}%
                                        </div>
                                        <div className="text-xs text-gray-500">Efficacité</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </EcoCardContent>
                </EcoCard>
            </div>
        </AdminLayout>
    );
}
