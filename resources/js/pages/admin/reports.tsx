import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoInput } from '@/components/ui/eco-input';
import ReportValidationModal from '@/components/admin/report-validation-modal';
import {
    AlertTriangle,
    Search,
    Filter,
    Eye,
    CheckCircle,
    X,
    Clock,
    User,
    MapPin,
    Calendar,
    Image,
    MessageSquare,
    XCircle,
    Settings
} from 'lucide-react';

interface Report {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    zone: {
        id: number;
        name: string;
    };
    district: string;
    fill_level: number;
    priority: string;
    status: string;
    description: string;
    photos: string[];
    coordinates: { lat: number; lng: number };
    created_at: string;
    verified_at: string | null;
    resolved_at: string | null;
}

interface ReportsPageProps {
    reports: {
        data: Report[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function ReportsPage({ reports }: ReportsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    // États pour le modal de validation
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [reportToValidate, setReportToValidate] = useState<Report | null>(null);

    // Fonctions de gestion des actions
    const handleValidateReport = (report: Report) => {
        setReportToValidate(report);
        setIsValidationModalOpen(true);
    };

    const handleModalSuccess = () => {
        // Recharger les données ou mettre à jour l'état
        window.location.reload();
    };

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle size={16} />;
            case 'resolved': return <CheckCircle size={16} />;
            case 'pending': return <Clock size={16} />;
            case 'rejected': return <X size={16} />;
            default: return <AlertTriangle size={16} />;
        }
    };

    return (
        <AdminLayout title="Gestion des Signalements">
            <Head title="Gestion des Signalements" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Signalements
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez et validez les signalements des citoyens
                        </p>
                    </div>
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
                                <option value="high">Urgente</option>
                                <option value="medium">Moyenne</option>
                                <option value="low">Faible</option>
                            </select>
                            
                            <EcoButton variant="outline" icon={<Filter size={16} />}>
                                Filtrer
                            </EcoButton>
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-blue mb-1">
                                {reports.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total signalements
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-orange mb-1">
                                {reports.data.filter(r => r.status === 'pending').length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                En attente
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-green mb-1">
                                {reports.data.filter(r => r.status === 'verified').length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Vérifiés
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-red mb-1">
                                {reports.data.filter(r => r.priority === 'high').length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Urgents
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des signalements */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>
                            Liste des Signalements ({reports.total})
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-4">
                            {reports.data.map((report) => (
                                <div 
                                    key={report.id}
                                    className="p-4 rounded-xl border border-border/50 hover:border-border transition-colors cursor-pointer"
                                    onClick={() => setSelectedReport(report)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Informations principales */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="font-semibold">#{report.id}</h3>
                                                <EcoBadge 
                                                    variant={getPriorityColor(report.priority)}
                                                >
                                                    {report.priority.toUpperCase()}
                                                </EcoBadge>
                                                <EcoBadge 
                                                    variant={getStatusColor(report.status)}
                                                    icon={getStatusIcon(report.status)}
                                                >
                                                    {getStatusText(report.status)}
                                                </EcoBadge>
                                                {report.photos && report.photos.length > 0 && (
                                                    <EcoBadge variant="outline" size="sm">
                                                        <Image size={12} />
                                                        {report.photos.length} photo{report.photos.length > 1 ? 's' : ''}
                                                    </EcoBadge>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <User size={16} className="text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{report.user.name}</p>
                                                        <p className="text-muted-foreground text-xs">{report.user.email}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <MapPin size={16} className="text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{report.zone.name}</p>
                                                        <p className="text-muted-foreground text-xs">{report.district}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <AlertTriangle size={16} className="text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Remplissage: {report.fill_level}%</p>
                                                        <p className="text-muted-foreground text-xs">Niveau signalé</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{report.created_at}</p>
                                                        <p className="text-muted-foreground text-xs">Date de signalement</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {report.description && (
                                                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                                    <p className="text-sm text-muted-foreground">
                                                        "{report.description}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col space-y-2 lg:w-32">
                                            {(report.status === 'pending' || report.status === 'verified') && (
                                                <EcoButton
                                                    variant="primary"
                                                    size="sm"
                                                    icon={<Settings size={14} />}
                                                    onClick={() => handleValidateReport(report)}
                                                    className="cursor-pointer"
                                                >
                                                    Valider
                                                </EcoButton>
                                            )}

                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Eye size={14} />}
                                                onClick={() => setSelectedReport(report)}
                                                className="cursor-pointer"
                                            >
                                                Détails
                                            </EcoButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {reports.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                                <div className="text-sm text-muted-foreground">
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
                    </EcoCardContent>
                </EcoCard>

                {/* Modal de détails (si un signalement est sélectionné) */}
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
                                            <label className="text-sm font-medium text-muted-foreground">Utilisateur</label>
                                            <p>{selectedReport.user.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedReport.user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Zone</label>
                                            <p>{selectedReport.zone.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedReport.district}</p>
                                        </div>
                                    </div>

                                    {/* Photos */}
                                    {selectedReport.photos && selectedReport.photos.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Photos</label>
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
                                            <label className="text-sm font-medium text-muted-foreground mb-2 block">Description</label>
                                            <p className="p-3 bg-muted/30 rounded-lg">{selectedReport.description}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex space-x-2 pt-4 border-t border-border/50">
                                        {selectedReport.status === 'pending' && (
                                            <>
                                                <EcoButton variant="success" icon={<CheckCircle size={16} />}>
                                                    Vérifier le signalement
                                                </EcoButton>
                                                <EcoButton variant="danger" icon={<X size={16} />}>
                                                    Rejeter le signalement
                                                </EcoButton>
                                            </>
                                        )}
                                        
                                        {selectedReport.status === 'verified' && (
                                            <EcoButton variant="success" icon={<CheckCircle size={16} />}>
                                                Marquer comme résolu
                                            </EcoButton>
                                        )}
                                    </div>
                                </div>
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                )}
            </div>

            {/* Modal de validation */}
            <ReportValidationModal
                isOpen={isValidationModalOpen}
                onClose={() => {
                    setIsValidationModalOpen(false);
                    setReportToValidate(null);
                }}
                report={reportToValidate}
                onSuccess={handleModalSuccess}
            />
        </AdminLayout>
    );
}
