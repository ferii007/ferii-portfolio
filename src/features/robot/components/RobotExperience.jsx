'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate } from '@/constants/localization';
import RobotFallback from './RobotFallback';
import RobotErrorBoundary from './RobotErrorBoundary';
import HologramBeam from './HologramBeam';
import { DEPARTURE_DURATION } from '../departureMotion';
import useReducedMotion from '@/lib/useReducedMotion';

const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });

export default function RobotExperience() {
  const { localization: { text } } = useLocalization();
  const { state, setHeroVisible, completeHeroReturn, cycleExpression, dismissRobotMessage } = usePortfolioInteraction();
  const reducedMotion = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [beamOrigin, setBeamOrigin] = useState(null);
  const onReady = useCallback(() => setCanvasReady(true), []);
  const onError = useCallback(() => setCanvasFailed(true), []);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12, reducedMotion), { threshold: [0, 0.12] });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [setHeroVisible, reducedMotion]);
  // The footer has a landing pad: while it is on screen the robot stands there (hero pose) instead of floating.
  const [footerSlot, setFooterSlot] = useState(null);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    const slot = document.getElementById('footer-robot-slot');
    if (!slot) return;
    const observer = new IntersectionObserver(([entry]) => {
      setFooterSlot(entry.isIntersecting ? slot : null);
      if (!entry.isIntersecting) setLanded(false); // next arrival lands again
    }, { threshold: 0.35 });
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reducedMotion && state.location === 'returning') completeHeroReturn();
  }, [reducedMotion, state.location, completeHeroReturn]);

  useEffect(() => {
    if (!state.message) return;
    const timer = window.setTimeout(dismissRobotMessage, 6500);
    return () => window.clearTimeout(timer);
  }, [state.message, dismissRobotMessage]);

  const showCanvas = !canvasFailed;
  const hero = state.location === 'hero';
  const returning = state.location === 'returning';
  const footer = Boolean(footerSlot) && !hero && !returning;
  // Arriving at the footer it flies in (thrusters on) and touches down on the pad, then stands in its hero pose.
  const landing = footer && !landed && !reducedMotion;
  const expression = hero ? state.expression : 'side-eye';
  const projecting = Boolean(state.activeSkillId) && !returning;
  const robot = <div className={`robot-experience robot-${hero ? 'hero' : footer ? 'footer' : 'companion'}${landing ? ' robot-landing' : ''}${returning ? ' robot-returning' : ''}${showCanvas && canvasReady ? ' robot-ready' : ''}`} style={{ '--robot-departure-duration': `${DEPARTURE_DURATION}ms` }} data-location={state.location} data-expression={expression} onAnimationEnd={(event) => {
    if (event.animationName === 'robot-departure') completeHeroReturn();
    if (event.animationName === 'robot-landing') setLanded(true);
  }}>
    <div className="robot-figure">
      {!showCanvas && <RobotFallback expression={expression} alt={interpolate(text.robot_fallback_alt, { expression })} />}
      {showCanvas && <RobotErrorBoundary onError={onError}><RobotCanvas expression={expression} projecting={projecting && !footer} departing={returning} reducedMotion={reducedMotion} hero={hero || (footer && !landing)} framing={footer ? 'footer' : 'default'} instant={footer} onReady={onReady} onProjectorPosition={setBeamOrigin} /></RobotErrorBoundary>}
    </div>
    {!hero && !returning && <div className="robot-speech" role="status" aria-live="polite" aria-atomic="true">
      {state.message && <p className="robot-speech-bubble">{state.message.text}</p>}
    </div>}
    {projecting && showCanvas && <HologramBeam origin={beamOrigin} />}
    {hero && <button className="robot-hit-area" type="button" onClick={cycleExpression} disabled={Boolean(state.activeSkillId)} aria-label={text.robot_change_expression} title={text.robot_change_expression_hint} />}
  </div>;
  return hero ? robot : createPortal(robot, footer ? footerSlot : document.body);
}
