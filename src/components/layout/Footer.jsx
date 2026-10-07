'use client';

import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

const frontCrest = 'M0 142C80 134 69 65 176 70c199-2 347 77 552 82s375-72 527-74 145 22 185 22';

function FooterLandscape() {
  return <div className="footer-landscape" aria-hidden="true">
    <div className="footer-sprigs">
      <span className="footer-plant footer-plant--sprig-left" />
      <span className="footer-plant footer-plant--sprig-right" />
    </div>
    <svg className="footer-waves" viewBox="0 0 1440 210" preserveAspectRatio="none" fill="none">
      <defs><linearGradient id="footer-water" x1="720" y1="85" x2="720" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#dcebf4" /><stop offset="1" stopColor="#eff4f6" /></linearGradient></defs>
      <path className="footer-crest" d={frontCrest} />
      <path className="footer-wave footer-wave--back" d="M0 133C72 121 72 59 170 63c201-5 345 77 556 82s375-71 527-74 144 22 187 21v118H0Z" fill="#e6edeb" />
      <path className="footer-wave footer-wave--front" d={`${frontCrest}v110H0Z`} fill="url(#footer-water)" />
    </svg>
    <div className="footer-plants">
      <span className="footer-plant footer-plant--left" />
      <span className="footer-plant footer-plant--center" />
      <span className="footer-plant footer-plant--right" />
    </div>
  </div>;
}

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const wave = footer.querySelector('.footer-waves');
    const crest = wave.querySelector('.footer-crest');
    const plants = footer.querySelectorAll('.footer-plant');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const placePlants = () => {
      const footerRect = footer.getBoundingClientRect();
      const waveRect = wave.getBoundingClientRect();
      const crestLength = crest.getTotalLength();

      plants.forEach((plant) => {
        const anchor = parseFloat(getComputedStyle(plant).getPropertyValue('--plant-x')) / 100;
        const x = footerRect.width * anchor;
        const crestX = ((footerRect.left + x - waveRect.left) / waveRect.width) * 1440;
        let start = 0;
        let end = crestLength;
        for (let i = 0; i < 14; i++) {
          const middle = (start + end) / 2;
          if (crest.getPointAtLength(middle).x < crestX) start = middle;
          else end = middle;
        }
        const crestY = waveRect.top - footerRect.top + (crest.getPointAtLength((start + end) / 2).y / 210) * waveRect.height;
        const depth = plant.parentElement.classList.contains('footer-sprigs') ? 18 : 12;
        plant.style.left = `${x - plant.offsetWidth / 2}px`;
        // The painted base ends near 91% of the sprite cell height.
        plant.style.top = `${crestY + depth - plant.offsetHeight * .91}px`;
      });
    };
    const update = () => {
      frame = 0;
      const { top, height } = footer.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / height));
      footer.style.setProperty('--footer-travel', `${reducedMotion.matches ? 0 : (1 - progress) * 80}px`);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const resize = () => { placePlants(); schedule(); };
    placePlants();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
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
