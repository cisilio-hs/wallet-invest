import { locales, defaultLocale, type Locale } from './locales';
import type { TranslationKeys as TranslationType } from './locales/pt-BR';

export type { Locale, TranslationType };
export { defaultLocale, locales } from './locales';

export const availableLocales: Locale[] = ['pt-BR', 'en'];

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

function interpolate(template: string, variables: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const value = variables[key];
        return value !== undefined ? String(value) : match;
    });
}

function getCurrentLocale(): Locale {
    if (typeof window === 'undefined') {
        return defaultLocale;
    }
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && availableLocales.includes(saved)) {
        return saved;
    }
    return defaultLocale;
}

export function t(key: string, variables?: Record<string, string | number>): string {
    const locale = getCurrentLocale();
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
}

export function changeLocale(locale: Locale): void {
    if (!availableLocales.includes(locale)) {
        console.warn(`Invalid locale: ${locale}`);
        return;
    }
    localStorage.setItem('locale', locale);
    window.location.reload();
}

export function getLocale(): Locale {
    return getCurrentLocale();
}
