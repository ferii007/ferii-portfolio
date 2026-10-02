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
      <HologramShape variant="panel-code">
        <rect className="holo-browser-glass" x="22" y="22" width="356" height="196" rx="16" />
        <path className="holo-browser-divider" d="M22 56h356" />
        <circle className="holo-browser-dot" cx="49" cy="40" r="4" /><circle className="holo-browser-dot" cx="64" cy="40" r="4" /><circle className="holo-browser-dot" cx="79" cy="40" r="4" />
        <path className="holo-frame" d="M23 79V42c0-10 8-18 18-18h65m189 0h62c10 0 18 8 18 18v36M23 161v37c0 10 8 18 18 18h66m188 0h62c10 0 18-8 18-18v-38" />
        <path className="holo-panel-line" d="M54 71h116m-116 21h73m-73 21h142m-142 21h88M252 71h72m-72 21h47" />
        <path className="holo-panel-wave" d="m53 177 31-18 22 11 35-28 31 19 25-14 30 19 34-23 30 12 34-18" />
        <circle className="holo-node" cx="141" cy="142" r="4" /><circle className="holo-node" cx="261" cy="143" r="4" />
      </HologramShape>
      <HologramShape variant="panel-signal">
        <rect className="holo-browser-glass" x="22" y="22" width="356" height="196" rx="16" />
        <path className="holo-browser-divider" d="M22 56h356" />
        <circle className="holo-browser-dot" cx="49" cy="40" r="4" /><circle className="holo-browser-dot" cx="64" cy="40" r="4" /><circle className="holo-browser-dot" cx="79" cy="40" r="4" />
        <path className="holo-frame" d="M22 90V38c0-9 7-16 16-16h56m211 0h57c9 0 16 7 16 16v52M22 151v51c0 9 7 16 16 16h56m211 0h57c9 0 16-7 16-16v-51" />
        <circle className="holo-panel-ring" cx="118" cy="121" r="54" /><circle className="holo-panel-ring" cx="118" cy="121" r="30" />
        <path className="holo-panel-line" d="M204 77h113m-113 22h76m-76 22h126m-126 22h91m-91 22h58" />
        <path className="holo-panel-wave" d="m68 121 27-16 23 16 36-39m-36 39 34 29" />
        <circle className="holo-node" cx="118" cy="121" r="5" />
      </HologramShape>
    </div>
  );
}
