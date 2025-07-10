import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import LocationPicker from '@/components/maps/LocationPicker';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoBadge } from '@/components/ui/eco-badge';
import { 
    MapPin, 
    Camera, 
    AlertTriangle, 
    Clock, 
    Trash2,
    Upload,
    X,
    CheckCircle
} from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    district: string;
    coordinates: { lat: number; lng: number };
}

interface ReportPageProps {
    zones: Zone[];
    selectedZone?: Zone;
}

interface ReportForm {
    waste_collection_zone_id: number | null;
    fill_level: number;
    priority: 'low' | 'medium' | 'high';
    description: string;
    photos: File[];
    coordinates: { lat: number; lng: number } | null;
}

export default function ReportPage({ zones, selectedZone }: ReportPageProps) {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(
        selectedZone ? { ...selectedZone.coordinates } : null
    );
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm<ReportForm>({
        waste_collection_zone_id: selectedZone?.id || null,
        fill_level: 50,
        priority: 'medium',
        description: '',
        photos: [],
        coordinates: selectedZone?.coordinates || null,
    });

    const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
        setSelectedLocation(location);
        setData('coordinates', { lat: location.lat, lng: location.lng });
        
        // Trouver la zone la plus proche
        if (zones.length > 0) {
            const nearestZone = zones.reduce((nearest, zone) => {
                const distance = Math.sqrt(
                    Math.pow(zone.coordinates.lat - location.lat, 2) + 
                    Math.pow(zone.coordinates.lng - location.lng, 2)
                );
                const nearestDistance = Math.sqrt(
                    Math.pow(nearest.coordinates.lat - location.lat, 2) + 
                    Math.pow(nearest.coordinates.lng - location.lng, 2)
                );
                return distance < nearestDistance ? zone : nearest;
            });
            setData('waste_collection_zone_id', nearestZone.id);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + data.photos.length > 5) {
            alert('Maximum 5 photos autorisées');
            return;
        }

        const newPhotos = [...data.photos, ...files];
        setData('photos', newPhotos);

        // Créer les aperçus
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        const newPhotos = data.photos.filter((_, i) => i !== index);
        setData('photos', newPhotos);
        setPhotoPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.coordinates) {
            alert('Veuillez sélectionner une position sur la carte');
            return;
        }
        
        if (!data.waste_collection_zone_id) {
            alert('Veuillez sélectionner une zone de collecte');
            return;
        }

        post(route('citizen.report.store'), {
            onSuccess: () => {
                reset();
                setPhotoPreview([]);
                setSelectedLocation(null);
            }
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-eco-red text-white';
            case 'medium': return 'bg-eco-orange text-white';
            case 'low': return 'bg-eco-green text-white';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Urgente';
            case 'medium': return 'Moyenne';
            case 'low': return 'Faible';
            default: return priority;
        }
    };

    return (
        <CitizenLayout title="Nouveau Signalement">
            <Head title="Nouveau Signalement" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* En-tête */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold eco-text-gradient mb-2">
                        Nouveau Signalement
                    </h1>
                    <p className="text-gray-600">
                        Aidez-nous à maintenir votre quartier propre
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sélection de la position */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <MapPin size={20} />
                                <span>Position du Problème</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                                initialLocation={selectedZone?.coordinates}
                                height="300px"
                                showSearch={true}
                            />
                            {errors.coordinates && (
                                <p className="text-eco-red text-sm mt-2">{errors.coordinates}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Sélection de la zone */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle>Zone de Collecte</EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {zones.map((zone) => (
                                    <div
                                        key={zone.id}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                            data.waste_collection_zone_id === zone.id
                                                ? 'border-eco-green bg-eco-green/10'
                                                : 'border-border hover:border-eco-green/50'
                                        }`}
                                        onClick={() => setData('waste_collection_zone_id', zone.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">{zone.name}</h3>
                                                <p className="text-sm text-muted-foreground">{zone.district}</p>
                                            </div>
                                            {data.waste_collection_zone_id === zone.id && (
                                                <CheckCircle size={20} className="text-eco-green" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.waste_collection_zone_id && (
                                <p className="text-eco-red text-sm mt-2">{errors.waste_collection_zone_id}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Niveau de remplissage */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <Trash2 size={20} />
                                <span>Niveau de Remplissage</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Estimation: {data.fill_level}%</span>
                                    <EcoBadge 
                                        variant={data.fill_level > 80 ? 'danger' : data.fill_level > 50 ? 'warning' : 'success'}
                                    >
                                        {data.fill_level > 80 ? 'Pleine' : data.fill_level > 50 ? 'À moitié' : 'Peu remplie'}
                                    </EcoBadge>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={data.fill_level}
                                    onChange={(e) => setData('fill_level', parseInt(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Vide</span>
                                    <span>Pleine</span>
                                </div>
                            </div>
                            {errors.fill_level && (
                                <p className="text-eco-red text-sm mt-2">{errors.fill_level}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Priorité */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <Clock size={20} />
                                <span>Niveau de Priorité</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="grid grid-cols-3 gap-3">
                                {(['low', 'medium', 'high'] as const).map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            data.priority === priority
                                                ? `border-eco-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'} ${getPriorityColor(priority)}`
                                                : 'border-border hover:border-muted-foreground'
                                        }`}
                                        onClick={() => setData('priority', priority)}
                                    >
                                        <div className="text-center">
                                            {priority === 'high' && <AlertTriangle size={24} className="mx-auto mb-2" />}
                                            {priority === 'medium' && <Clock size={24} className="mx-auto mb-2" />}
                                            {priority === 'low' && <Trash2 size={24} className="mx-auto mb-2" />}
                                            <div className="font-medium">{getPriorityLabel(priority)}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.priority && (
                                <p className="text-eco-red text-sm mt-2">{errors.priority}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Description */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle>Description (Optionnel)</EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <textarea
                                className="w-full p-3 border border-border rounded-xl resize-none focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green transition-all duration-300"
                                rows={4}
                                placeholder="Décrivez le problème observé..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && (
                                <p className="text-eco-red text-sm mt-2">{errors.description}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Photos */}
                    <EcoCard>
                        <EcoCardHeader>
                            <EcoCardTitle className="flex items-center space-x-2">
                                <Camera size={20} />
                                <span>Photos (Optionnel)</span>
                            </EcoCardTitle>
                        </EcoCardHeader>
                        <EcoCardContent>
                            <div className="space-y-4">
                                {photoPreview.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {photoPreview.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`Aperçu ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-eco-red text-white rounded-full flex items-center justify-center hover:bg-eco-red/80 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {data.photos.length < 5 && (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-eco-green/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload size={24} className="mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">
                                                Cliquez pour ajouter des photos
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PNG, JPG jusqu'à 2MB ({data.photos.length}/5)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.photos && (
                                <p className="text-eco-red text-sm mt-2">{errors.photos}</p>
                            )}
                        </EcoCardContent>
                    </EcoCard>

                    {/* Bouton de soumission */}
                    <EcoButton
                        type="submit"
                        className="w-full"
                        size="lg"
                        loading={processing}
                        disabled={!data.coordinates || !data.waste_collection_zone_id}
                    >
                        Envoyer le Signalement
                    </EcoButton>
                </form>
            </div>
        </CitizenLayout>
    );
}
