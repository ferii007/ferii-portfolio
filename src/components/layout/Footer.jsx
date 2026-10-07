import { Heart } from 'lucide-react';

function FooterLandscape() {
  return <svg className="footer-landscape" viewBox="0 0 1440 210" preserveAspectRatio="none" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="footer-water" x1="720" y1="85" x2="720" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#dcebf4" /><stop offset="1" stopColor="#eff4f6" /></linearGradient>
      <linearGradient id="footer-leaf" x1="0" y1="-35" x2="15" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#b8c8cf" /><stop offset="1" stopColor="#d3dde0" /></linearGradient>
      <g id="footer-leaves">
        <path d="M0 0C-4-26-13-48-22-61M0 0C6-32 17-54 28-74M0 0C-1-32 1-62 4-91" stroke="#b6c6cd" strokeWidth="1.5" />
        <path d="M-12-31C-36-28-46-42-44-53c17-2 31 7 32 22ZM-20-54C-39-51-45-66-40-76c14 1 22 11 20 22ZM3-62C-12-74-9-94 4-104c12 14 13 29-1 42ZM14-40C12-61 27-68 39-66c1 16-10 26-25 26ZM26-68C22-85 33-94 43-94c5 14-4 23-17 26ZM-4-10C-24-9-37-20-34-32c17-2 27 6 30 22ZM6-13C11-33 27-38 40-31c-4 15-18 21-34 18Z" fill="url(#footer-leaf)" />
      </g>
    </defs>
    <path d="M0 29C69 64 90 46 139 73s108-17 176 15 163 14 224 32 116 15 189 9 94-32 151-25 77-17 146-15 78-45 143-32 58-41 108-26 97 29 164 26v153H0Z" fill="#e4e5e2" opacity=".65" />
    <g opacity=".64"><use href="#footer-leaves" transform="translate(5 124) rotate(-18) scale(1.08)" /><use href="#footer-leaves" transform="translate(84 100) rotate(20) scale(.54)" /><use href="#footer-leaves" transform="translate(250 86) rotate(-25) scale(.46)" /><use href="#footer-leaves" transform="translate(738 145) rotate(-14) scale(.65)" /><use href="#footer-leaves" transform="translate(803 145) rotate(35) scale(.42)" /><use href="#footer-leaves" transform="translate(925 127) rotate(-8) scale(.5)" /><use href="#footer-leaves" transform="translate(1043 107) rotate(18) scale(.56)" /><use href="#footer-leaves" transform="translate(1312 91) rotate(-16) scale(.84)" /><use href="#footer-leaves" transform="translate(1440 111) rotate(16) scale(.72)" /></g>
    <path d="M0 135C72 123 72 61 170 65c201-5 345 77 556 82s375-71 527-74 144 22 187 21v116H0Z" fill="#e7eff2" />
    <path d="M0 142C80 134 69 65 176 70c199-2 347 77 552 82s375-72 527-74 145 22 185 22v110H0Z" fill="url(#footer-water)" />
  </svg>;
}

export default function Footer() {
  return <footer className="site-footer">
    <FooterLandscape />
    <div className="container footer-content">
      <div className="footer-identity"><a className="brand fp-logo footer-brand" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a><div><p className="footer-name">Feri Ramdani</p><p className="footer-role">Full Stack Developer</p></div></div>
      <p className="footer-copyright">© {new Date().getFullYear()} Feri Ramdani. All rights reserved. <Heart size={14} aria-hidden="true" /></p>
    </div>
  </footer>;
}
