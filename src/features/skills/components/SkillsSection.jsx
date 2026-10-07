'use client';
import Description from '@/components/typography/Description';
import { useCallback, useRef } from 'react';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { skills } from '../data/skills';
import SkillCard from './SkillCard';
import SkillDialog from './SkillDialog';

export default function SkillsSection() {
  const { state, openSkill, closeSkill } = usePortfolioInteraction();
  const lastTrigger = useRef(null);
  const selected = skills.find((skill) => skill.id === state.activeSkillId) ?? null;
  const handleSelect = (id) => { lastTrigger.current = document.activeElement; openSkill(id); };
  const handleClose = useCallback(() => { closeSkill(); requestAnimationFrame(() => lastTrigger.current?.focus()); }, [closeSkill]);
  return <section className="section skills-section fp-section" id="skills" aria-labelledby="skills-title"><div className="container fp-container">
    <div className="skills-heading">
      <div><h2 id="skills-title">My Skills<svg className="skills-title-spark" viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2><Description>Klik satu kartu untuk melihat ringkasan teknologinya dari Wikipedia.</Description></div>
      <div className="skills-handnote" aria-hidden="true"><svg viewBox="0 0 68 54" fill="none"><path d="M61 9C36 8 16 21 12 43M7 33l5 12 12-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p>Tools yang<br />sering kupakai.</p></div>
    </div>
    <div className="skills-grid">{skills.map((skill) => <SkillCard key={skill.id} skill={skill} active={selected?.id === skill.id} onSelect={handleSelect} />)}</div>
    <SkillDialog skill={selected} onClose={handleClose} />
  </div></section>;
}
