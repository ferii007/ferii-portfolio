'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import useReducedMotion from '@/lib/useReducedMotion';

function HologramShape({ variant, viewBox, children }) {
  return (
    <div className={`hero-projection hero-projection--${variant}`} aria-hidden="true">
      <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </div>
  );
}

// The trail from the outer floor ring toward About; the energy spark laps the ring (the arc) then follows the trail.
const TRAIL_START = 'M589 60';
const TRAIL = `${TRAIL_START}C625 62 660 64 690 64L734 63C752 60 758 44 750 34 744 27 736 32 738 40 740 50 752 60 770 70 800 86 830 100 827 120 823 145 785 160 750 172 720 182 690 210 681 237L677 254`;
const ENERGY = `M589 60.2A325 52 0 0 1 171 139.8 325 52 0 0 1 589 60.2${TRAIL.slice(TRAIL_START.length)}`;

export default function HeroHolograms() {
  const panelsRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = panelsRef.current?.parentElement;
    if (!stage) return;

    function move(event) {
      if (reducedMotion || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
      const bounds = stage.getBoundingClientRect();
      stage.style.setProperty('--holo-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 14}px`);
      stage.style.setProperty('--holo-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
    }

    function reset() {
      stage.style.setProperty('--holo-x', '0px');
      stage.style.setProperty('--holo-y', '0px');
    }

    // The effect re-runs when the motion preference changes; turning motion off settles the panels.
    if (reducedMotion) reset();
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', reset);
    return () => {
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', reset);
    };
  }, [reducedMotion]);

  return (
    <div className="hero-holograms" ref={panelsRef}>
      <HologramShape variant="circuit" viewBox="0 0 600 500">
        <path className="holo-trace" d="M0 214H140M470 214H600M0 352H110M500 352H600M60 120V200M548 260V340" />
        <circle className="holo-node" cx="86" cy="210" r="3" /><circle className="holo-node" cx="514" cy="352" r="3" /><circle className="holo-node" cx="514" cy="132" r="2.5" />
      </HologramShape>
      <div className="hero-projection hero-projection--panel-code" aria-hidden="true"><Image className="fp-img" src="/images/hero/holo-panel-code.svg" width={360} height={330} unoptimized priority alt="" /></div>
      <div className="hero-projection hero-projection--panel-media" aria-hidden="true"><Image className="fp-img" src="/images/hero/holo-panel-media.svg" width={340} height={330} unoptimized priority alt="" /></div>
      <div className="hero-projection hero-projection--portal" aria-hidden="true">
        {/* Floor rings spin; an energy spark laps the outer ring, then is flung out and draws the trail toward About as it goes. */}
        <svg className="fp-overlay hero-portal-svg" viewBox="0 0 760 200" fill="none">
          <defs>
            <linearGradient id="hero-trail-ink" gradientUnits="userSpaceOnUse" x1="589" y1="60" x2="677" y2="254"><stop stopColor="#8fdcf5" /><stop offset=".45" stopColor="#6fd0f3" /><stop offset="1" stopColor="#56c3ee" /></linearGradient>
            <radialGradient id="hero-portal-disc" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#b6edff" stopOpacity=".75" /><stop offset=".7" stopColor="#d4f4ff" stopOpacity=".45" /><stop offset="1" stopColor="#eafaff" stopOpacity="0" /></radialGradient>
          </defs>
          <ellipse className="hero-portal-disc" cx="380" cy="100" rx="175" ry="32" fill="url(#hero-portal-disc)" />
          <ellipse className="hero-ring hero-ring--glow" cx="380" cy="100" rx="195" ry="35" />
          <ellipse className="hero-ring hero-ring--main" cx="380" cy="100" rx="195" ry="35" pathLength="100" />
          <ellipse className="hero-ring hero-ring--dash-a" cx="380" cy="100" rx="225" ry="38" pathLength="100" />
          <ellipse className="hero-ring hero-ring--solid" cx="380" cy="100" rx="252" ry="41" />
          <ellipse className="hero-ring hero-ring--dash-b" cx="380" cy="100" rx="290" ry="47" pathLength="100" />
          <ellipse className="hero-ring hero-ring--dash-c" cx="380" cy="100" rx="325" ry="52" pathLength="100" />
          <path className="hero-ring-marker" d="M38 100l12-5v10zm18 0 9-4v8z" />
<path className="hero-trail hero-trail--glow" pathLength="1" d={TRAIL} />
          <path className="hero-trail" pathLength="1" d={TRAIL} />
          <path className="hero-trail-head" d="m669 238 8 16 13-12" />
          <path id="hero-energy" className="hero-energy" pathLength="1" d={ENERGY} />
        </svg>
      </div>
    </div>
  );
}
