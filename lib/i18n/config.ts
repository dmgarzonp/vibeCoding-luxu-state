// ─── i18n Configuration ──────────────────────────────────────────────────────
// To add a new language:
//   1. Create locales/<code>.json  (e.g. locales/de.json)
//   2. Add the code to SUPPORTED_LOCALES below
//   3. Add the translations to the JSON file
// That's it — the rest of the system picks it up automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_LOCALES = ['es', 'en', 'fr'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

export const COOKIE_NAME = 'luxe-lang';

/** Human-readable names for each locale (displayed in the selector) */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
};

/** Flag emojis for each locale */
export const LOCALE_FLAGS: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇺🇸',
  fr: '🇫🇷',
};

/** Validates and narrows an unknown string to a Locale */
export function isValidLocale(locale: unknown): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}
