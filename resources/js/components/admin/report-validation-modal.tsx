import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { EcoBadge } from '@/components/ui/eco-badge';
import { 
    X, 
    CheckCircle,
    XCircle,
    MessageSquare,
    User,
    MapPin,
    Calendar,
    AlertTriangle,
    Image,
    Star
} from 'lucide-react';

interface Report {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    zone: {
        id: number;
        name: string;
    };
    district: string;
    fill_level: number;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'verified' | 'resolved' | 'rejected';
    description: string;
    photos: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
    created_at: string;
    verified_at?: string;
    resolved_at?: string;
}

interface ReportValidationModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
    onSuccess?: () => void;
}

export default function ReportValidationModal({ 
    isOpen, 
    onClose, 
    report, 
    onSuccess 
}: ReportValidationModalProps) {
    const [action, setAction] = useState<'verify' | 'reject' | 'resolve' | null>(null);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        action: '',
        admin_comment: '',
        points_awarded: 0,
        new_status: '',
    });

    const handleAction = (actionType: 'verify' | 'reject' | 'resolve') => {
        setAction(actionType);
        
        // Définir les valeurs par défaut selon l'action
        switch (actionType) {
            case 'verify':
                setData({
                    action: 'verify',
                    admin_comment: '',
                    points_awarded: getDefaultPoints(),
                    new_status: 'verified',
                });
                break;
            case 'reject':
                setData({
                    action: 'reject',
                    admin_comment: '',
                    points_awarded: 0,
                    new_status: 'rejected',
                });
                break;
            case 'resolve':
                setData({
                    action: 'resolve',
                    admin_comment: '',
                    points_awarded: 0,
                    new_status: 'resolved',
                });
                break;
        }
    };

    const getDefaultPoints = () => {
        if (!report) return 0;
        
        let points = 10; // Points de base
        
        // Bonus selon la priorité
        switch (report.priority) {
            case 'high': points += 15; break;
            case 'medium': points += 10; break;
            case 'low': points += 5; break;
        }
        
        // Bonus si photos fournies
        if (report.photos && report.photos.length > 0) {
            points += 5;
        }
        
        return points;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!report || !action) return;

        post(`/admin/reports/${report.id}/validate`, {
            onSuccess: () => {
                onSuccess?.();
                onClose();
                reset();
                setAction(null);
            },
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'resolved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (!isOpen || !report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <EcoCard className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <EcoCardHeader>
                    <EcoCardTitle className="flex items-center justify-between">
                        <span>Validation du Signalement #{report.id}</span>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informations du signalement */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Détails du Signalement</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User size={16} className="text-gray-400" />
                                        <div>
                                            <p className="font-medium">{report.user.name}</p>
                                            <p className="text-sm text-gray-600">{report.user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <div>
                                            <p className="font-medium">{report.zone.name}</p>
                                            <p className="text-sm text-gray-600">{report.district}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <p className="text-sm">{new Date(report.created_at).toLocaleString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                                    Priorité {report.priority.toUpperCase()}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                    {report.status.toUpperCase()}
                                </span>
                                <EcoBadge variant="outline" size="sm">
                                    Remplissage: {report.fill_level}%
                                </EcoBadge>
                            </div>

                            {report.description && (
                                <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                                        {report.description}
                                    </p>
                                </div>
                            )}

                            {report.photos && report.photos.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Photos ({report.photos.length})</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {report.photos.map((photo, index) => (
                                            <div key={index} className="relative">
                                                <img 
                                                    src={`/storage/${photo}`}
                                                    alt={`Photo ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg cursor-pointer"
                                                />
                                                <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions de validation */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Actions de Validation</h3>
                            
                            {!action && (
                                <div className="space-y-3">
                                    <EcoButton 
                                        variant="success"
                                        icon={<CheckCircle size={16} />}
                                        onClick={() => handleAction('verify')}
                                        className="w-full cursor-pointer"
                                        disabled={report.status !== 'pending'}
                                    >
                                        Vérifier le Signalement
                                    </EcoButton>
                                    
                                    <EcoButton 
                                        variant="primary"
                                        icon={<CheckCircle size={16} />}
                                        onClick={() => handleAction('resolve')}
                                        className="w-full cursor-pointer"
                                        disabled={report.status === 'rejected' || report.status === 'resolved'}
                                    >
                                        Marquer comme Résolu
                                    </EcoButton>
                                    
                                    <EcoButton 
                                        variant="danger"
                                        icon={<XCircle size={16} />}
                                        onClick={() => handleAction('reject')}
                                        className="w-full cursor-pointer"
                                        disabled={report.status !== 'pending'}
                                    >
                                        Rejeter le Signalement
                                    </EcoButton>
                                </div>
                            )}

                            {action && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <h4 className="font-medium text-blue-900 mb-2">
                                            {action === 'verify' && 'Vérification du Signalement'}
                                            {action === 'reject' && 'Rejet du Signalement'}
                                            {action === 'resolve' && 'Résolution du Signalement'}
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            {action === 'verify' && 'Le signalement sera marqué comme vérifié et des points seront attribués au citoyen.'}
                                            {action === 'reject' && 'Le signalement sera rejeté. Veuillez expliquer la raison du rejet.'}
                                            {action === 'resolve' && 'Le signalement sera marqué comme résolu (problème traité).'}
                                        </p>
                                    </div>

                                    {action === 'verify' && (
                                        <EcoInput
                                            label="Points à attribuer"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={data.points_awarded}
                                            onChange={(e) => setData('points_awarded', parseInt(e.target.value))}
                                            error={errors.points_awarded}
                                            icon={<Star size={18} />}
                                            help={`Points suggérés: ${getDefaultPoints()}`}
                                        />
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Commentaire administrateur {action === 'reject' ? '(obligatoire)' : '(optionnel)'}
                                        </label>
                                        <textarea 
                                            className="eco-input min-h-[100px] resize-none"
                                            placeholder={
                                                action === 'verify' ? 'Commentaire sur la vérification...' :
                                                action === 'reject' ? 'Expliquez pourquoi ce signalement est rejeté...' :
                                                'Commentaire sur la résolution...'
                                            }
                                            value={data.admin_comment}
                                            onChange={(e) => setData('admin_comment', e.target.value)}
                                            required={action === 'reject'}
                                        />
                                        {errors.admin_comment && (
                                            <p className="text-red-500 text-sm mt-1">{errors.admin_comment}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                                        <EcoButton 
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setAction(null);
                                                reset();
                                            }}
                                            className="cursor-pointer"
                                        >
                                            Annuler
                                        </EcoButton>
                                        <EcoButton 
                                            type="submit"
                                            disabled={processing}
                                            variant={action === 'reject' ? 'danger' : 'success'}
                                            icon={<MessageSquare size={16} />}
                                            className="cursor-pointer"
                                        >
                                            {processing ? 'Traitement...' : 
                                                action === 'verify' ? 'Vérifier' :
                                                action === 'reject' ? 'Rejeter' : 'Résoudre'
                                            }
                                        </EcoButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </EcoCardContent>
            </EcoCard>
        </div>
    );
}
