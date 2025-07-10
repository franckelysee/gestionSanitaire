import React from 'react';
import { useForm } from '@inertiajs/react';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { 
    X, 
    AlertTriangle,
    Trash2
} from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    itemName: string;
    deleteUrl: string;
    onSuccess?: () => void;
    warningMessage?: string;
}

export default function DeleteConfirmationModal({ 
    isOpen, 
    onClose, 
    title,
    message,
    itemName,
    deleteUrl,
    onSuccess,
    warningMessage
}: DeleteConfirmationModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(deleteUrl, {
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <EcoCard className="relative max-w-md w-full">
                <EcoCardHeader>
                    <EcoCardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle size={16} className="text-red-600" />
                            </div>
                            <span>{title}</span>
                        </div>
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
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            {message}
                        </p>
                        
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-900">
                                {itemName}
                            </p>
                        </div>

                        {warningMessage && (
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-start space-x-2">
                                    <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-red-800">Attention</p>
                                        <p className="text-sm text-red-700">{warningMessage}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <EcoButton 
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="cursor-pointer"
                            >
                                Annuler
                            </EcoButton>
                            <EcoButton 
                                variant="danger"
                                onClick={handleDelete}
                                disabled={processing}
                                icon={<Trash2 size={16} />}
                                className="cursor-pointer"
                            >
                                {processing ? 'Suppression...' : 'Supprimer'}
                            </EcoButton>
                        </div>
                    </div>
                </EcoCardContent>
            </EcoCard>
        </div>
    );
}
