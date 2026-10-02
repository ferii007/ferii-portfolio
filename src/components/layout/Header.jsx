const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
];

export default function Header() {
  return (
    <header className="site-header">
      <nav className="container header-inner" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a>
        <div className="nav-links">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <a className="button button-primary header-contact" href="#contact">Contact ↗</a>
      </nav>
    </header>
  );
}
