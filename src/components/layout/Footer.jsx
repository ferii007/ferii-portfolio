'use client';

import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

function FooterLandscape() {
  return <div className="footer-landscape" aria-hidden="true">
    <div className="footer-sun" />
    <svg className="footer-hill footer-hill--distant" viewBox="0 0 1440 360" preserveAspectRatio="none"><path d="M0 177C128 171 194 28 335 55S505 194 657 150 886 30 1015 71 1264 168 1440 100V360H0Z" fill="#dce7e7" /></svg>
    <svg className="footer-hill footer-hill--middle" viewBox="0 0 1440 360" preserveAspectRatio="none"><path d="M0 185C146 80 282 125 411 182S667 241 817 151 1100 99 1229 158 1369 168 1440 143V360H0Z" fill="#bdd6dc" /><path d="M0 185C146 80 282 125 411 182S667 241 817 151 1100 99 1229 158 1369 168 1440 143" fill="none" stroke="#f4f8f5" strokeOpacity=".42" strokeWidth="2" /></svg>
    <svg className="footer-hill footer-hill--near" viewBox="0 0 1440 360" preserveAspectRatio="none"><path d="M0 222C146 263 268 255 412 208S679 141 838 211 1139 269 1292 214 1386 190 1440 197V360H0Z" fill="#8fb8c8" /><path d="M690 181C741 200 757 216 733 239S651 263 706 288" fill="none" stroke="#cde0e6" strokeWidth="7" strokeLinecap="round" opacity=".65" /></svg>
    <svg className="footer-hill footer-hill--foreground" viewBox="0 0 1440 360" preserveAspectRatio="none"><defs><linearGradient id="footer-meadow" x1="0" y1="260" x2="0" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#dcebf1" /><stop offset="1" stopColor="#eef4f6" /></linearGradient></defs><path d="M0 280C203 223 326 268 515 291S844 272 1036 261 1294 282 1440 253V360H0Z" fill="url(#footer-meadow)" /></svg>
  </div>;
}

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = footer.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / height));
      footer.style.setProperty('--footer-travel', `${reducedMotion.matches ? 0 : (1 - progress) * 70}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  return <footer ref={footerRef} className="site-footer">
    <FooterLandscape />
    <div className="container footer-content">
      <a className="brand fp-logo footer-brand" href="#top" aria-label="Feri, kembali ke atas">feri<span>.</span></a>
      <p className="footer-copyright">© {new Date().getFullYear()} Feri Ramdani. All rights reserved. <Heart size={14} aria-hidden="true" /></p>
    </div>
  </footer>;
}
