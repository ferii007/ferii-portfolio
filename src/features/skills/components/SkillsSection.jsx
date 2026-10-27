'use client';
import { useCallback, useRef } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import skills from '../data/skills.json';
import SkillCard from './SkillCard';
import SkillDialog from './SkillDialog';

export default function SkillsSection() {
  const { state, openSkill, closeSkill } = usePortfolioInteraction();
  const lastTrigger = useRef(null);
  const selected = skills.find((skill) => skill.id === state.activeSkillId) ?? null;
  const handleSelect = (id) => { lastTrigger.current = document.activeElement; openSkill(id); };
  const handleClose = useCallback(() => { closeSkill(); requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true })); }, [closeSkill]);
  return <section className="section skills-section fp-section" id="skills" aria-labelledby="skills-title"><div className="container fp-container">
    <div className="skills-heading">
      <div><h2 className="section-title" id="skills-title">My Skills<svg viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2></div>
      <div className="skills-handnote" aria-hidden="true"><svg viewBox="0 0 68 54" fill="none"><path d="M61 9C36 8 16 21 12 43M7 33l5 12 12-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p className="hand-note">Tools yang<br />kupahami.</p></div>
    </div>
    <div className="skills-stage">
      <div className="skills-panel">
        <span className="skills-panel-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="skills-grid">{skills.map((skill) => <SkillCard key={skill.id} skill={skill} active={selected?.id === skill.id} onSelect={handleSelect} />)}</div>
      </div>
      {/* Floor projector under the panel: bright core plus rings that spin at different speeds. */}
      <svg className="skills-portal" viewBox="0 0 1400 240" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id="skills-portal-core" cx=".5" cy=".5" r=".5"><stop stopColor="#f2fdff" /><stop offset=".3" stopColor="#9cecff" stopOpacity=".9" /><stop offset=".65" stopColor="#58dfff" stopOpacity=".4" /><stop offset="1" stopColor="#58dfff" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse className="skills-portal-core" cx="700" cy="64" rx="600" ry="58" fill="url(#skills-portal-core)" />
        <ellipse className="skills-ring skills-ring--a" cx="700" cy="66" rx="320" ry="28" pathLength="100" />
        <ellipse className="skills-ring skills-ring--b" cx="700" cy="70" rx="460" ry="40" pathLength="100" />
        <ellipse className="skills-ring skills-ring--c" cx="700" cy="76" rx="590" ry="56" pathLength="100" />
        <ellipse className="skills-ring skills-ring--d" cx="700" cy="84" rx="700" ry="76" pathLength="100" />
        <ellipse className="skills-ring skills-ring--e" cx="700" cy="90" rx="770" ry="98" pathLength="100" />
        <path className="skills-portal-trace" d="M40 -80C10 -20 16 60 90 110M70 -120C30 -40 40 50 120 98M1300 -170c60 40 70 140 10 220M1330 -120c40 40 40 110 0 170" />
        <circle className="skills-portal-node" cx="32" cy="-12" r="4" /><circle className="skills-portal-node" cx="1338" cy="-20" r="4" />
      </svg>
    </div>
    <SkillDialog skill={selected} onClose={handleClose} />
  </div></section>;
}
