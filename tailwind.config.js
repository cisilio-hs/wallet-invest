import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Custom colors for theming
                sidebar: {
                    bg: 'var(--sidebar-bg)',
                    hover: 'var(--sidebar-hover)',
                    active: 'var(--sidebar-active)',
                    border: 'var(--sidebar-border)',
                },
                content: {
                    bg: 'var(--content-bg)',
                    card: 'var(--card-bg)',
                },
                accent: {
                    DEFAULT: 'var(--accent-color)',
                    hover: 'var(--accent-hover)',
                },
            },
            transitionDuration: {
                '200': '200ms',
                '300': '300ms',
            },
            width: {
                'sidebar': '256px',
                'sidebar-collapsed': '64px',
            },
        },
    },

    plugins: [
        forms,
    ],
};
