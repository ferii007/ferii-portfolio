'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: '#beyond', label: 'Beyond Coding' },
];
export default function Header() {
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
  return <header ref={headerRef} className={`site-header fp-header${hidden ? ' site-header--hidden' : ''}`} onFocusCapture={() => setHidden(false)}><nav className="container header-inner fp-container fp-header__inner" aria-label="Navigasi utama">
    <a className="brand fp-logo" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a>
    <div className="nav-links fp-nav fp-nav--desktop">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
    <a className="button button-primary header-contact fp-btn fp-btn--primary" href="#contact">Contact <ArrowUpRight size={17} /></a>
    <MobileMenu links={links} />
  </nav></header>;
}
