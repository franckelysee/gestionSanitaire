import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { EcoCard } from '@/components/ui/eco-card';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen eco-gradient-bg flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-eco-green/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-eco-blue/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-eco-orange/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 eco-fade-in">
                    <Link href={route('home')} className="inline-block">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-eco-green/20 rounded-2xl mb-4 hover:bg-eco-green/30 transition-colors">
                            <svg
                                className="w-8 h-8 text-eco-green"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold eco-text-gradient mb-2">
                        EcoSmart City
                    </h1>
                    <p className="text-muted-foreground">
                        {description || "Gestion Sanitaire Intelligente du Cameroun"}
                    </p>
                </div>

                {/* Auth Card */}
                <EcoCard variant="glass" className="eco-slide-up">
                    <div className="p-6">
                        {title && (
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    {title}
                                </h2>
                            </div>
                        )}
                        {children}
                    </div>
                </EcoCard>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-muted-foreground">
                    <p>© 2024 EcoSmart City. Tous droits réservés.</p>
                    <p className="mt-1">
                        Une initiative pour un Cameroun plus propre 🇨🇲
                    </p>
                </div>
            </div>
        </div>
    );
}
