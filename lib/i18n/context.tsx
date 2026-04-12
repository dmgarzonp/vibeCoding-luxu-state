'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  isValidLocale,
  type Locale,
} from './config';
// Import default (Spanish) translations synchronously so the first render
// on both server and client produces identical HTML — prevents hydration mismatch.
import defaultTranslations from '../../locales/es.json';

// ─── Types ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationValue = string | Record<string, any>;
type Translations = Record<string, TranslationValue>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a dot-notation key, e.g. t('hero.search_btn') */
  t: (key: string) => string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads a single cookie value by name */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Writes a cookie that expires in 365 days */
function setCookie(name: string, value: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/** Resolves a dot-notation key against a nested object */
function resolveDotKey(obj: Translations, key: string): string {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  if (typeof current === 'string') return current;
  return key; // fallback: return the key itself
}

/** Dynamically imports a locale JSON file */
async function loadTranslations(locale: Locale): Promise<Translations> {
  try {
    const module = await import(`../../locales/${locale}.json`);
    return module.default as Translations;
  } catch {
    console.error(`[i18n] Could not load locale: ${locale}`);
    return {};
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with Spanish translations synchronously — server and client match on first paint.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Translations>(
    defaultTranslations as Translations,
  );

  // After mount: read the cookie and switch locale if the user had chosen another language.
  useEffect(() => {
    const saved = getCookie(COOKIE_NAME);
    if (isValidLocale(saved) && saved !== DEFAULT_LOCALE) {
      // Only reload translations when the saved locale differs from the default.
      setLocaleState(saved);
      loadTranslations(saved).then(setTranslations);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!isValidLocale(newLocale)) return;
    setCookie(COOKIE_NAME, newLocale);
    setLocaleState(newLocale);
    loadTranslations(newLocale).then(setTranslations);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): string => resolveDotKey(translations, key),
    [translations],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside <LanguageProvider>');
  }
  return ctx;
}
