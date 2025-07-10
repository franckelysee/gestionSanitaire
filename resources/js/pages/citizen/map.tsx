import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import EcoMap from '@/components/maps/EcoMap';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';

import { 
    MapPin, 
    AlertTriangle, 
    Clock, 
    Trash2, 
    Filter,
    Layers,
    Navigation,
    Plus
} from 'lucide-react';

interface WasteZone {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    fillLevel: number;
    priority: 'low' | 'medium' | 'high';
    capacity: number;
    lastEmptied: string;
    zoneType: 'residential' | 'commercial' | 'industrial' | 'public';
    district: string;
}

interface MapPageProps {
    zones: WasteZone[];
    stats: {
        totalZones: number;
        urgentZones: number;
        averageFillLevel: number;
        lastUpdate: string;
    };
}

export default function MapPage({ zones, stats }: MapPageProps) {
    const [selectedZone, setSelectedZone] = useState<WasteZone | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    // Filtrer les zones selon la priorité
    const filteredZones = zones.filter(zone => 
        filterPriority === 'all' || zone.priority === filterPriority
    );

    const handleZoneClick = (zone: WasteZone) => {
        setSelectedZone(zone);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-eco-red';
            case 'medium': return 'text-eco-orange';
            case 'low': return 'text-eco-green';
            default: return 'text-muted-foreground';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertTriangle size={16} />;
            case 'medium': return <Clock size={16} />;
            case 'low': return <Trash2 size={16} />;
            default: return <MapPin size={16} />;
        }
    };

    return (
        <CitizenLayout title="Carte Interactive">
            <Head title="Carte Interactive" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold eco-text-gradient">
                            Carte Interactive
                        </h1>
                        <p className="text-gray-600">
                            Visualisez l'état des zones de collecte en temps réel
                        </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <EcoButton
                            variant={showHeatmap ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            icon={<Layers size={16} />}
                        >
                            Heatmap
                        </EcoButton>
                        
                        <EcoButton
                            variant="default"
                            size="sm"
                            icon={<Plus size={16} />}
                            onClick={() => window.location.href = '/citizen/report'}
                        >
                            Signaler
                        </EcoButton>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                                <MapPin size={20} className="text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {stats.totalZones}
                            </div>
                            <div className="text-sm text-gray-600">
                                Zones Totales
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {stats.urgentZones}
                            </div>
                            <div className="text-sm text-gray-600">
                                Zones Urgentes
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                                <Trash2 size={20} className="text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-orange-600 mb-1">
                                {stats.averageFillLevel}%
                            </div>
                            <div className="text-sm text-gray-600">
                                Remplissage Moyen
                            </div>
                        </EcoCardContent>
                    </EcoCard>

                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                                <Clock size={20} className="text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                5min
                            </div>
                            <div className="text-sm text-gray-600">
                                Dernière MAJ
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Filtres */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle className="flex items-center space-x-2">
                            <Filter size={20} />
                            <span>Filtres</span>
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'high', 'medium', 'low'].map((priority) => (
                                <EcoButton
                                    key={priority}
                                    variant={filterPriority === priority ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterPriority(priority as any)}
                                >
                                    {priority === 'all' ? 'Toutes' : 
                                     priority === 'high' ? 'Urgente' :
                                     priority === 'medium' ? 'Moyenne' : 'Faible'}
                                </EcoButton>
                            ))}
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Carte */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <EcoCard>
                            <EcoCardContent className="p-0">
                                <EcoMap
                                    zones={filteredZones}
                                    height="500px"
                                    onZoneClick={handleZoneClick}
                                    showHeatmap={showHeatmap}
                                    showUserLocation={true}
                                />
                            </EcoCardContent>
                        </EcoCard>
                    </div>

                    {/* Panneau latéral */}
                    <div className="space-y-4">
                        {selectedZone ? (
                            <EcoCard>
                                <EcoCardHeader>
                                    <EcoCardTitle className="flex items-center justify-between">
                                        <span>{selectedZone.name}</span>
                                        <EcoBadge priority={selectedZone.priority}>
                                            {selectedZone.priority.toUpperCase()}
                                        </EcoBadge>
                                    </EcoCardTitle>
                                </EcoCardHeader>
                                <EcoCardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Remplissage</span>
                                            <span className="font-medium">
                                                {Math.round((selectedZone.fillLevel / selectedZone.capacity) * 100)}%
                                            </span>
                                        </div>
                                        
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full bg-eco-green"
                                                style={{ 
                                                    width: `${(selectedZone.fillLevel / selectedZone.capacity) * 100}%`,
                                                    backgroundColor: selectedZone.priority === 'high' ? '#ef4444' :
                                                                   selectedZone.priority === 'medium' ? '#f59e0b' : '#10b981'
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Type</span>
                                                <p className="font-medium capitalize">{selectedZone.zoneType}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Quartier</span>
                                                <p className="font-medium">{selectedZone.district}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-muted-foreground text-sm">Dernière collecte</span>
                                            <p className="font-medium">{selectedZone.lastEmptied}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/50">
                                        <EcoButton 
                                            className="w-full" 
                                            icon={<AlertTriangle size={16} />}
                                            onClick={() => window.location.href = `/citizen/report?zone=${selectedZone.id}`}
                                        >
                                            Signaler un problème
                                        </EcoButton>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        ) : (
                            <EcoCard>
                                <EcoCardContent className="text-center py-8">
                                    <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                                    <h3 className="font-medium mb-2">Sélectionnez une zone</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Cliquez sur un marqueur de la carte pour voir les détails
                                    </p>
                                </EcoCardContent>
                            </EcoCard>
                        )}

                        {/* Zones urgentes */}
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle className="flex items-center space-x-2 text-eco-red">
                                    <AlertTriangle size={20} />
                                    <span>Zones Urgentes</span>
                                </EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="space-y-3">
                                    {zones.filter(z => z.priority === 'high').slice(0, 3).map((zone) => (
                                        <div 
                                            key={zone.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-eco-red/5 border border-eco-red/20 cursor-pointer hover:bg-eco-red/10 transition-colors"
                                            onClick={() => setSelectedZone(zone)}
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{zone.name}</p>
                                                <p className="text-xs text-muted-foreground">{zone.district}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-eco-red">
                                                    {Math.round((zone.fillLevel / zone.capacity) * 100)}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                </div>
            </div>
        </CitizenLayout>
    );
}
