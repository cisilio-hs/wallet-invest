import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
import { t } from '@/i18n';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover)] rounded-lg transition-colors duration-200"
            aria-label={isDark ? t('components.theme_toggle.light_mode') : t('components.theme_toggle.dark_mode')}
        >
            {isDark ? (
                <SunIcon className="h-5 w-5" />
            ) : (
                <MoonIcon className="h-5 w-5" />
            )}
        </button>
    );
}
