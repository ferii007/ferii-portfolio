'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import RobotFallback from './RobotFallback';
import RobotErrorBoundary from './RobotErrorBoundary';
import HologramBeam from './HologramBeam';

const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });

export default function RobotExperience() {
  const { state, setHeroVisible, cycleExpression } = usePortfolioInteraction();
  const [reducedMotion, setReducedMotion] = useState(true);
  const [compactCompanion, setCompactCompanion] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [beamOrigin, setBeamOrigin] = useState(null);
  const onReady = useCallback(() => setCanvasReady(true), []);
  const onError = useCallback(() => setCanvasFailed(true), []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)');
    const update = () => setCompactCompanion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible]);

  const showCanvas = !reducedMotion && !canvasFailed && !compactCompanion && state.location === 'companion';
  return <div className={`robot-experience robot-${state.location}`} data-location={state.location}>
    <div className="robot-figure">
      {(!canvasReady || !showCanvas) && <RobotFallback expression={state.expression} />}
      {showCanvas && <RobotErrorBoundary onError={onError}><RobotCanvas expression={state.expression} projecting={Boolean(state.activeSkillId)} onReady={onReady} onProjectorPosition={setBeamOrigin} /></RobotErrorBoundary>}
    </div>
    {state.activeSkillId && showCanvas && <HologramBeam origin={beamOrigin} />}
    <button className="robot-control" type="button" onClick={cycleExpression} aria-label="Ubah ekspresi robot" title="Ubah ekspresi robot"><Sparkles size={18} /><span>Ubah ekspresi</span></button>
  </div>;
}
