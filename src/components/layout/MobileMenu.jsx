'use client';
import { useRef } from 'react';
import { Menu } from 'lucide-react';

export default function MobileMenu({ links }) {
  const details = useRef(null);
  const close = () => { if (details.current) details.current.open = false; };
  return <details className="mobile-menu" ref={details}><summary aria-label="Buka navigasi"><Menu size={25} /></summary><div className="mobile-menu-links">
    {links.map((link) => <a key={link.href} href={link.href} onClick={close}>{link.label}</a>)}<a href="#contact" onClick={close}>Contact</a>
  </div></details>;
}
