'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
import LanguageSwitch from './LanguageSwitch';
import { useLocalization } from '@/context/LocalizationProvider';
import { anchor, NAV_LINKS, SECTIONS } from '@/constants/site';
import Logo from './Logo';
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
    <Logo href={anchor('top')} label={text.logo_back_to_top} />
    <div className="nav-links fp-nav fp-nav--desktop">{NAV_LINKS.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
    {/* One group, so space-between spaces logo / nav / actions and the language switch sits right beside Contact. */}
    <div className="header-actions">
      <LanguageSwitch className="header-language" />
      <a className="button button-primary header-contact fp-btn fp-btn--primary" href={anchor('contact')}>{SECTIONS.contact.nav} <ArrowUpRight size={17} /></a>
    </div>
    <MobileMenu />
  </nav></header>;
}
