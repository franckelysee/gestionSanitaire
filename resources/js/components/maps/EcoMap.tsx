import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import { EcoCard } from '@/components/ui/eco-card';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoButton } from '@/components/ui/eco-button';
import { MapPin, Navigation, Zap, AlertTriangle } from 'lucide-react';

interface WasteZone {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    fillLevel: number;
    priority: 'low' | 'medium' | 'high';
    capacity: number;
    lastEmptied: string;
    zoneType: 'residential' | 'commercial' | 'industrial' | 'public';
}

interface EcoMapProps {
    zones: WasteZone[];
    center?: { lat: number; lng: number };
    zoom?: number;
    height?: string;
    onZoneClick?: (zone: WasteZone) => void;
    onLocationSelect?: (location: { lat: number; lng: number }) => void;
    showHeatmap?: boolean;
    showUserLocation?: boolean;
    className?: string;
}

export default function EcoMap({
    zones,
    center = { lat: 3.8480, lng: 11.5021 }, // Yaoundé par défaut
    zoom = 12,
    height = '400px',
    onZoneClick,
    onLocationSelect,
    showHeatmap = true,
    showUserLocation = true,
    className
}: EcoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedZone, setSelectedZone] = useState<WasteZone | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialiser Google Maps
    useEffect(() => {
        const initMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
                    version: 'weekly',
                    libraries: ['visualization', 'geometry']
                });

                const google = await loader.load();
                
                if (!mapRef.current) return;

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    styles: [
                        {
                            featureType: 'all',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#f5f5f5' }]
                        },
                        {
                            featureType: 'water',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#c9e7f0' }]
                        },
                        {
                            featureType: 'road',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#ffffff' }]
                        },
                        {
                            featureType: 'poi.park',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#e8f5e8' }]
                        }
                    ],
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                setMap(mapInstance);
                setIsLoading(false);

                // Ajouter les markers pour les zones
                zones.forEach(zone => {
                    createZoneMarker(mapInstance, zone, google);
                });

                // Créer la heatmap si activée
                if (showHeatmap) {
                    createHeatmap(mapInstance, zones, google);
                }

                // Géolocalisation utilisateur
                if (showUserLocation) {
                    getUserLocation(mapInstance, google);
                }

                // Gestionnaire de clic sur la carte
                if (onLocationSelect) {
                    mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
                        if (event.latLng) {
                            onLocationSelect({
                                lat: event.latLng.lat(),
                                lng: event.latLng.lng()
                            });
                        }
                    });
                }

            } catch (err) {
                setError('Erreur lors du chargement de la carte');
                setIsLoading(false);
                console.error('Erreur Google Maps:', err);
            }
        };

        initMap();
    }, []);

    // Créer un marker pour une zone
    const createZoneMarker = (map: google.maps.Map, zone: WasteZone, google: any) => {
        const fillPercentage = (zone.fillLevel / zone.capacity) * 100;
        
        // Couleur basée sur le niveau de remplissage
        let color = '#10b981'; // Vert (faible)
        if (fillPercentage > 70) color = '#f59e0b'; // Orange (moyen)
        if (fillPercentage > 90) color = '#ef4444'; // Rouge (élevé)

        // Icône personnalisée
        const icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 3,
        };

        const marker = new google.maps.Marker({
            position: zone.coordinates,
            map,
            icon,
            title: zone.name,
            animation: zone.priority === 'high' ? google.maps.Animation.BOUNCE : undefined,
        });

        // InfoWindow personnalisée
        const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(zone, fillPercentage)
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
            setSelectedZone(zone);
            onZoneClick?.(zone);
        });

        return marker;
    };

    // Créer le contenu de l'InfoWindow
    const createInfoWindowContent = (zone: WasteZone, fillPercentage: number) => {
        const priorityColors = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#ef4444'
        };

        return `
            <div class="p-4 max-w-xs">
                <h3 class="font-bold text-lg mb-2">${zone.name}</h3>
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Remplissage:</span>
                        <span class="font-medium">${Math.round(fillPercentage)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full" style="width: ${fillPercentage}%; background-color: ${priorityColors[zone.priority]}"></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Priorité:</span>
                        <span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: ${priorityColors[zone.priority]}20; color: ${priorityColors[zone.priority]}">
                            ${zone.priority.toUpperCase()}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Type:</span>
                        <span class="text-sm font-medium">${zone.zoneType}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        Dernière collecte: ${zone.lastEmptied}
                    </div>
                </div>
            </div>
        `;
    };

    // Créer la heatmap
    const createHeatmap = (map: google.maps.Map, zones: WasteZone[], google: any) => {
        const heatmapData = zones.map(zone => ({
            location: new google.maps.LatLng(zone.coordinates.lat, zone.coordinates.lng),
            weight: (zone.fillLevel / zone.capacity) * 100
        }));

        const heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map,
            radius: 50,
            opacity: 0.6,
            gradient: [
                'rgba(16, 185, 129, 0)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)'
            ]
        });

        return heatmap;
    };

    // Obtenir la localisation de l'utilisateur
    const getUserLocation = (map: google.maps.Map, google: any) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    setUserLocation(userPos);

                    // Marker pour l'utilisateur
                    new google.maps.Marker({
                        position: userPos,
                        map,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2,
                        },
                        title: 'Votre position'
                    });

                    // Centrer la carte sur l'utilisateur
                    map.setCenter(userPos);
                },
                () => {
                    console.log('Géolocalisation refusée');
                }
            );
        }
    };

    if (error) {
        return (
            <EcoCard className={cn('flex items-center justify-center', className)} style={{ height }}>
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-eco-red mx-auto mb-4" />
                    <p className="text-eco-red font-medium">{error}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Vérifiez votre clé API Google Maps
                    </p>
                </div>
            </EcoCard>
        );
    }

    return (
        <div className={cn('relative', className)}>
            {isLoading && (
                <EcoCard className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-eco-green border-t-transparent mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                    </div>
                </EcoCard>
            )}
            
            <div 
                ref={mapRef} 
                style={{ height }} 
                className="w-full rounded-xl overflow-hidden"
            />
            
            {/* Contrôles de la carte */}
            <div className="absolute top-4 right-4 space-y-2">
                <EcoButton
                    variant="glass"
                    size="icon"
                    onClick={() => {
                        if (userLocation && map) {
                            map.setCenter(userLocation);
                            map.setZoom(15);
                        }
                    }}
                    disabled={!userLocation}
                >
                    <Navigation size={16} />
                </EcoButton>
            </div>

            {/* Légende */}
            <div className="absolute bottom-4 left-4">
                <EcoCard variant="glass" className="p-3">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Niveau de remplissage</h4>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-eco-green"></div>
                            <span className="text-xs">Faible (0-70%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-eco-orange"></div>
                            <span className="text-xs">Moyen (70-90%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-eco-red"></div>
                            <span className="text-xs">Élevé (90%+)</span>
                        </div>
                    </div>
                </EcoCard>
            </div>
        </div>
    );
}
