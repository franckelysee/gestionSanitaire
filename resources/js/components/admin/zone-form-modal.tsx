import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { 
    X, 
    MapPin, 
    Trash2, 
    Building,
    Users,
    AlertTriangle,
    Save
} from 'lucide-react';

interface District {
    id: number;
    name: string;
    city: {
        id: number;
        name: string;
    };
}

interface Zone {
    id?: number;
    name: string;
    district_id: number;
    coordinates: {
        lat: number;
        lng: number;
    };
    capacity_liters: number;
    zone_type: 'residential' | 'commercial' | 'industrial' | 'public';
    priority_level: 'low' | 'medium' | 'high';
    is_active: boolean;
    description?: string;
}

interface ZoneFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    zone?: Zone;
    districts: District[];
    onSuccess?: () => void;
}

export default function ZoneFormModal({ 
    isOpen, 
    onClose, 
    zone, 
    districts, 
    onSuccess 
}: ZoneFormModalProps) {
    const [isMapOpen, setIsMapOpen] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: zone?.name || '',
        district_id: zone?.district_id || '',
        coordinates_lat: zone?.coordinates?.lat || 3.848,
        coordinates_lng: zone?.coordinates?.lng || 11.502,
        capacity_liters: zone?.capacity_liters || 1000,
        zone_type: zone?.zone_type || 'residential',
        priority_level: zone?.priority_level || 'medium',
        is_active: zone?.is_active ?? true,
        description: zone?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Préparer les données avec les coordonnées combinées
        const submitData = {
            ...data,
            coordinates: JSON.stringify({
                lat: data.coordinates_lat,
                lng: data.coordinates_lng
            })
        };

        if (zone?.id) {
            put(`/admin/zones/${zone.id}`, {
                ...submitData,
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        } else {
            post('/admin/zones', {
                ...submitData,
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleMapClick = (lat: number, lng: number) => {
        setData('coordinates_lat', lat);
        setData('coordinates_lng', lng);
        setIsMapOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <EcoCard className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <EcoCardHeader>
                    <EcoCardTitle className="flex items-center justify-between">
                        <span>
                            {zone ? 'Modifier la Zone' : 'Nouvelle Zone de Collecte'}
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
                                label="Nom de la zone"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                icon={<Building size={18} />}
                                required
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quartier
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.district_id}
                                    onChange={(e) => setData('district_id', parseInt(e.target.value))}
                                    required
                                >
                                    <option value="">Sélectionner un quartier</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.id}>
                                            {district.name} - {district.city.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.district_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.district_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Localisation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coordonnées GPS
                            </label>
                            <div className="flex items-center space-x-2">
                                <EcoInput
                                    placeholder="Latitude"
                                    type="number"
                                    step="any"
                                    value={data.coordinates_lat}
                                    onChange={(e) => setData('coordinates_lat', parseFloat(e.target.value))}
                                    className="flex-1"
                                />
                                <EcoInput
                                    placeholder="Longitude"
                                    type="number"
                                    step="any"
                                    value={data.coordinates_lng}
                                    onChange={(e) => setData('coordinates_lng', parseFloat(e.target.value))}
                                    className="flex-1"
                                />
                                <EcoButton 
                                    type="button"
                                    variant="outline"
                                    icon={<MapPin size={16} />}
                                    onClick={() => setIsMapOpen(true)}
                                    className="cursor-pointer"
                                >
                                    Carte
                                </EcoButton>
                            </div>
                            {(errors.coordinates_lat || errors.coordinates_lng) && (
                                <p className="text-red-500 text-sm mt-1">Coordonnées invalides</p>
                            )}
                        </div>

                        {/* Caractéristiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <EcoInput
                                label="Capacité (litres)"
                                type="number"
                                min="100"
                                max="10000"
                                value={data.capacity_liters}
                                onChange={(e) => setData('capacity_liters', parseInt(e.target.value))}
                                error={errors.capacity_liters}
                                icon={<Trash2 size={18} />}
                                required
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de zone
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.zone_type}
                                    onChange={(e) => setData('zone_type', e.target.value as any)}
                                >
                                    <option value="residential">Résidentiel</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="industrial">Industriel</option>
                                    <option value="public">Public</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priorité
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.priority_level}
                                    onChange={(e) => setData('priority_level', e.target.value as any)}
                                >
                                    <option value="low">Faible</option>
                                    <option value="medium">Moyenne</option>
                                    <option value="high">Élevée</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (optionnelle)
                            </label>
                            <textarea 
                                className="eco-input min-h-[80px] resize-none"
                                placeholder="Description de la zone, points de repère, instructions spéciales..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </div>

                        {/* Statut */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 cursor-pointer"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Zone active (visible pour les signalements)
                            </label>
                        </div>

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
                                disabled={processing}
                                icon={<Save size={16} />}
                                className="cursor-pointer"
                            >
                                {processing ? 'Enregistrement...' : (zone ? 'Modifier' : 'Créer')}
                            </EcoButton>
                        </div>
                    </form>
                </EcoCardContent>
            </EcoCard>

            {/* Modal de carte (simplifié pour l'exemple) */}
            {isMapOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMapOpen(false)}
                    />
                    <EcoCard className="relative max-w-4xl w-full h-96">
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center justify-between">
                                <span>Sélectionner la Position</span>
                                <EcoButton 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setIsMapOpen(false)}
                                    className="cursor-pointer"
                                >
                                    <X size={16} />
                                </EcoButton>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-600">Carte interactive à implémenter</p>
                                    <p className="text-sm text-gray-500">
                                        Position actuelle: {data.coordinates_lat.toFixed(6)}, {data.coordinates_lng.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>
            )}
        </div>
    );
}
