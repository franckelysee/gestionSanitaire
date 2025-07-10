import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import TextLink from '@/components/text-link';
import { EcoButton } from '@/components/ui/eco-button';
import { EcoInput } from '@/components/ui/eco-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { EcoBadge } from '@/components/ui/eco-badge';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Connexion" description="Connectez-vous à votre compte EcoSmart">
            <Head title="Connexion" />

            {status && (
                <EcoBadge variant="success" className="mb-4 w-full justify-center">
                    {status}
                </EcoBadge>
            )}

            <form className="space-y-6" onSubmit={submit}>
                <div className="space-y-4">
                    <EcoInput
                        label="Adresse email"
                        type="email"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="votre@email.com"
                        icon={<Mail size={18} />}
                        error={errors.email}
                    />

                    <EcoInput
                        label="Mot de passe"
                        type={showPassword ? "text" : "password"}
                        required
                        tabIndex={2}
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Votre mot de passe"
                        icon={<Lock size={18} />}
                        iconPosition="left"
                        error={errors.password}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-sm">
                                Se souvenir de moi
                            </Label>
                        </div>

                        {canResetPassword && (
                            <TextLink
                                href={route('password.request')}
                                className="text-sm text-eco-green hover:text-eco-green/80"
                                tabIndex={5}
                            >
                                Mot de passe oublié ?
                            </TextLink>
                        )}
                    </div>

                    <EcoButton
                        type="submit"
                        className="w-full"
                        tabIndex={4}
                        loading={processing}
                        size="lg"
                    >
                        Se connecter
                    </EcoButton>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Pas encore de compte ?{' '}
                    <TextLink
                        href={route('register')}
                        tabIndex={5}
                        className="text-eco-green hover:text-eco-green/80 font-medium"
                    >
                        Créer un compte
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
