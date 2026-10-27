'use client';
import { useRef } from 'react';
import { Menu } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
import { useLocalization } from '@/context/LocalizationProvider';
import { anchor, NAV_LINKS, SECTIONS } from '@/constants/site';

export default function MobileMenu() {
  const { localization: { text } } = useLocalization();
  const details = useRef(null);
  const close = () => { if (details.current) details.current.open = false; };
  return <details className="mobile-menu fp-mobile-menu" ref={details}><summary aria-label={text.nav_open_menu}><Menu size={25} /></summary><div className="mobile-menu-links fp-nav">
    {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={close}>{link.label}</a>)}<a href={anchor('contact')} onClick={close}>{SECTIONS.contact.nav}</a><LanguageSwitch className="mobile-language" />
  </div></details>;
}
