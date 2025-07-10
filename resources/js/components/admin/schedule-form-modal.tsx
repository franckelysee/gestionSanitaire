import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoBadge } from '@/components/ui/eco-badge';
import { 
    X, 
    Calendar,
    Clock,
    Truck,
    Users,
    MapPin,
    Save,
    Plus,
    Route
} from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    district: string;
    priority_level: string;
}

interface Team {
    id: number;
    name: string;
    members_count: number;
}

interface Vehicle {
    id: number;
    name: string;
    capacity: number;
    is_available: boolean;
}

interface Schedule {
    id?: number;
    name: string;
    scheduled_date: string;
    start_time: string;
    estimated_duration: number;
    team_id: number;
    vehicle_id: number;
    zones: number[];
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
}

interface ScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule?: Schedule;
    zones: Zone[];
    teams: Team[];
    vehicles: Vehicle[];
    onSuccess?: () => void;
}

export default function ScheduleFormModal({ 
    isOpen, 
    onClose, 
    schedule, 
    zones, 
    teams, 
    vehicles, 
    onSuccess 
}: ScheduleFormModalProps) {
    const [selectedZones, setSelectedZones] = useState<number[]>(schedule?.zones || []);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: schedule?.name || '',
        scheduled_date: schedule?.scheduled_date || '',
        start_time: schedule?.start_time || '08:00',
        estimated_duration: schedule?.estimated_duration || 4,
        team_id: schedule?.team_id || '',
        vehicle_id: schedule?.vehicle_id || '',
        zones: schedule?.zones || [],
        status: schedule?.status || 'planned',
        notes: schedule?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            zones: selectedZones,
        };

        if (schedule?.id) {
            put(`/admin/schedules/${schedule.id}`, {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        } else {
            post('/admin/schedules', {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleZoneToggle = (zoneId: number) => {
        setSelectedZones(prev => {
            const newZones = prev.includes(zoneId)
                ? prev.filter(id => id !== zoneId)
                : [...prev, zoneId];
            setData('zones', newZones);
            return newZones;
        });
    };

    const getEstimatedEndTime = () => {
        if (!data.start_time || !data.estimated_duration) return '';
        
        const [hours, minutes] = data.start_time.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + (data.estimated_duration * 60);
        
        const endHours = Math.floor(endMinutes / 60) % 24;
        const endMins = endMinutes % 60;
        
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <EcoCard className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <EcoCardHeader>
                    <EcoCardTitle className="flex items-center justify-between">
                        <span>
                            {schedule ? 'Modifier la Tournée' : 'Nouvelle Tournée de Collecte'}
                        </span>
                        <EcoButton 
                            variant="ghost" 
                            size="icon"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            <X size={16} />
                        </EcoButton>
                    </EcoCardTitle>
                </EcoCardHeader>
                <EcoCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EcoInput
                                label="Nom de la tournée"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                icon={<Route size={18} />}
                                required
                                placeholder="Ex: Tournée Centre-ville Matin"
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                >
                                    <option value="planned">Planifiée</option>
                                    <option value="in_progress">En cours</option>
                                    <option value="completed">Terminée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>
                        </div>

                        {/* Planification */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <EcoInput
                                label="Date de collecte"
                                type="date"
                                value={data.scheduled_date}
                                onChange={(e) => setData('scheduled_date', e.target.value)}
                                error={errors.scheduled_date}
                                icon={<Calendar size={18} />}
                                required
                            />
                            
                            <EcoInput
                                label="Heure de début"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                error={errors.start_time}
                                icon={<Clock size={18} />}
                                required
                            />
                            
                            <EcoInput
                                label="Durée estimée (heures)"
                                type="number"
                                min="1"
                                max="12"
                                step="0.5"
                                value={data.estimated_duration}
                                onChange={(e) => setData('estimated_duration', parseFloat(e.target.value))}
                                error={errors.estimated_duration}
                                icon={<Clock size={18} />}
                                required
                                help={`Fin estimée: ${getEstimatedEndTime()}`}
                            />
                        </div>

                        {/* Équipe et véhicule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Équipe assignée
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.team_id}
                                    onChange={(e) => setData('team_id', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Sélectionner une équipe</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} ({team.members_count} membres)
                                        </option>
                                    ))}
                                </select>
                                {errors.team_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.team_id}</p>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Véhicule assigné
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.vehicle_id}
                                    onChange={(e) => setData('vehicle_id', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Sélectionner un véhicule</option>
                                    {vehicles.filter(v => v.is_available).map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name} (Capacité: {vehicle.capacity}L)
                                        </option>
                                    ))}
                                </select>
                                {errors.vehicle_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.vehicle_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Sélection des zones */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Zones à collecter ({selectedZones.length} sélectionnées)
                            </label>
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {zones.map((zone) => (
                                        <label 
                                            key={zone.id}
                                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedZones.includes(zone.id)}
                                                onChange={() => handleZoneToggle(zone.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{zone.name}</p>
                                                <p className="text-xs text-gray-600">{zone.district}</p>
                                            </div>
                                            <EcoBadge 
                                                variant={
                                                    zone.priority_level === 'high' ? 'danger' :
                                                    zone.priority_level === 'medium' ? 'warning' : 'success'
                                                }
                                                size="sm"
                                            >
                                                {zone.priority_level}
                                            </EcoBadge>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {errors.zones && (
                                <p className="text-red-500 text-sm mt-1">{errors.zones}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes et instructions (optionnel)
                            </label>
                            <textarea 
                                className="eco-input min-h-[80px] resize-none"
                                placeholder="Instructions spéciales, points d'attention, matériel nécessaire..."
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>

                        {/* Résumé */}
                        {selectedZones.length > 0 && (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-2">Résumé de la tournée</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700">Zones:</span>
                                        <span className="ml-2 font-medium">{selectedZones.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Durée:</span>
                                        <span className="ml-2 font-medium">{data.estimated_duration}h</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700">Horaire:</span>
                                        <span className="ml-2 font-medium">
                                            {data.start_time} - {getEstimatedEndTime()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <EcoButton 
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="cursor-pointer"
                            >
                                Annuler
                            </EcoButton>
                            <EcoButton 
                                type="submit"
                                disabled={processing || selectedZones.length === 0}
                                icon={<Save size={16} />}
                                className="cursor-pointer"
                            >
                                {processing ? 'Enregistrement...' : (schedule ? 'Modifier' : 'Créer')}
                            </EcoButton>
                        </div>
                    </form>
                </EcoCardContent>
            </EcoCard>
        </div>
    );
}
