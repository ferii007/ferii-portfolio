import { ArrowUpRight } from 'lucide-react';
import MobileMenu from './MobileMenu';
const links = [
  { href: '#about', label: 'About' },
  { href: '#currently', label: 'Currently' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: '#beyond', label: 'Beyond Coding' },
];
export default function Header() {
  return <header className="site-header fp-header"><nav className="container header-inner fp-container fp-header__inner" aria-label="Navigasi utama">
    <a className="brand fp-logo" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a>
    <div className="nav-links fp-nav fp-nav--desktop">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
    <a className="button button-primary header-contact fp-btn fp-btn--primary" href="#contact">Contact <ArrowUpRight size={17} /></a>
    <MobileMenu links={links} />
  </nav></header>;
}
