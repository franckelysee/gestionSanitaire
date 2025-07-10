import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import { EcoCard } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { MapPin, Search, Navigation, Target } from 'lucide-react';

interface LocationPickerProps {
    onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
    initialLocation?: { lat: number; lng: number };
    height?: string;
    className?: string;
    showSearch?: boolean;
}

export default function LocationPicker({
    onLocationSelect,
    initialLocation = { lat: 3.8480, lng: 11.5021 },
    height = '300px',
    className,
    showSearch = true
}: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

    useEffect(() => {
        const initMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
                    version: 'weekly',
                    libraries: ['places']
                });

                const google = await loader.load();
                
                if (!mapRef.current) return;

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: initialLocation,
                    zoom: 15,
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
                        }
                    ],
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                const geocoderInstance = new google.maps.Geocoder();
                setGeocoder(geocoderInstance);

                // Marker draggable
                const markerInstance = new google.maps.Marker({
                    position: initialLocation,
                    map: mapInstance,
                    draggable: true,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#ef4444',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 3,
                    },
                    title: 'Faites glisser pour sélectionner la position'
                });

                setMap(mapInstance);
                setMarker(markerInstance);
                setSelectedLocation(initialLocation);
                setIsLoading(false);

                // Géocodage inverse pour l'adresse initiale
                reverseGeocode(initialLocation, geocoderInstance);

                // Gestionnaire de drag du marker
                markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const newLocation = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        setSelectedLocation(newLocation);
                        reverseGeocode(newLocation, geocoderInstance);
                    }
                });

                // Gestionnaire de clic sur la carte
                mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const newLocation = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        markerInstance.setPosition(newLocation);
                        setSelectedLocation(newLocation);
                        reverseGeocode(newLocation, geocoderInstance);
                    }
                });

            } catch (err) {
                setIsLoading(false);
                console.error('Erreur Google Maps:', err);
            }
        };

        initMap();
    }, []);

    // Géocodage inverse pour obtenir l'adresse
    const reverseGeocode = (location: { lat: number; lng: number }, geocoderInstance: google.maps.Geocoder) => {
        geocoderInstance.geocode(
            { location: new google.maps.LatLng(location.lat, location.lng) },
            (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const formattedAddress = results[0].formatted_address;
                    setAddress(formattedAddress);
                    onLocationSelect({
                        ...location,
                        address: formattedAddress
                    });
                } else {
                    setAddress('Adresse non trouvée');
                    onLocationSelect(location);
                }
            }
        );
    };

    // Recherche d'adresse
    const searchAddress = () => {
        if (!geocoder || !searchQuery.trim()) return;

        geocoder.geocode(
            { address: searchQuery + ', Cameroun' },
            (results, status) => {
                if (status === 'OK' && results && results[0] && map && marker) {
                    const location = results[0].geometry.location;
                    const newLocation = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    
                    map.setCenter(newLocation);
                    marker.setPosition(newLocation);
                    setSelectedLocation(newLocation);
                    setAddress(results[0].formatted_address);
                    
                    onLocationSelect({
                        ...newLocation,
                        address: results[0].formatted_address
                    });
                } else {
                    alert('Adresse non trouvée. Veuillez réessayer.');
                }
            }
        );
    };

    // Obtenir la position actuelle
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    if (map && marker) {
                        map.setCenter(userLocation);
                        marker.setPosition(userLocation);
                        setSelectedLocation(userLocation);
                        reverseGeocode(userLocation, geocoder!);
                    }
                },
                (error) => {
                    alert('Impossible d\'obtenir votre position. Veuillez autoriser la géolocalisation.');
                }
            );
        } else {
            alert('La géolocalisation n\'est pas supportée par votre navigateur.');
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            {/* Barre de recherche */}
            {showSearch && (
                <div className="flex space-x-2">
                    <EcoInput
                        placeholder="Rechercher une adresse..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                        icon={<Search size={18} />}
                        className="flex-1"
                    />
                    <EcoButton
                        variant="secondary"
                        onClick={searchAddress}
                        disabled={!searchQuery.trim()}
                    >
                        <Search size={16} />
                    </EcoButton>
                    <EcoButton
                        variant="outline"
                        onClick={getCurrentLocation}
                        title="Ma position"
                    >
                        <Navigation size={16} />
                    </EcoButton>
                </div>
            )}

            {/* Carte */}
            <div className="relative">
                {isLoading && (
                    <EcoCard className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-eco-green border-t-transparent mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        </div>
                    </EcoCard>
                )}
                
                <div 
                    ref={mapRef} 
                    style={{ height }} 
                    className="w-full rounded-xl overflow-hidden border border-border/50"
                />

                {/* Instructions */}
                <div className="absolute top-4 left-4">
                    <EcoCard variant="glass" className="p-3">
                        <div className="flex items-center space-x-2 text-sm">
                            <Target size={16} className="text-eco-green" />
                            <span>Cliquez ou faites glisser pour sélectionner</span>
                        </div>
                    </EcoCard>
                </div>
            </div>

            {/* Adresse sélectionnée */}
            {address && (
                <EcoCard className="p-4">
                    <div className="flex items-start space-x-3">
                        <MapPin size={20} className="text-eco-green mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-sm mb-1">Position sélectionnée</h4>
                            <p className="text-sm text-muted-foreground">{address}</p>
                            {selectedLocation && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                </p>
                            )}
                        </div>
                    </div>
                </EcoCard>
            )}
        </div>
    );
}
