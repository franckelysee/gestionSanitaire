import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
    Home,
    Map,
    Plus,
    Trophy,
    User,
    Bell,
    Menu,
    X,
    Clock,
    LogOut,
    HelpCircle
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import type { SharedData } from '@/types';

interface CitizenLayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
    showNavigation?: boolean;
}

export default function CitizenLayout({
    children,
    title,
    showHeader = true,
    showNavigation = true
}: CitizenLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    const navigationItems = [
        {
            name: 'Accueil',
            href: '/citizen',
            icon: Home,
            active: currentPath === '/citizen',
        },
        {
            name: 'Carte',
            href: '/citizen/map',
            icon: Map,
            active: currentPath === '/citizen/map',
        },
        {
            name: 'Signaler',
            href: '/citizen/report',
            icon: Plus,
            active: currentPath === '/citizen/report',
            primary: true,
        },
        {
            name: 'Historique',
            href: '/citizen/history',
            icon: Clock,
            active: currentPath === '/citizen/history',
        },
        {
            name: 'Récompenses',
            href: '/citizen/achievements',
            icon: Trophy,
            active: currentPath === '/citizen/achievements',
        },
    ];

    return (
        <div className="min-h-screen eco-gradient-bg">
            {title && <Head title={title} />}

            {/* Header Mobile */}
            {showHeader && (
                <header className="fixed top-0 left-0 right-0 z-50 eco-glass border-b border-gray-200/30 lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <div>
                                <h1 className="text-lg font-bold eco-text-gradient">
                                    EcoSmart
                                </h1>
                                <p className="text-xs text-gray-600">
                                    Ville Propre
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Points Badge */}
                            <div className="eco-badge-low text-xs px-2 py-1">
                                <Trophy size={12} className="inline mr-1" />
                                {auth.user?.points || 0}
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* User Avatar */}
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <User size={16} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Desktop Header */}
            {showHeader && (
                <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 eco-glass border-b border-gray-200/30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <h1 className="text-xl font-bold eco-text-gradient">
                                EcoSmart City
                            </h1>
                            <p className="text-sm text-gray-600">
                                Gestion Sanitaire Intelligente
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="eco-badge-low">
                                <Trophy size={14} className="inline mr-1" />
                                {auth.user?.points || 0} points
                            </div>

                            <button className="relative p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <User size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{auth.user?.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Niveau {auth.user?.level || 1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full w-64 eco-glass border-r border-gray-200/30 p-4">
                        <div className="mt-20">
                            <nav className="space-y-2">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300',
                                            item.primary
                                                ? 'eco-button-primary text-white'
                                                : item.active
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'hover:bg-white/50 text-gray-700'
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:left-0 lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-64 lg:flex lg:flex-col lg:border-r lg:border-gray-200/30 lg:bg-white/50 lg:backdrop-blur-sm">
                <div className="p-6">
                    <nav className="space-y-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300',
                                    item.primary
                                        ? 'eco-button-primary text-white'
                                        : item.active
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'hover:bg-white/50 text-gray-700'
                                )}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-gray-200/30">
                    <div className="space-y-2 mb-4">
                        <Link
                            href="/citizen/profile"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/50 text-gray-700 transition-colors cursor-pointer"
                        >
                            <User size={16} />
                            <span className="text-sm">Mon Profil</span>
                        </Link>
                        <Link
                            href="/citizen/notifications"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/50 text-gray-700 transition-colors cursor-pointer"
                        >
                            <Bell size={16} />
                            <span className="text-sm">Notifications</span>
                        </Link>
                        <Link
                            href="/citizen/help"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/50 text-gray-700 transition-colors cursor-pointer"
                        >
                            <HelpCircle size={16} />
                            <span className="text-sm">Aide</span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        >
                            <LogOut size={16} />
                            <span className="text-sm">Déconnexion</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium">{auth.user?.name}</p>
                            <p className="text-sm text-gray-600">
                                {auth.user?.points || 0} points • Niveau {auth.user?.level || 1}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn(
                "min-h-screen",
                showHeader && "pt-16 lg:pt-20",
                "lg:ml-64",
                showNavigation && "pb-20 lg:pb-4"
            )}>
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation Mobile */}
            {showNavigation && (
                <nav className="fixed bottom-0 left-0 right-0 z-40 eco-glass border-t border-gray-200/30 lg:hidden">
                    <div className="flex items-center justify-around px-2 py-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-300 relative',
                                    item.primary && 'eco-button-primary text-white p-3 -mt-6 shadow-lg',
                                    !item.primary && item.active && 'text-green-600',
                                    !item.primary && !item.active && 'text-gray-500'
                                )}
                            >
                                <div className="relative">
                                    <item.icon size={item.primary ? 24 : 20} />
                                    {item.active && !item.primary && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </div>
                                <span className={cn(
                                    'text-xs font-medium',
                                    item.primary ? 'text-white' : item.active ? 'text-green-600' : 'text-gray-500'
                                )}>
                                    {item.name}
                                </span>
                                {item.active && !item.primary && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </div>
    );
}
