'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Locale = 'en' | 'hi' | 'ar';

type Messages = Record<string, string>;

type I18nContextType = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: string, fallback?: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const RTL_LOCALES: Locale[] = ['ar'];

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('locale') as Locale) || 'en';
  });
  const [messages, setMessages] = useState<Messages>({});

  const dir: 'ltr' | 'rtl' = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

  useEffect(() => {
    const load = async () => {
      try {
        const mod = await import(`../locales/${locale}.json`);
        setMessages(mod.default || {});
      } catch {
        setMessages({});
      }
    };
    load();
  }, [locale]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale);
    }
  }, [locale, dir]);

  const t = useMemo(
    () => (key: string, fallback?: string) => messages[key] ?? fallback ?? key,
    [messages]
  );

  const value = useMemo(
    () => ({ locale, dir, t, setLocale }),
    [locale, dir, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
