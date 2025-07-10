import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { 
    LayoutDashboard, 
    MapPin, 
    AlertTriangle, 
    Users, 
    Settings,
    Bell,
    Menu,
    X,
    LogOut,
    BarChart3,
    Calendar,
    FileText
} from 'lucide-react';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoBadge } from '@/components/ui/eco-badge';
import type { SharedData } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    showHeader?: boolean;
    showSidebar?: boolean;
}

export default function AdminLayout({ 
    children, 
    title,
    showHeader = true,
    showSidebar = true
}: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
            active: window.location.pathname === '/admin',
        },
        {
            name: 'Zones de Collecte',
            href: '/admin/zones',
            icon: MapPin,
            active: window.location.pathname === '/admin/zones',
        },
        {
            name: 'Signalements',
            href: '/admin/reports',
            icon: AlertTriangle,
            active: window.location.pathname === '/admin/reports',
            badge: 5, // Nombre de signalements en attente
        },
        {
            name: 'Utilisateurs',
            href: '/admin/users',
            icon: Users,
            active: window.location.pathname === '/admin/users',
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
            active: window.location.pathname === '/admin/analytics',
        },
        {
            name: 'Planification',
            href: '/admin/schedules',
            icon: Calendar,
            active: window.location.pathname === '/admin/schedules',
        },
        // {
        //     name: 'Rapports',
        //     href: '/admin/reports-export',
        //     icon: FileText,
        //     active: window.location.pathname === '/admin/reports-export',
        // },
        {
            name: 'Paramètres',
            href: '/admin/settings',
            icon: Settings,
            active: window.location.pathname === '/admin/settings',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-eco-blue/5">
            {title && <Head title={title} />}
            
            {/* Header */}
            {showHeader && (
                <header className="sticky top-0 z-50 eco-glass border-b border-glass-border">
                    <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                        <div className="flex items-center space-x-4">
                            {showSidebar && (
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 rounded-lg hover:bg-background/50 transition-colors lg:hidden"
                                >
                                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            )}
                            
                            <div>
                                <h1 className="text-xl font-bold eco-text-gradient">
                                    EcoSmart Admin
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    Panneau d'administration
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {/* Notifications */}
                            <EcoButton variant="ghost" size="icon" className="relative">
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-eco-red text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </EcoButton>
                            
                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium">{auth.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">Administrateur</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-eco-blue/20 flex items-center justify-center">
                                    <Users size={16} className="text-eco-blue" />
                                </div>
                                
                                <EcoButton variant="ghost" size="icon" title="Déconnexion">
                                    <LogOut size={16} />
                                </EcoButton>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <div className="flex">
                {/* Sidebar */}
                {showSidebar && (
                    <>
                        {/* Mobile Overlay */}
                        {sidebarOpen && (
                            <div 
                                className="fixed inset-0 z-40 lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                            </div>
                        )}
                        
                        {/* Sidebar */}
                        <aside className={cn(
                            'fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
                            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                            'eco-glass border-r border-glass-border'
                        )}>
                            <div className="flex flex-col h-full">
                                {/* Logo */}
                                <div className="p-6 border-b border-border/50">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-eco-green/20 rounded-lg flex items-center justify-center">
                                            <LayoutDashboard size={20} className="text-eco-green" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold eco-text-gradient">EcoSmart</h2>
                                            <p className="text-xs text-muted-foreground">Administration</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Navigation */}
                                <nav className="flex-1 p-4 space-y-2">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group',
                                                item.active 
                                                    ? 'bg-eco-green/10 text-eco-green border border-eco-green/20' 
                                                    : 'hover:bg-background/50 text-muted-foreground hover:text-foreground'
                                            )}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon size={20} />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            {item.badge && (
                                                <EcoBadge variant="danger" size="sm">
                                                    {item.badge}
                                                </EcoBadge>
                                            )}
                                        </Link>
                                    ))}
                                </nav>
                                
                                {/* Footer */}
                                <div className="p-4 border-t border-border/50">
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">
                                            EcoSmart City v1.0
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            © 2024 - Cameroun
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className={cn(
                    'flex-1 min-h-screen',
                    showSidebar && 'lg:ml-0'
                )}>
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
