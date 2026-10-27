'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import LanguageSwitch from './LanguageSwitch';
import { useLocalization } from '@/context/LocalizationProvider';
const links = [
  { href: '#about', key: 'nav_about' },
  { href: '#skills', key: 'nav_skills' },
  { href: '#journey', key: 'nav_journey' },
  { href: '#projects', key: 'nav_projects' },
  { href: '#beyond', key: 'nav_beyond' },
];
export default function Header() {
  const { localization: { text } } = useLocalization();
  const headerRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let previousY = window.scrollY;
    const update = () => {
      const y = Math.max(0, window.scrollY);
      if (y < 80 || headerRef.current.querySelector('details[open]')) {
        setHidden(false);
        previousY = y;
        return;
      }
      if (Math.abs(y - previousY) < 8) return;
      setHidden(y > previousY);
      previousY = y;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <header ref={headerRef} className={`site-header fp-header${hidden ? ' site-header--hidden' : ''}`} onFocusCapture={() => setHidden(false)}><nav className="container header-inner fp-container fp-header__inner" aria-label={text.nav_label}>
    <a className="brand fp-logo" href="#top" aria-label={text.logo_back_to_top}>feri<span>.</span></a>
    <div className="nav-links fp-nav fp-nav--desktop">{links.map((link) => <a key={link.href} href={link.href}>{text[link.key]}</a>)}</div>
    <LanguageSwitch className="header-language" />
    <a className="button button-primary header-contact fp-btn fp-btn--primary" href="#contact">{text.nav_contact} <ArrowUpRight size={17} /></a>
    <MobileMenu links={links} />
  </nav></header>;
}
