'use client';
import { Languages } from 'lucide-react';
import { useLocalization } from '@/context/LocalizationProvider';

// A real link to the other language's URL (crawlable), which also remembers the choice like rebill's switcher.
export default function LanguageSwitch({ className = '' }) {
  const { localization: { text }, currentLanguage, languages, rememberLanguage } = useLocalization();
  const other = languages.find((language) => language.value !== currentLanguage);
  return <a className={`language-switch ${className}`} href={other.path} hrefLang={other.value} lang={other.value} aria-label={text.language_switch} title={text.language_switch}
    onClick={(event) => rememberLanguage(event, other.value)}>
    <Languages size={18} aria-hidden="true" /><span>{other.short}</span>
  </a>;
}
