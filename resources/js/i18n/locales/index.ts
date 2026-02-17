import { ptBR } from './pt-BR';
import { en } from './en';

export const locales = {
    'pt-BR': ptBR,
    'en': en,
} as const;

export type Locale = keyof typeof locales;
export type TranslationType = typeof ptBR;

export const availableLocales: Locale[] = ['pt-BR', 'en'];
export const defaultLocale: Locale = 'pt-BR';
