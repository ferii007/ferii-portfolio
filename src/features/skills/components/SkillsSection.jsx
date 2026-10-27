'use client';
import { useCallback, useRef } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { useLocalization } from '@/context/LocalizationProvider';
import Lines from '@/components/typography/Lines';
import skills from '../data/skills.json';
import SkillCard from './SkillCard';
import SkillDialog from './SkillDialog';
import { Section, SectionTitle } from '@/components/layout/Section';
import Doodle from '@/components/doodles/Doodle';

export default function SkillsSection() {
  const { localization: { text } } = useLocalization();
  const { state, openSkill, closeSkill } = usePortfolioInteraction();
  const lastTrigger = useRef(null);
  const selected = skills.find((skill) => skill.id === state.activeSkillId) ?? null;
  const handleSelect = (id) => { lastTrigger.current = document.activeElement; openSkill(id); };
  const handleClose = useCallback(() => { closeSkill(); requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true })); }, [closeSkill]);
  return <Section name="skills" className="skills-section fp-section"><div className="container fp-container">
    <div className="skills-heading">
      <div><SectionTitle name="skills" /></div>
      <div className="skills-handnote" aria-hidden="true"><Doodle name="arrowCurl" /><p className="hand-note"><Lines text={text.skills_handnote} /></p></div>
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
  </div></Section>;
}
