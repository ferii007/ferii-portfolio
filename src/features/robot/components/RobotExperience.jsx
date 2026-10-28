'use client';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { useLocalization } from '@/context/LocalizationProvider';
import { interpolate } from '@/constants/localization';
import RobotFallback from './RobotFallback';
import RobotErrorBoundary from './RobotErrorBoundary';
import HologramBeam from './HologramBeam';
import { DEPARTURE_DURATION } from '../departureMotion';
import useReducedMotion from '@/lib/useReducedMotion';
import { reportClientError } from '@/lib/reportError';

const RobotCanvas = dynamic(() => import('./RobotCanvas'), { ssr: false });
// The chat code loads only when a visitor first opens it.
const ChatPanel = dynamic(() => import('@/features/chat/components/ChatPanel'), { ssr: false });

export default function RobotExperience() {
  const { localization: { text } } = useLocalization();
  const { state, setHeroVisible, completeHeroReturn, cycleExpression, dismissRobotMessage, toggleChat, closeChat, setChatThinking } = usePortfolioInteraction();
  const reducedMotion = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [beamOrigin, setBeamOrigin] = useState(null);
  const onReady = useCallback(() => setCanvasReady(true), []);
  // The 3D scene failing is caught by RobotErrorBoundary (the fallback image shows), so report it explicitly.
  const onError = useCallback((error) => { setCanvasFailed(true); reportClientError('robot', error); }, []);
  // Mounted on first open and kept, so the conversation survives closing the panel.
  const [chatLoaded, setChatLoaded] = useState(false);
  const onChatToggle = () => { setChatLoaded(true); toggleChat(); };
  // Closing the chat hands focus back to the bubble that opened it.
  const launcherRef = useRef(null);
  const chatWasOpen = useRef(false);
  useEffect(() => {
    if (chatWasOpen.current && !state.chatOpen) launcherRef.current?.focus();
    chatWasOpen.current = state.chatOpen;
  }, [state.chatOpen]);

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
  // A blank stare while it waits for the AI's answer.
  const expression = state.chatThinking ? 'deadpan' : hero ? state.expression : 'side-eye';
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
    {!state.chatOpen && !(state.message && !hero && !returning) && <button ref={launcherRef} className="robot-chat-launcher" type="button" onClick={onChatToggle} aria-expanded="false">{text.chat_open}</button>}
    {hero && <button className="robot-hit-area" type="button" onClick={cycleExpression} disabled={Boolean(state.activeSkillId)} aria-label={text.robot_change_expression} title={text.robot_change_expression_hint} />}
  </div>;
  const chat = chatLoaded && createPortal(<ChatPanel open={state.chatOpen} beside={!hero && !footer} onClose={closeChat} onThinking={setChatThinking} />, document.body);
  return <>{hero ? robot : createPortal(robot, footer ? footerSlot : document.body)}{chat}</>;
}
