'use client';

import { useEffect, useRef } from 'react';

function HologramShape({ variant, children }) {
  return (
    <div className={`hero-projection hero-projection--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">{children}</svg>
    </div>
  );
}

export default function HeroHolograms() {
  const panelsRef = useRef(null);

  useEffect(() => {
    const stage = panelsRef.current?.parentElement;
    if (!stage) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function move(event) {
      if (reducedMotion.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
      const bounds = stage.getBoundingClientRect();
      stage.style.setProperty('--holo-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 14}px`);
      stage.style.setProperty('--holo-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 12}px`);
    }

    function reset() {
      stage.style.setProperty('--holo-x', '0px');
      stage.style.setProperty('--holo-y', '0px');
    }

    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', reset);
    reducedMotion.addEventListener('change', reset);
    return () => {
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', reset);
      reducedMotion.removeEventListener('change', reset);
    };
  }, []);

  return (
    <div className="hero-holograms" ref={panelsRef}>
      <HologramShape variant="back">
        <ellipse className="holo-orbit" cx="182" cy="128" rx="155" ry="77" transform="rotate(-14 182 128)" />
        <ellipse className="holo-orbit holo-orbit--faint" cx="182" cy="128" rx="118" ry="105" transform="rotate(22 182 128)" />
        <path className="holo-trace" d="M15 174c56-39 123-58 193-54 60 3 115 21 173 57M37 93c71-38 153-48 230-22M48 198c69 13 137 6 197-20" />
        <path className="holo-data" d="M38 57h75m-64 12h43M21 145h101m-79 11h63M248 40h69m-58 12h43" />
        <circle className="holo-node" cx="63" cy="164" r="5" /><circle className="holo-node" cx="277" cy="71" r="4" /><circle className="holo-node" cx="340" cy="161" r="3" />
        <path className="holo-spark" d="m69 163 39-43 54-19m115-30 35 51 28 39" />
      </HologramShape>
      <HologramShape variant="mini">
        <path className="holo-orbit" d="m200 25 112 63v65l-112 63-112-63V88z" />
        <path className="holo-orbit holo-orbit--faint" d="m200 54 85 48v38l-85 48-85-48v-38z" />
        <circle className="holo-node" cx="200" cy="120" r="21" />
        <path className="holo-spark" d="M200 25v74m0 42v75M88 88l94 23m36 18 94 24M88 153l94-24m36-18 94-23" />
      </HologramShape>
      <HologramShape variant="right">
        <circle className="holo-orbit" cx="200" cy="120" r="94" />
        <circle className="holo-orbit holo-orbit--faint" cx="200" cy="120" r="62" />
        <path className="holo-trace" d="M200 7v38m0 150v38M87 120h38m150 0h38M133 53l28 28m78 78 28 28" />
        <path className="holo-spark" d="M200 120 265 57M200 120l-54 71" />
        <circle className="holo-node" cx="200" cy="120" r="9" /><circle className="holo-node" cx="265" cy="57" r="5" />
      </HologramShape>
      <HologramShape variant="bottom">
        <ellipse className="holo-orbit" cx="198" cy="182" rx="174" ry="33" />
        <path className="holo-orbit" d="M45 175c0-71 68-129 153-129s153 58 153 129" />
        <path className="holo-orbit holo-orbit--faint" d="M105 175c0-71 41-129 93-129s93 58 93 129M198 46v129" />
        <path className="holo-trace" d="M71 119c72 33 183 33 254 0M45 175h306M88 84c69 29 150 29 219 0" />
        <path className="holo-data" d="M25 210h78m11 0h32m114 0h113" />
        <circle className="holo-node" cx="78" cy="117" r="5" /><circle className="holo-node" cx="309" cy="84" r="4" />
      </HologramShape>
    </div>
  );
}
