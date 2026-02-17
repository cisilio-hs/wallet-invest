import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { locales, availableLocales, defaultLocale, type Locale, type TranslationType } from './locales';
import type { TranslationVariables } from './types';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    availableLocales: Locale[];
    t: (key: string, variables?: TranslationVariables) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current === null || current === undefined) {
            return undefined;
        }
        current = (current as Record<string, unknown>)[key];
    }

    return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, variables: TranslationVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const value = variables[key];
        return value !== undefined ? String(value) : match;
    });
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        const saved = localStorage.getItem('locale') as Locale;
        if (saved && availableLocales.includes(saved)) {
            return saved;
        }
        return defaultLocale;
    });

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    const setLocale = useCallback((newLocale: Locale) => {
        if (availableLocales.includes(newLocale)) {
            setLocaleState(newLocale);
        }
    }, []);

    const t = useCallback((key: string, variables?: TranslationVariables): string => {
        const translations = locales[locale] as TranslationType;
        const fallbackTranslations = locales[defaultLocale] as TranslationType;

        let text = getNestedValue(translations as Record<string, unknown>, key);

        if (text === undefined) {
            text = getNestedValue(fallbackTranslations as Record<string, unknown>, key);
        }

        if (text === undefined) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        if (variables) {
            return interpolate(text, variables);
        }

        return text;
    }, [locale]);

    const value: I18nContextType = {
        locale,
        setLocale,
        availableLocales,
        t,
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
