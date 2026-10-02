import { ArrowUpRight, Menu } from 'lucide-react';
const links = [
  { href: '#about', label: 'About' },
  { href: '#currently', label: 'Currently' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: '#beyond', label: 'Beyond Coding' },
];
export default function Header() {
  return <header className="site-header"><nav className="container header-inner" aria-label="Navigasi utama">
    <a className="brand" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a>
    <div className="nav-links">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
    <a className="button button-primary header-contact" href="#contact">Contact <ArrowUpRight size={17} /></a>
    <details className="mobile-menu"><summary aria-label="Buka navigasi"><Menu size={25} /></summary><div className="mobile-menu-links">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="#contact">Contact</a></div></details>
  </nav></header>;
}
