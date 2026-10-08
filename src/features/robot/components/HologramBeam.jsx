'use client';
import { useEffect, useId, useState } from 'react';

export default function HologramBeam({ origin }) {
  const [target, setTarget] = useState(null);
  const id = useId();
  useEffect(() => {
    const update = () => {
      const panel = document.querySelector('.skill-dialog');
      if (!panel) return setTarget(null);
      const rect = panel.getBoundingClientRect();
      setTarget({ x: rect.right - 12, top: rect.top + rect.height * 0.16, bottom: rect.bottom - 28 });
    };
    update();
    const panel = document.querySelector('.skill-dialog');
    const observer = new ResizeObserver(update);
    if (panel) observer.observe(panel);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  if (!origin || !target) return null;
  const centerY = (target.top + target.bottom) / 2;
  const fan = `M ${origin.x} ${origin.y - 3} L ${target.x} ${target.top} L ${target.x} ${target.bottom} L ${origin.x} ${origin.y + 3} Z`;
  return <svg className="hologram-beam" aria-hidden="true" width="100%" height="100%">
    <defs>
      <linearGradient id={`${id}-wash`} gradientUnits="userSpaceOnUse" x1={origin.x} y1={origin.y} x2={target.x} y2={centerY}>
        <stop stopColor="#32c9ec" stopOpacity=".28" />
        <stop offset=".3" stopColor="#5bdcf3" stopOpacity=".13" />
        <stop offset="1" stopColor="#9eeeff" stopOpacity=".025" />
      </linearGradient>
      <radialGradient id={`${id}-source`}>
        <stop stopColor="#b4faff" stopOpacity=".8" />
        <stop offset=".25" stopColor="#46d8f4" stopOpacity=".4" />
        <stop offset="1" stopColor="#46d8f4" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" /></filter>
    </defs>
    <path d={fan} fill={`url(#${id}-wash)`} filter={`url(#${id}-soft)`} />
    <circle cx={origin.x} cy={origin.y} r="16" fill={`url(#${id}-source)`} />
  </svg>;
}
