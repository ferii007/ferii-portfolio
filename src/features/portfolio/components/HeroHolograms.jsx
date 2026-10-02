'use client';

import { useEffect, useRef } from 'react';

function HologramPanel({ variant, lines }) {
  return (
    <div className={`hero-browser hero-browser--${variant}`} aria-hidden="true">
      <div className="hero-browser__bar"><i /><i /><i /></div>
      {Array.from({ length: lines }, (_, index) => <span key={index} />)}
      <div className="hero-browser__beam" />
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
      <HologramPanel variant="back" lines={3} />
      <HologramPanel variant="mini" lines={2} />
      <HologramPanel variant="right" lines={3} />
      <HologramPanel variant="bottom" lines={4} />
    </div>
  );
}
