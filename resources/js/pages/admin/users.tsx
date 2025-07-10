import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import { EcoInput } from '@/components/ui/eco-input';
import UserFormModal from '@/components/admin/user-form-modal';
import DeleteConfirmationModal from '@/components/admin/delete-confirmation-modal';
import {
    Users,
    Search,
    Filter,
    Eye,
    Edit,
    Ban,
    CheckCircle,
    Trophy,
    MapPin,
    Calendar,
    Mail,
    Phone,
    MoreVertical,
    UserPlus,
    Power,
    PowerOff,
    Trash2
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    points: number;
    level: number;
    district: string;
    reports_count: number;
    is_active: boolean;
    created_at: string;
    last_activity: string;
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function UsersPage({ users, districts }: UsersPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // États pour les modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Fonctions de gestion des actions
    const handleCreateUser = () => {
        setIsCreateModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleToggleStatus = (user: User) => {
        // Logique pour activer/désactiver un utilisateur
        console.log('Toggle status for user:', user.id);
    };

    const handleModalSuccess = () => {
        // Recharger les données ou mettre à jour l'état
        window.location.reload();
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700 border-red-200';
            case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'citizen': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrateur';
            case 'moderator': return 'Modérateur';
            case 'citizen': return 'Citoyen';
            default: return role;
        }
    };

    return (
        <AdminLayout title="Gestion des Utilisateurs">
            <Head title="Gestion des Utilisateurs" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold eco-text-gradient">
                            Gestion des Utilisateurs
                        </h1>
                        <p className="text-gray-600">
                            Gérez les comptes utilisateurs et leurs permissions
                        </p>
                    </div>
                    
                    <EcoButton
                        icon={<UserPlus size={16} />}
                        onClick={handleCreateUser}
                        className="cursor-pointer"
                    >
                        Nouvel Utilisateur
                    </EcoButton>
                </div>

                {/* Filtres et recherche */}
                <EcoCard>
                    <EcoCardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <EcoInput
                                placeholder="Rechercher un utilisateur..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search size={18} />}
                            />
                            
                            <select 
                                className="eco-input"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="all">Tous les rôles</option>
                                <option value="admin">Administrateur</option>
                                <option value="moderator">Modérateur</option>
                                <option value="citizen">Citoyen</option>
                            </select>
                            
                            <select 
                                className="eco-input"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
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
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {users.total}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total utilisateurs
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {users.data.filter(u => u.is_active).length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Utilisateurs actifs
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                {users.data.filter(u => u.role === 'citizen').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Citoyens
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                    
                    <EcoCard>
                        <EcoCardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {users.data.filter(u => u.role === 'admin').length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Administrateurs
                            </div>
                        </EcoCardContent>
                    </EcoCard>
                </div>

                {/* Liste des utilisateurs */}
                <EcoCard>
                    <EcoCardHeader>
                        <EcoCardTitle>
                            Liste des Utilisateurs ({users.total})
                        </EcoCardTitle>
                    </EcoCardHeader>
                    <EcoCardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Utilisateur
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Contact
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Rôle
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Activité
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Statut
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr 
                                            key={user.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <Users size={20} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-gray-600">{user.district}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-1 text-sm">
                                                        <Mail size={14} className="text-gray-400" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center space-x-1 text-sm">
                                                            <Phone size={14} className="text-gray-400" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                    {getRoleText(user.role)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-1 text-sm">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        <span>{user.reports_count} signalements</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-sm">
                                                        <Trophy size={14} className="text-gray-400" />
                                                        <span>{user.points} points • Niv. {user.level}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="space-y-1">
                                                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                        user.is_active 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            user.is_active ? 'bg-green-500' : 'bg-red-500'
                                                        }`} />
                                                        <span>{user.is_active ? 'Actif' : 'Inactif'}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {user.last_activity}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex items-center space-x-2">
                                                    <EcoButton
                                                        variant="outline"
                                                        size="sm"
                                                        icon={<Eye size={14} />}
                                                        onClick={() => setSelectedUser(user)}
                                                        className="cursor-pointer"
                                                    >
                                                        Voir
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        size="sm"
                                                        icon={<Edit size={14} />}
                                                        onClick={() => handleEditUser(user)}
                                                        className="cursor-pointer"
                                                    >
                                                        Modifier
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        size="sm"
                                                        icon={user.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                                                        onClick={() => handleToggleStatus(user)}
                                                        className="cursor-pointer"
                                                    >
                                                        {user.is_active ? 'Désactiver' : 'Activer'}
                                                    </EcoButton>
                                                    <EcoButton
                                                        variant="outline"
                                                        size="sm"
                                                        icon={<Trash2 size={14} />}
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="cursor-pointer"
                                                    >
                                                        Supprimer
                                                    </EcoButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Affichage de {((users.current_page - 1) * users.per_page) + 1} à{' '}
                                    {Math.min(users.current_page * users.per_page, users.total)} sur {users.total} utilisateurs
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={users.current_page === 1}
                                    >
                                        Précédent
                                    </EcoButton>
                                    
                                    <span className="px-3 py-1 text-sm">
                                        Page {users.current_page} sur {users.last_page}
                                    </span>
                                    
                                    <EcoButton 
                                        variant="outline" 
                                        size="sm"
                                        disabled={users.current_page === users.last_page}
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
            <UserFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                districts={districts || []}
                onSuccess={handleModalSuccess}
            />

            <UserFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setUserToEdit(null);
                }}
                user={userToEdit}
                districts={districts || []}
                onSuccess={handleModalSuccess}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                title="Supprimer l'Utilisateur"
                message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                itemName={userToDelete?.name || ''}
                deleteUrl={`/admin/users/${userToDelete?.id}`}
                onSuccess={handleModalSuccess}
                warningMessage="Cette action est irréversible. Tous les signalements de cet utilisateur seront conservés mais anonymisés."
            />
        </AdminLayout>
    );
}
