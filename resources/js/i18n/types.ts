export type Locale = 'pt-BR' | 'en';

export type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationVariables = Record<string, string | number>;

export interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    availableLocales: Locale[];
    t: (key: string, variables?: TranslationVariables) => string;
}
