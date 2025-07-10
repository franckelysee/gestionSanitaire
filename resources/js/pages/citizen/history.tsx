import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoInput } from '@/components/ui/eco-input';
import { 
    History, 
    Search, 
    Filter,
    Calendar,
    MapPin,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    AlertTriangle,
    X,
    Image,
    Plus
} from 'lucide-react';

interface Report {
    id: number;
    zone_name: string;
    district: string;
    fill_level: number;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'verified' | 'resolved' | 'rejected';
    description: string;
    photos: string[];
    created_at: string;
    verified_at?: string;
    resolved_at?: string;
    points_earned: number;
    admin_comment?: string;
}

interface HistoryPageProps {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function HistoryPage({ reports }: HistoryPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'resolved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle size={16} />;
            case 'resolved': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'rejected': return <X size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case 'high': return 'Urgent';
            case 'medium': return 'Moyen';
            case 'low': return 'Faible';
            default: return priority;
        }
    };

    return (
        <CitizenLayout title="Historique des Signalements">
            <Head title="Historique des Signalements" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold eco-text-gradient">
                            Mes Signalements
                        </h1>
                        <p className="text-gray-600">
                            Consultez l'historique de vos signalements
                        </p>
                    </div>
                    
                    <EcoButton icon={<Plus size={16} />} onClick={() => window.location.href = '/citizen/report'}>
                        Nouveau Signalement
                    </EcoButton>
                </div>

                {/* Filtres et recherche */}
                <EcoCard>
                    <EcoCardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <EcoInput
                                placeholder="Rechercher un signalement..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search size={18} />}
                            />
                            
                            <select 
                                className="eco-input"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="verified">Vérifié</option>
                                <option value="resolved">Résolu</option>
                                <option value="rejected">Rejeté</option>
                            </select>
                            
                            <select 
                                className="eco-input"
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                            >
                                <option value="all">Toutes priorités</option>
                                <option value="high">Urgent</option>
                                <option value="medium">Moyen</option>
                                <option value="low">Faible</option>
                            </select>
                            
                            <EcoButton variant="outline" icon={<Filter size={16} />}>
                                Filtrer
                            </EcoButton>
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {reports.total}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total signalements
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {reports.data.filter(r => r.status === 'pending').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                En attente
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {reports.data.filter(r => r.status === 'verified' || r.status === 'resolved').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Validés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                                {reports.data.reduce((sum, r) => sum + r.points_earned, 0)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Points gagnés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des signalements */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>
                            Mes Signalements ({reports.total})
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-4">
                            {reports.data.map((report) => (
                                <div 
                                    key={report.id}
                                    className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                    onClick={() => setSelectedReport(report)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Informations principales */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold">#{report.id}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                                                    {getPriorityText(report.priority)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                                    <div className="flex items-center space-x-1">
                                                        {getStatusIcon(report.status)}
                                                        <span>{getStatusText(report.status)}</span>
                                                    </div>
                                                </span>
                                                {report.photos && report.photos.length > 0 && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                        <Image size={12} className="inline mr-1" />
                                                        {report.photos.length} photo{report.photos.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{report.zone_name}</p>
                                                        <p className="text-gray-600">{report.district}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <AlertTriangle size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">Remplissage: {report.fill_level}%</p>
                                                        <p className="text-gray-600">Niveau signalé</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{new Date(report.created_at).toLocaleDateString('fr-FR')}</p>
                                                        <p className="text-gray-600">Date de signalement</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {report.description && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        "{report.description}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Points et actions */}
                                        <div className="flex flex-col items-end space-y-2">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">
                                                    +{report.points_earned}
                                                </div>
                                                <div className="text-xs text-gray-500">points</div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <EcoButton 
                                                    variant="outline" 
                                                    size="sm" 
                                                    icon={<Eye size={14} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedReport(report);
                                                    }}
                                                >
                                                    Voir
                                                </EcoButton>
                                                
                                                {report.status === 'pending' && (
                                                    <>
                                                        <EcoButton 
                                                            variant="outline" 
                                                            size="sm" 
                                                            icon={<Edit size={14} />}
                                                        >
                                                            Modifier
                                                        </EcoButton>
                                                        <EcoButton 
                                                            variant="outline" 
                                                            size="sm" 
                                                            icon={<Trash2 size={14} />}
                                                        >
                                                            Supprimer
                                                        </EcoButton>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {reports.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Affichage de {((reports.current_page - 1) * reports.per_page) + 1} à{' '}
                                    {Math.min(reports.current_page * reports.per_page, reports.total)} sur {reports.total} signalements
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={reports.current_page === 1}
                                    >
                                        Précédent
                                    </EcoButton>
                                    
                                    <span className="px-3 py-1 text-sm">
                                        Page {reports.current_page} sur {reports.last_page}
                                    </span>
                                    
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={reports.current_page === reports.last_page}
                                    >
                                        Suivant
                                    </EcoButton>
                                </div>
                            </div>
                        )}

                        {reports.data.length === 0 && (
                            <div className="text-center py-12">
                                <History size={48} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-600 mb-2">
                                    Aucun signalement trouvé
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Vous n'avez pas encore effectué de signalement
                                </p>
                                <EcoButton icon={<Plus size={16} />} onClick={() => window.location.href = '/citizen/report'}>
                                    Faire un Signalement
                                </EcoButton>
                            </div>
                        )}
                    </EcoCardContent>
                </EcoCard>

                {/* Modal de détails */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedReport(null)}
                        />
                        <EcoCard className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <EcoCardHeader>
                                <EcoCardTitle className="flex items-center justify-between">
                                    <span>Signalement #{selectedReport.id}</span>
                                    <EcoButton 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => setSelectedReport(null)}
                                    >
                                        <X size={16} />
                                    </EcoButton>
                                </EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="space-y-4">
                                    {/* Informations détaillées */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Zone</label>
                                            <p>{selectedReport.zone_name}</p>
                                            <p className="text-sm text-gray-500">{selectedReport.district}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Statut</label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedReport.status)}`}>
                                                    {getStatusText(selectedReport.status)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedReport.priority)}`}>
                                                    {getPriorityText(selectedReport.priority)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Photos */}
                                    {selectedReport.photos && selectedReport.photos.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Photos</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedReport.photos.map((photo, index) => (
                                                    <img 
                                                        key={index}
                                                        src={`/storage/${photo}`}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {selectedReport.description && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Description</label>
                                            <p className="p-3 bg-gray-50 rounded-lg">{selectedReport.description}</p>
                                        </div>
                                    )}

                                    {/* Commentaire admin */}
                                    {selectedReport.admin_comment && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600 mb-2 block">Commentaire de l'administration</label>
                                            <p className="p-3 bg-blue-50 rounded-lg border border-blue-200">{selectedReport.admin_comment}</p>
                                        </div>
                                    )}

                                    {/* Dates importantes */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Créé le</label>
                                            <p>{new Date(selectedReport.created_at).toLocaleString('fr-FR')}</p>
                                        </div>
                                        {selectedReport.verified_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Vérifié le</label>
                                                <p>{new Date(selectedReport.verified_at).toLocaleString('fr-FR')}</p>
                                            </div>
                                        )}
                                        {selectedReport.resolved_at && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">Résolu le</label>
                                                <p>{new Date(selectedReport.resolved_at).toLocaleString('fr-FR')}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Points gagnés */}
                                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="text-2xl font-bold text-green-600">
                                            +{selectedReport.points_earned} points
                                        </div>
                                        <div className="text-sm text-green-700">
                                            Points gagnés pour ce signalement
                                        </div>
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
