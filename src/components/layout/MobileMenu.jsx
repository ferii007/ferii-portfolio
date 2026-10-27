'use client';
import { useRef } from 'react';
import { Menu } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
import { useLocalization } from '@/context/LocalizationProvider';

export default function MobileMenu({ links }) {
  const { localization: { text } } = useLocalization();
  const details = useRef(null);
  const close = () => { if (details.current) details.current.open = false; };
  return <details className="mobile-menu fp-mobile-menu" ref={details}><summary aria-label={text.nav_open_menu}><Menu size={25} /></summary><div className="mobile-menu-links fp-nav">
    {links.map((link) => <a key={link.href} href={link.href} onClick={close}>{text[link.key]}</a>)}<a href="#contact" onClick={close}>{text.nav_contact}</a><LanguageSwitch className="mobile-language" />
  </div></details>;
}
