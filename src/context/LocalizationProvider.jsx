'use client';
import { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getLocalization } from '@/constants/localization';
import { getLanguage, LANGUAGES } from '@/constants/languages';

const LocalizationContext = createContext(null);

// Same API as rebill_backoffice_fe's provider ({ localization, currentLanguage, changeLanguage }), but the
// language comes from the URL instead of localStorage, so every visitor and crawler gets the same page per URL.
export function LocalizationProvider({ language, children }) {
  const router = useRouter();
  const value = useMemo(() => {
    const localization = getLocalization(language);
    const store = (value) => { try { localStorage.setItem('localization', value); } catch { /* storage may be blocked */ } };
    const changeLanguage = (newLanguage) => {
      const target = getLanguage(newLanguage);
      if (target.value === localization.language) return;
      store(target.value);
      // Each language has its own root layout, so this is a full page load; keep the section the visitor was on.
      router.push(`${target.path}${window.location.hash}`);
    };
    // For a plain <a href> to the other language: remember the choice and carry the current #section along.
    const rememberLanguage = (event, newLanguage) => {
      const target = getLanguage(newLanguage);
      store(target.value);
      event.currentTarget.setAttribute('href', `${target.path}${window.location.hash}`);
    };
    return { localization, currentLanguage: localization.language, changeLanguage, rememberLanguage, languages: LANGUAGES };
  }, [language, router]);
  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}
