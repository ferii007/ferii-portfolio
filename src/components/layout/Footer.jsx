'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate } from '@/constants/localization';
import { anchor } from '@/constants/site';
import Logo from './Logo';

// U01 ledge, U02 books + plant and the robot's landing pad are separate layers so each can drift a little on scroll.
const ledgeRim = 'M60 330L780 330C890 333 960 376 1060 394C1110 401 1160 400 1220 400L1420 398C1600 388 1770 377 1880 359';
function FooterStudio() {
  return <div className="footer-studio">
    <div className="footer-layer footer-layer--ledge" aria-hidden="true"><div className="footer-ledge">
      <Image src="/images/footer/studio-ledge.webp" width={1920} height={640} sizes="140vw" alt="" />
      {/* Live light on the ledge's baked cyan rim (traced in its 1920×640 pixels): the rim breathes and pulses of light run along it. */}
      <svg className="footer-rim" viewBox="0 0 1920 640" fill="none">
        <path className="footer-rim-glow" d={ledgeRim} />
        <path className="footer-rim-pulse" d={ledgeRim} pathLength="100" />
        <path className="footer-rim-pulse footer-rim-pulse--2" d={ledgeRim} pathLength="100" />
        <path className="footer-rim-spark" d={ledgeRim} pathLength="100" />
      </svg>
    </div></div>
    <div className="footer-layer footer-layer--props" aria-hidden="true">
      <div className="footer-props">
        <Image src="/images/footer/studio-books-plant.webp" width={1100} height={550} sizes="(max-width: 767px) 70vw, 560px" alt="" />
        {/* Spine titles in the artwork's 1100×550 pixels, between each spine's own diamonds. */}
        <svg viewBox="0 0 1100 550" fill="none"><g className="footer-foil">
          <text transform="translate(589 272) rotate(-3.3)" fontSize="38">DESIGN</text>
          <text transform="translate(608 345) rotate(-4.1)" fontSize="38">CODE</text>
          <text transform="translate(616 419) rotate(-5.4)" fontSize="38">PROGRESS</text>
        </g></svg>
      </div>
    </div>
    <div className="footer-layer footer-layer--robot">
      {/* Landing pad: while the footer is on screen the real robot (hero pose) stands here instead of floating. */}
      <div className="footer-pad">
        <svg className="footer-portal" viewBox="0 0 400 120" fill="none" aria-hidden="true">
          <defs><radialGradient id="footer-portal-core" cx=".5" cy=".5" r=".5"><stop stopColor="#f2fdff" /><stop offset=".3" stopColor="#9cecff" stopOpacity=".9" /><stop offset=".7" stopColor="#58dfff" stopOpacity=".35" /><stop offset="1" stopColor="#58dfff" stopOpacity="0" /></radialGradient></defs>
          <ellipse className="footer-portal-core" cx="200" cy="60" rx="170" ry="44" fill="url(#footer-portal-core)" />
          <ellipse className="footer-portal-ring footer-portal-ring--a" cx="200" cy="60" rx="70" ry="17" pathLength="100" />
          <ellipse className="footer-portal-ring footer-portal-ring--b" cx="200" cy="61" rx="112" ry="28" pathLength="100" />
          <ellipse className="footer-portal-ring footer-portal-ring--c" cx="200" cy="62" rx="152" ry="39" pathLength="100" />
          <ellipse className="footer-portal-ring footer-portal-ring--d" cx="200" cy="63" rx="190" ry="50" pathLength="100" />
        </svg>
      </div>
      <div className="footer-robot-slot" id="footer-robot-slot" />
    </div>
  </div>;
}

export default function Footer() {
  const { localization: { text } } = useLocalization();
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = footer.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / height));
      // 1 while the footer is entering, 0 once it is fully in view; layers multiply this by their own travel.
      footer.style.setProperty('--footer-shift', reducedMotion.matches ? 0 : (1 - progress).toFixed(3));
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
    <FooterStudio />
    <div className="container footer-content">
      <Logo className="footer-brand" href={anchor('top')} label={text.logo_back_to_top} />
      <p className="footer-copyright">{interpolate(text.footer_copyright, { year: new Date().getFullYear() })}</p>
    </div>
  </footer>;
}
