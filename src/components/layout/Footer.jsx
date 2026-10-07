import { ArrowUp, Heart } from 'lucide-react';

function FooterSprig({ className }) {
  return <svg className={className} viewBox="0 0 240 110" fill="none" aria-hidden="true"><g fill="currentColor"><path d="M113 107C104 71 91 41 69 14c-2 28 13 54 34 69-11-31-27-42-52-47 3 27 26 45 53 48-24-17-47-20-73-9 17 21 43 23 75 11l7 21Z" /><path d="M124 109c-2-42 8-77 32-105 7 32-7 59-26 78 14-31 36-45 64-44-6 25-30 44-62 46 27-16 58-18 87-4-26 22-54 23-88 8l-7 21Z" /></g><path d="M116 109C108 72 92 40 71 18m52 90c0-38 12-73 33-101" stroke="currentColor" strokeWidth="2" /></svg>;
}

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-landscape" aria-hidden="true"><FooterSprig className="footer-sprig footer-sprig--left" /><FooterSprig className="footer-sprig footer-sprig--right" /><svg className="footer-wave" viewBox="0 0 1440 100" preserveAspectRatio="none"><path d="M0 31C185 4 301 85 509 66S858 9 1050 39s264 19 390-15v76H0Z" fill="#edf5f9" /><path d="M0 54c166-33 331 54 537 32s352-69 550-31 278 20 353 6v39H0Z" fill="#e3f0f8" /></svg></div>
    <div className="container footer-content"><div className="footer-identity"><a className="brand footer-brand" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a><div><p className="footer-name">Feri Ramdani</p><p className="footer-role">Full Stack Developer</p></div></div><div className="footer-bottom"><a className="footer-back-top" href="#top">Kembali ke atas <ArrowUp size={15} aria-hidden="true" /></a><p className="footer-copyright">© {new Date().getFullYear()} Feri Ramdani. Dibuat dengan rasa ingin tahu <Heart size={14} aria-hidden="true" /></p></div></div>
  </footer>;
}
