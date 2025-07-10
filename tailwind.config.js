const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                // EcoSmart Custom Colors
                'eco-green': {
                    DEFAULT: 'oklch(var(--eco-green))',
                    light: 'oklch(var(--eco-green-light))',
                },
                'eco-blue': 'oklch(var(--eco-blue))',
                'eco-orange': 'oklch(var(--eco-orange))',
                'eco-red': 'oklch(var(--eco-red))',
                'eco-yellow': 'oklch(var(--eco-yellow))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'eco-pulse': {
                    '0%, 100%': {
                        opacity: '1',
                        transform: 'scale(1)',
                    },
                    '50%': {
                        opacity: '0.8',
                        transform: 'scale(1.05)',
                    },
                },
                'eco-bounce': {
                    '0%, 20%, 53%, 80%, 100%': {
                        transform: 'translate3d(0, 0, 0)',
                    },
                    '40%, 43%': {
                        transform: 'translate3d(0, -8px, 0)',
                    },
                    '70%': {
                        transform: 'translate3d(0, -4px, 0)',
                    },
                    '90%': {
                        transform: 'translate3d(0, -2px, 0)',
                    },
                },
                'eco-fade-in': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(10px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'eco-slide-up': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'eco-pulse': 'eco-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'eco-bounce': 'eco-bounce 1s infinite',
                'eco-fade-in': 'eco-fade-in 0.5s ease-out',
                'eco-slide-up': 'eco-slide-up 0.5s ease-out',
            },
        },
    },

    plugins: [require('tailwindcss-animate')],
};
