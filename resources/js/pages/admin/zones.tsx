import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoProgress } from '@/components/ui/eco-progress';
import ZoneFormModal from '@/components/admin/zone-form-modal';
import DeleteConfirmationModal from '@/components/admin/delete-confirmation-modal';
import {
    MapPin,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    AlertTriangle,
    CheckCircle,
    Clock,
    Power,
    PowerOff
} from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    district: string;
    city: string;
    capacity: number;
    current_fill: number;
    fill_percentage: number;
    priority: string;
    zone_type: string;
    is_active: boolean;
    last_emptied: string;
    coordinates: { lat: number; lng: number };
}

interface District {
    id: number;
    name: string;
    city: string;
}

interface ZonesPageProps {
    zones: {
        data: Zone[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    districts: District[];
}

export default function ZonesPage({ zones, districts }: ZonesPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');

    // États pour les modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [zoneToEdit, setZoneToEdit] = useState<Zone | null>(null);
    const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null);

    // Fonctions de gestion des actions
    const handleCreateZone = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditZone = (zone: Zone) => {
        setZoneToEdit(zone);
        setIsEditModalOpen(true);
    };

    const handleDeleteZone = (zone: Zone) => {
        setZoneToDelete(zone);
        setIsDeleteModalOpen(true);
    };

    const handleToggleStatus = (zone: Zone) => {
        // Logique pour activer/désactiver une zone
        console.log('Toggle status for zone:', zone.id);
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

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertTriangle size={16} />;
            case 'medium': return <Clock size={16} />;
            case 'low': return <CheckCircle size={16} />;
            default: return <MapPin size={16} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'residential': return 'bg-eco-green/10 text-eco-green';
            case 'commercial': return 'bg-eco-blue/10 text-eco-blue';
            case 'industrial': return 'bg-eco-orange/10 text-eco-orange';
            case 'public': return 'bg-eco-red/10 text-eco-red';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'residential': return 'Résidentiel';
            case 'commercial': return 'Commercial';
            case 'industrial': return 'Industriel';
            case 'public': return 'Public';
            default: return type;
        }
    };

    return (
        <AdminLayout title="Gestion des Zones">
            <Head title="Gestion des Zones" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Zones de Collecte
                        </h1>
                        <p className="text-muted-foreground">
                            Gérez les zones de collecte de déchets dans la ville
                        </p>
                    </div>
                    
                    <EcoButton
                        icon={<Plus size={16} />}
                        onClick={handleCreateZone}
                        className="cursor-pointer"
                    >
                        Nouvelle Zone
                    </EcoButton>
                </div>

                {/* Filtres et recherche */}
                <EcoCard>
                    <EcoCardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <EcoInput
                                placeholder="Rechercher une zone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search size={18} />}
                            />
                            
                            <select 
                                className="eco-input"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option value="all">Tous les quartiers</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name} ({district.city})
                                    </option>
                                ))}
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
                            
                            <select 
                                className="eco-input"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">Tous les types</option>
                                <option value="residential">Résidentiel</option>
                                <option value="commercial">Commercial</option>
                                <option value="industrial">Industriel</option>
                                <option value="public">Public</option>
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
                                {zones.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Zones totales
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-red mb-1">
                                {zones.data.filter(z => z.fill_percentage > 90).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Zones pleines
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-orange mb-1">
                                {zones.data.filter(z => z.fill_percentage > 70 && z.fill_percentage <= 90).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Zones à surveiller
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-eco-green mb-1">
                                {zones.data.filter(z => z.is_active).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Zones actives
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des zones */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>
                            Liste des Zones ({zones.total})
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-4">
                            {zones.data.map((zone) => (
                                <div 
                                    key={zone.id}
                                    className="p-4 rounded-xl border border-border/50 hover:border-border transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Informations principales */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-lg">{zone.name}</h3>
                                                <EcoBadge 
                                                    variant={getPriorityColor(zone.priority)}
                                                    icon={getPriorityIcon(zone.priority)}
                                                >
                                                    {zone.priority.toUpperCase()}
                                                </EcoBadge>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(zone.zone_type)}`}>
                                                    {getTypeLabel(zone.zone_type)}
                                                </span>
                                                {!zone.is_active && (
                                                    <EcoBadge variant="outline" size="sm">
                                                        Inactive
                                                    </EcoBadge>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Localisation:</span>
                                                    <p className="font-medium">{zone.district}, {zone.city}</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Capacité:</span>
                                                    <p className="font-medium">{zone.capacity}L</p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Dernière collecte:</span>
                                                    <p className="font-medium">{zone.last_emptied}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Niveau de remplissage */}
                                        <div className="lg:w-64">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Remplissage</span>
                                                <span className="text-sm font-bold">
                                                    {zone.fill_percentage}%
                                                </span>
                                            </div>
                                            <EcoProgress
                                                value={zone.fill_percentage}
                                                max={100}
                                                variant={
                                                    zone.fill_percentage > 90 ? 'danger' :
                                                    zone.fill_percentage > 70 ? 'warning' : 'success'
                                                }
                                                size="md"
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Eye size={14} />}
                                                onClick={() => setSelectedZone(zone)}
                                                className="cursor-pointer"
                                            >
                                                Voir
                                            </EcoButton>
                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Edit size={14} />}
                                                onClick={() => handleEditZone(zone)}
                                                className="cursor-pointer"
                                            >
                                                Modifier
                                            </EcoButton>
                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={zone.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                                                onClick={() => handleToggleStatus(zone)}
                                                className="cursor-pointer"
                                            >
                                                {zone.is_active ? 'Désactiver' : 'Activer'}
                                            </EcoButton>
                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Trash2 size={14} />}
                                                onClick={() => handleDeleteZone(zone)}
                                                className="cursor-pointer"
                                            >
                                                Supprimer
                                            </EcoButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {zones.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                                <div className="text-sm text-muted-foreground">
                                    Affichage de {((zones.current_page - 1) * zones.per_page) + 1} à{' '}
                                    {Math.min(zones.current_page * zones.per_page, zones.total)} sur {zones.total} zones
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={zones.current_page === 1}
                                    >
                                        Précédent
                                    </EcoButton>
                                    
                                    <span className="px-3 py-1 text-sm">
                                        Page {zones.current_page} sur {zones.last_page}
                                    </span>
                                    
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={zones.current_page === zones.last_page}
                                    >
                                        Suivant
                                    </EcoButton>
                                </div>
                            </div>
                        )}
                    </EcoCardContent>
                </EcoCard>
            </div>

            {/* Modals */}
            <ZoneFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                districts={districts}
                onSuccess={handleModalSuccess}
            />

            <ZoneFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setZoneToEdit(null);
                }}
                zone={zoneToEdit}
                districts={districts}
                onSuccess={handleModalSuccess}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setZoneToDelete(null);
                }}
                title="Supprimer la Zone"
                message="Êtes-vous sûr de vouloir supprimer cette zone de collecte ?"
                itemName={zoneToDelete?.name || ''}
                deleteUrl={`/admin/zones/${zoneToDelete?.id}`}
                onSuccess={handleModalSuccess}
                warningMessage="Cette action est irréversible. Tous les signalements associés à cette zone seront également supprimés."
            />
        </AdminLayout>
    );
}
