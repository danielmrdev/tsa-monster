export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function getSupportedLocales(): readonly string[] {
  return LOCALES;
}

export function isSupportedLocale(locale: string): locale is Locale {
  return (LOCALES as readonly string[]).includes(locale);
}
