'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import RobotFallback from './RobotFallback';
import RobotErrorBoundary from './RobotErrorBoundary';
import HologramBeam from './HologramBeam';

const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });

export default function RobotExperience() {
  const { state, setHeroVisible, cycleExpression } = usePortfolioInteraction();
  const [reducedMotion, setReducedMotion] = useState(true);
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
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible]);

  const showCanvas = !canvasFailed;
  const robot = <div className={`robot-experience robot-${state.location}${showCanvas && canvasReady ? ' robot-ready' : ''}`} data-location={state.location} data-expression={state.expression}>
    <div className="robot-figure">
      {!showCanvas && <RobotFallback expression={state.expression} />}
      {showCanvas && <RobotErrorBoundary onError={onError}><RobotCanvas expression={state.expression} projecting={Boolean(state.activeSkillId)} reducedMotion={reducedMotion} hero={state.location === 'hero'} onReady={onReady} onProjectorPosition={setBeamOrigin} /></RobotErrorBoundary>}
    </div>
    {state.activeSkillId && showCanvas && <HologramBeam origin={beamOrigin} />}
    <button className="robot-hit-area" type="button" onClick={cycleExpression} disabled={Boolean(state.activeSkillId)} aria-label="Ubah ekspresi robot" title="Klik robot untuk mengubah ekspresi" />
  </div>;
  return state.location === 'companion' ? createPortal(robot, document.body) : robot;
}
