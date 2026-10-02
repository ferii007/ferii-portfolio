'use client';
import { useEffect, useState } from 'react';

export default function HologramBeam({ origin }) {
  const [target, setTarget] = useState(null);
  useEffect(() => {
    const update = () => {
      const panel = document.querySelector('.skill-dialog');
      if (!panel) return setTarget(null);
      const rect = panel.getBoundingClientRect();
      setTarget({ x: rect.right - 8, y: rect.bottom - 18 });
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
  return <svg className="hologram-beam" aria-hidden="true" width="100%" height="100%"><defs><linearGradient id="beam-gradient"><stop stopColor="#56ddf7" stopOpacity=".05" /><stop offset="1" stopColor="#36c8ec" stopOpacity=".75" /></linearGradient></defs><line x1={origin.x} y1={origin.y} x2={target.x} y2={target.y} stroke="url(#beam-gradient)" strokeWidth="8" strokeLinecap="round" /><line x1={origin.x} y1={origin.y} x2={target.x} y2={target.y} stroke="#a4f2ff" strokeWidth="2" strokeLinecap="round" /></svg>;
}
