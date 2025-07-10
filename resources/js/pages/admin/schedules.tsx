import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoInput } from '@/components/ui/eco-input';
import ScheduleFormModal from '@/components/admin/schedule-form-modal';
import DeleteConfirmationModal from '@/components/admin/delete-confirmation-modal';
import {
    Calendar,
    Plus,
    MapPin,
    Clock,
    Truck,
    Users,
    Route,
    AlertTriangle,
    CheckCircle,
    Edit,
    Trash2,
    Play,
    Pause,
    Search,
    Filter,
    Eye,
    X
} from 'lucide-react';

interface Schedule {
    id: number;
    name: string;
    date: string;
    time: string;
    zones: Array<{
        id: number;
        name: string;
        district: string;
        priority: string;
        estimated_time: number;
    }>;
    team: {
        driver: string;
        collectors: string[];
    };
    vehicle: {
        id: number;
        plate: string;
        capacity: number;
    };
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    estimated_duration: number;
    actual_duration?: number;
    distance: number;
}

interface SchedulesPageProps {
    schedules: Schedule[];
    available_zones: Array<{
        id: number;
        name: string;
        district: string;
        priority: string;
        fill_level: number;
    }>;
    teams: Array<{
        id: number;
        driver: string;
        collectors: string[];
    }>;
    vehicles: Array<{
        id: number;
        plate: string;
        capacity: number;
        status: string;
    }>;
}

export default function SchedulesPage({ schedules, available_zones, teams, vehicles }: SchedulesPageProps) {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    // États pour les modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

    // Fonctions de gestion des actions
    const handleCreateSchedule = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditSchedule = (schedule: Schedule) => {
        setScheduleToEdit(schedule);
        setIsEditModalOpen(true);
    };

    const handleDeleteSchedule = (schedule: Schedule) => {
        setScheduleToDelete(schedule);
        setIsDeleteModalOpen(true);
    };

    const handleStartSchedule = (schedule: Schedule) => {
        // Logique pour démarrer une tournée
        console.log('Start schedule:', schedule.id);
    };

    const handleModalSuccess = () => {
        // Recharger les données ou mettre à jour l'état
        window.location.reload();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planned': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planned': return 'Planifiée';
            case 'in_progress': return 'En cours';
            case 'completed': return 'Terminée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'planned': return <Calendar size={16} />;
            case 'in_progress': return <Play size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            case 'cancelled': return <Pause size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <AdminLayout title="Planification des Tournées">
            <Head title="Planification des Tournées" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Planification des Tournées
                        </h1>
                        <p className="text-gray-600">
                            Organisez et optimisez les tournées de collecte
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <EcoInput
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-auto"
                        />
                        <EcoButton
                            icon={<Plus size={16} />}
                            onClick={handleCreateSchedule}
                            className="cursor-pointer"
                        >
                            Nouvelle Tournée
                        </EcoButton>
                    </div>
                </div>

                {/* Statistiques du jour */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                                <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {schedules.filter(s => s.status === 'planned').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Tournées Planifiées
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                                <Truck size={20} className="text-yellow-600" />
                            </div>
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {schedules.filter(s => s.status === 'in_progress').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                En Cours
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {schedules.filter(s => s.status === 'completed').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Terminées
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {available_zones.filter(z => z.fill_level > 80).length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Zones Urgentes
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des tournées */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>
                            Tournées du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="space-y-4">
                            {schedules.map((schedule) => (
                                <div 
                                    key={schedule.id}
                                    className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Informations principales */}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="font-semibold text-lg">{schedule.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.status)}`}>
                                                    <div className="flex items-center space-x-1">
                                                        {getStatusIcon(schedule.status)}
                                                        <span>{getStatusText(schedule.status)}</span>
                                                    </div>
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Clock size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{schedule.time}</p>
                                                        <p className="text-gray-600">
                                                            {schedule.estimated_duration}min estimé
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Truck size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{schedule.vehicle.plate}</p>
                                                        <p className="text-gray-600">
                                                            {schedule.vehicle.capacity}L
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Users size={16} className="text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{schedule.team.driver}</p>
                                                        <p className="text-gray-600">
                                                            +{schedule.team.collectors.length} collecteurs
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Zones à collecter */}
                                        <div className="lg:w-80">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Route size={16} className="text-gray-400" />
                                                <span className="text-sm font-medium">
                                                    {schedule.zones.length} zones • {schedule.distance}km
                                                </span>
                                            </div>
                                            <div className="space-y-1 max-h-20 overflow-y-auto">
                                                {schedule.zones.map((zone, index) => (
                                                    <div key={zone.id} className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center space-x-1">
                                                            <span className="text-gray-500">{index + 1}.</span>
                                                            <span>{zone.name}</span>
                                                        </span>
                                                        <span className={`font-medium ${getPriorityColor(zone.priority)}`}>
                                                            {zone.priority.toUpperCase()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            {schedule.status === 'planned' && (
                                                <EcoButton
                                                    variant="success"
                                                    size="sm"
                                                    icon={<Play size={14} />}
                                                    onClick={() => handleStartSchedule(schedule)}
                                                    className="cursor-pointer"
                                                >
                                                    Démarrer
                                                </EcoButton>
                                            )}

                                            {schedule.status === 'in_progress' && (
                                                <EcoButton
                                                    variant="warning"
                                                    size="sm"
                                                    icon={<Pause size={14} />}
                                                    className="cursor-pointer"
                                                >
                                                    Pause
                                                </EcoButton>
                                            )}

                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Edit size={14} />}
                                                onClick={() => handleEditSchedule(schedule)}
                                                className="cursor-pointer"
                                            >
                                                Modifier
                                            </EcoButton>

                                            <EcoButton
                                                variant="outline"
                                                size="sm"
                                                icon={<Eye size={14} />}
                                                onClick={() => setSelectedSchedule(schedule)}
                                                className="cursor-pointer"
                                            >
                                                Détails
                                            </EcoButton>

                                            {schedule.status === 'planned' && (
                                                <EcoButton
                                                    variant="outline"
                                                    size="sm"
                                                    icon={<Trash2 size={14} />}
                                                    onClick={() => handleDeleteSchedule(schedule)}
                                                    className="cursor-pointer"
                                                >
                                                    Supprimer
                                                </EcoButton>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {schedules.length === 0 && (
                                <div className="text-center py-12">
                                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                                        Aucune tournée planifiée
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Créez votre première tournée pour cette date
                                    </p>
                                    <EcoButton
                                        icon={<Plus size={16} />}
                                        onClick={handleCreateSchedule}
                                        className="cursor-pointer"
                                    >
                                        Créer une Tournée
                                    </EcoButton>
                                </div>
                            )}
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Zones nécessitant une attention */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center space-x-2">
                            <AlertTriangle size={20} className="text-red-600" />
                            <span>Zones Nécessitant une Attention</span>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {available_zones
                                .filter(zone => zone.fill_level > 70)
                                .sort((a, b) => b.fill_level - a.fill_level)
                                .slice(0, 6)
                                .map((zone) => (
                                <div 
                                    key={zone.id}
                                    className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{zone.name}</h4>
                                        <span className={`text-xs font-medium ${getPriorityColor(zone.priority)}`}>
                                            {zone.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{zone.district}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Remplissage:</span>
                                        <span className={`font-bold ${
                                            zone.fill_level > 90 ? 'text-red-600' :
                                            zone.fill_level > 80 ? 'text-yellow-600' : 'text-green-600'
                                        }`}>
                                            {zone.fill_level}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </EcoCardContent>
                </EcoCard>
            </div>

            {/* Modals */}
            <ScheduleFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                zones={available_zones.map(z => ({
                    id: z.id,
                    name: z.name,
                    district: z.district,
                    priority_level: z.priority
                }))}
                teams={teams.map(t => ({
                    id: t.id,
                    name: t.driver,
                    members_count: t.collectors.length + 1
                }))}
                vehicles={vehicles.map(v => ({
                    id: v.id,
                    name: v.plate,
                    capacity: v.capacity,
                    is_available: v.status === 'available'
                }))}
                onSuccess={handleModalSuccess}
            />

            <ScheduleFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setScheduleToEdit(null);
                }}
                schedule={scheduleToEdit}
                zones={available_zones.map(z => ({
                    id: z.id,
                    name: z.name,
                    district: z.district,
                    priority_level: z.priority
                }))}
                teams={teams.map(t => ({
                    id: t.id,
                    name: t.driver,
                    members_count: t.collectors.length + 1
                }))}
                vehicles={vehicles.map(v => ({
                    id: v.id,
                    name: v.plate,
                    capacity: v.capacity,
                    is_available: v.status === 'available'
                }))}
                onSuccess={handleModalSuccess}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setScheduleToDelete(null);
                }}
                title="Supprimer la Tournée"
                message="Êtes-vous sûr de vouloir supprimer cette tournée ?"
                itemName={scheduleToDelete?.name || ''}
                deleteUrl={`/admin/schedules/${scheduleToDelete?.id}`}
                onSuccess={handleModalSuccess}
                warningMessage="Cette action est irréversible. La tournée sera définitivement supprimée."
            />
        </AdminLayout>
    );
}
