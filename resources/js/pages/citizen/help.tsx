import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import { EcoCard, EcoCardContent, EcoCardHeader, EcoCardTitle } from '@/components/ui/eco-card';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { 
    HelpCircle, 
    Search,
    ChevronDown,
    ChevronRight,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    Book,
    Video,
    FileText,
    Users,
    Lightbulb,
    AlertCircle
} from 'lucide-react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface HelpPageProps {
    faqs: FAQ[];
    contact_info: {
        email: string;
        phone: string;
        address: string;
        hours: string;
    };
}

export default function HelpPage({ faqs, contact_info }: HelpPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('faq');

    const categories = [
        { value: 'all', label: 'Toutes les catégories' },
        { value: 'signalement', label: 'Signalements' },
        { value: 'compte', label: 'Mon Compte' },
        { value: 'points', label: 'Points & Niveaux' },
        { value: 'technique', label: 'Problèmes Techniques' },
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const guides = [
        {
            title: 'Comment faire un signalement efficace',
            description: 'Apprenez à créer des signalements détaillés et utiles',
            icon: <MapPin size={24} className="text-blue-600" />,
            duration: '5 min',
        },
        {
            title: 'Comprendre le système de points',
            description: 'Découvrez comment gagner des points et monter de niveau',
            icon: <Lightbulb size={24} className="text-yellow-600" />,
            duration: '3 min',
        },
        {
            title: 'Utiliser la carte interactive',
            description: 'Naviguez efficacement sur la carte des zones',
            icon: <MapPin size={24} className="text-green-600" />,
            duration: '4 min',
        },
        {
            title: 'Gérer votre profil',
            description: 'Personnalisez et sécurisez votre compte',
            icon: <Users size={24} className="text-purple-600" />,
            duration: '2 min',
        },
    ];

    return (
        <CitizenLayout title="Aide & Support">
            <Head title="Aide & Support" />
            
            <div className="space-y-6">
                {/* En-tête */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <HelpCircle size={28} className="text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold eco-text-gradient mb-2">
                        Centre d'Aide
                    </h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Trouvez rapidement les réponses à vos questions ou contactez notre équipe
                    </p>
                </div>

                {/* Recherche rapide */}
                <EcoCard>
                    <EcoCardContent className="p-6">
                        <div className="max-w-md mx-auto">
                            <EcoInput
                                placeholder="Rechercher dans l'aide..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search size={18} />}
                                className="text-center"
                            />
                        </div>
                    </EcoCardContent>
                </EcoCard>

                {/* Navigation des onglets */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'faq', name: 'FAQ', icon: HelpCircle },
                        { id: 'guides', name: 'Guides', icon: Book },
                        { id: 'contact', name: 'Contact', icon: MessageCircle },
                        { id: 'videos', name: 'Vidéos', icon: Video },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'faq' && (
                    <div className="space-y-6">
                        {/* Filtres FAQ */}
                        <EcoCard>
                            <EcoCardContent className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.value}
                                            onClick={() => setSelectedCategory(category.value)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                                selectedCategory === category.value
                                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {category.label}
                                        </button>
                                    ))}
                                </div>
                            </EcoCardContent>
                        </EcoCard>

                        {/* Liste des FAQ */}
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle>
                                    Questions Fréquentes ({filteredFAQs.length})
                                </EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent>
                                <div className="space-y-3">
                                    {filteredFAQs.map((faq) => (
                                        <div 
                                            key={faq.id}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium">{faq.question}</span>
                                                {expandedFAQ === faq.id ? (
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                ) : (
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                )}
                                            </button>
                                            {expandedFAQ === faq.id && (
                                                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100">
                                                    <p className="pt-3">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {filteredFAQs.length === 0 && (
                                    <div className="text-center py-12">
                                        <Search size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                                            Aucune question trouvée
                                        </h3>
                                        <p className="text-gray-500">
                                            Essayez de modifier votre recherche ou contactez-nous directement
                                        </p>
                                    </div>
                                )}
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {guides.map((guide, index) => (
                            <EcoCard key={index}>
                                <EcoCardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {guide.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2">
                                                {guide.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {guide.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    📖 {guide.duration} de lecture
                                                </span>
                                                <EcoButton variant="outline" size="sm">
                                                    Lire le guide
                                                </EcoButton>
                                            </div>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        ))}
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informations de contact */}
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle>Nous Contacter</EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Mail size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-sm text-gray-600">{contact_info.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Phone size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Téléphone</p>
                                        <p className="text-sm text-gray-600">{contact_info.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <MapPin size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Adresse</p>
                                        <p className="text-sm text-gray-600">{contact_info.address}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium mb-1">Heures d'ouverture</p>
                                    <p className="text-sm text-gray-600">{contact_info.hours}</p>
                                </div>
                            </EcoCardContent>
                        </EcoCard>

                        {/* Formulaire de contact */}
                        <EcoCard>
                            <EcoCardHeader>
                                <EcoCardTitle>Envoyer un Message</EcoCardTitle>
                            </EcoCardHeader>
                            <EcoCardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sujet
                                    </label>
                                    <select className="eco-input">
                                        <option>Problème technique</option>
                                        <option>Question sur les signalements</option>
                                        <option>Suggestion d'amélioration</option>
                                        <option>Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea 
                                        className="eco-input min-h-[120px] resize-none"
                                        placeholder="Décrivez votre problème ou votre question..."
                                    />
                                </div>

                                <EcoButton className="w-full" icon={<MessageCircle size={16} />}>
                                    Envoyer le Message
                                </EcoButton>

                                <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-medium text-yellow-800">Temps de réponse</p>
                                        <p className="text-yellow-700">
                                            Nous répondons généralement sous 24h en jours ouvrables.
                                        </p>
                                    </div>
                                </div>
                            </EcoCardContent>
                        </EcoCard>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Premiers pas avec EcoSmart',
                                duration: '3:45',
                                thumbnail: '/images/video-thumb-1.jpg',
                                description: 'Découvrez les fonctionnalités principales'
                            },
                            {
                                title: 'Comment faire un signalement',
                                duration: '2:30',
                                thumbnail: '/images/video-thumb-2.jpg',
                                description: 'Guide étape par étape'
                            },
                            {
                                title: 'Utiliser la carte interactive',
                                duration: '4:15',
                                thumbnail: '/images/video-thumb-3.jpg',
                                description: 'Navigation et fonctionnalités avancées'
                            },
                        ].map((video, index) => (
                            <EcoCard key={index}>
                                <EcoCardContent className="p-0">
                                    <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                                        <Video size={48} className="text-gray-400" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-2">{video.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">⏱️ {video.duration}</span>
                                            <EcoButton variant="outline" size="sm">
                                                Regarder
                                            </EcoButton>
                                        </div>
                                    </div>
                                </EcoCardContent>
                            </EcoCard>
                        ))}
                    </div>
                )}
            </div>
        </CitizenLayout>
    );
}
