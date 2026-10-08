'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import RobotFallback from './RobotFallback';
import RobotErrorBoundary from './RobotErrorBoundary';
import HologramBeam from './HologramBeam';
import { DEPARTURE_DURATION } from '../departureMotion';

const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });

export default function RobotExperience() {
  const { state, setHeroVisible, completeHeroReturn, cycleExpression } = usePortfolioInteraction();
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
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12, reducedMotion), { threshold: [0, 0.12] });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible, reducedMotion]);
  useEffect(() => {
    if (reducedMotion && state.location === 'returning') completeHeroReturn();
  }, [reducedMotion, state.location, completeHeroReturn]);

  const showCanvas = !canvasFailed;
  const hero = state.location === 'hero';
  const returning = state.location === 'returning';
  const expression = hero ? state.expression : 'side-eye';
  const projecting = Boolean(state.activeSkillId) && !returning;
  const robot = <div className={`robot-experience robot-${hero ? 'hero' : 'companion'}${returning ? ' robot-returning' : ''}${showCanvas && canvasReady ? ' robot-ready' : ''}`} style={{ '--robot-departure-duration': `${DEPARTURE_DURATION}ms` }} data-location={state.location} data-expression={expression} onAnimationEnd={(event) => {
    if (event.animationName === 'robot-departure') completeHeroReturn();
  }}>
    <div className="robot-figure">
      {!showCanvas && <RobotFallback expression={expression} />}
      {showCanvas && <RobotErrorBoundary onError={onError}><RobotCanvas expression={expression} projecting={projecting} departing={returning} reducedMotion={reducedMotion} hero={hero} onReady={onReady} onProjectorPosition={setBeamOrigin} /></RobotErrorBoundary>}
    </div>
    {projecting && showCanvas && <HologramBeam origin={beamOrigin} />}
    {hero && <button className="robot-hit-area" type="button" onClick={cycleExpression} disabled={Boolean(state.activeSkillId)} aria-label="Ubah ekspresi robot" title="Klik robot untuk mengubah ekspresi" />}
  </div>;
  return hero ? robot : createPortal(robot, document.body);
}
