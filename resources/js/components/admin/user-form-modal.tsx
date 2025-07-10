import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoBadge } from '@/components/ui/eco-badge';
import { 
    X, 
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Key,
    Save,
    UserPlus
} from 'lucide-react';

interface District {
    id: number;
    name: string;
    city: {
        id: number;
        name: string;
    };
}

interface UserData {
    id?: number;
    name: string;
    email: string;
    phone?: string;
    role: 'admin' | 'citizen';
    district_id?: number;
    is_active: boolean;
    points?: number;
    level?: number;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: UserData;
    districts: District[];
    onSuccess?: () => void;
}

export default function UserFormModal({ 
    isOpen, 
    onClose, 
    user, 
    districts, 
    onSuccess 
}: UserFormModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'citizen',
        district_id: user?.district_id || '',
        is_active: user?.is_active ?? true,
        password: '',
        password_confirmation: '',
        points: user?.points || 0,
        level: user?.level || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            ...data,
            district_id: data.district_id || null,
        };

        if (user?.id) {
            // Si pas de mot de passe, on ne l'envoie pas
            if (!data.password) {
                delete submitData.password;
                delete submitData.password_confirmation;
            }
            
            put(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                    reset();
                },
            });
        }
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
                            {user ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
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
                                label="Nom complet"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                icon={<User size={18} />}
                                required
                            />
                            
                            <EcoInput
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                icon={<Mail size={18} />}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <EcoInput
                                label="Téléphone (optionnel)"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                error={errors.phone}
                                icon={<Phone size={18} />}
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rôle
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value as 'admin' | 'citizen')}
                                    required
                                >
                                    <option value="citizen">Citoyen</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                )}
                            </div>
                        </div>

                        {/* Localisation (pour les citoyens) */}
                        {data.role === 'citizen' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quartier (optionnel)
                                </label>
                                <select 
                                    className="eco-input"
                                    value={data.district_id}
                                    onChange={(e) => setData('district_id', parseInt(e.target.value) || '')}
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
                        )}

                        {/* Mot de passe */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900">
                                {user ? 'Changer le mot de passe (optionnel)' : 'Mot de passe'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EcoInput
                                    label="Mot de passe"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    icon={<Key size={18} />}
                                    required={!user}
                                />
                                
                                <EcoInput
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    error={errors.password_confirmation}
                                    icon={<Key size={18} />}
                                    required={!user}
                                />
                            </div>
                        </div>

                        {/* Points et niveau (pour les citoyens existants) */}
                        {user && data.role === 'citizen' && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Gamification</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <EcoInput
                                        label="Points"
                                        type="number"
                                        min="0"
                                        value={data.points}
                                        onChange={(e) => setData('points', parseInt(e.target.value))}
                                        error={errors.points}
                                        icon={<Shield size={18} />}
                                    />
                                    
                                    <EcoInput
                                        label="Niveau"
                                        type="number"
                                        min="1"
                                        value={data.level}
                                        onChange={(e) => setData('level', parseInt(e.target.value))}
                                        error={errors.level}
                                        icon={<Shield size={18} />}
                                    />
                                </div>
                            </div>
                        )}

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
                                Compte actif (l'utilisateur peut se connecter)
                            </label>
                        </div>

                        {/* Informations supplémentaires pour modification */}
                        {user && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Informations du compte</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">ID:</span>
                                        <span className="ml-2 font-medium">#{user.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Statut:</span>
                                        <EcoBadge 
                                            variant={user.is_active ? 'success' : 'danger'} 
                                            size="sm" 
                                            className="ml-2"
                                        >
                                            {user.is_active ? 'Actif' : 'Inactif'}
                                        </EcoBadge>
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
                                disabled={processing}
                                icon={user ? <Save size={16} /> : <UserPlus size={16} />}
                                className="cursor-pointer"
                            >
                                {processing ? 'Enregistrement...' : (user ? 'Modifier' : 'Créer')}
                            </EcoButton>
                        </div>
                    </form>
                </EcoCardContent>
            </EcoCard>
        </div>
    );
}
