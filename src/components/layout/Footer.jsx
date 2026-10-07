'use client';

import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

function FooterLandscape() {
  return <div className="footer-landscape" aria-hidden="true">
    <div className="footer-plants"><span className="footer-plant footer-plant--left" /><span className="footer-plant footer-plant--center" /><span className="footer-plant footer-plant--right" /></div>
    <svg className="footer-waves" viewBox="0 0 1440 210" preserveAspectRatio="none" fill="none">
      <defs><linearGradient id="footer-water" x1="720" y1="85" x2="720" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#dcebf4" /><stop offset="1" stopColor="#eff4f6" /></linearGradient></defs>
      <path className="footer-wave" d="M0 133C72 121 72 59 170 63c201-5 345 77 556 82s375-71 527-74 144 22 187 21v118H0Z" fill="#e6edeb" />
      <path d="M0 142C80 134 69 65 176 70c199-2 347 77 552 82s375-72 527-74 145 22 185 22v110H0Z" fill="url(#footer-water)" />
    </svg>
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
      footer.style.setProperty('--footer-travel', `${reducedMotion.matches ? 0 : (1 - progress) * 24}px`);
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
