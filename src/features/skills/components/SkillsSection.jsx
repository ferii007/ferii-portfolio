'use client';
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
    <div className="section-intro fp-section-heading"><div><p className="eyebrow fp-eyebrow">04 / My toolkit</p><h2 className="fp-h2 fp-section-title" id="skills-title">My Skills<span className="accent-dot">.</span></h2><p>Klik satu kartu untuk melihat ringkasan teknologinya dari Wikipedia.</p></div></div>
    <div className="skills-grid fp-skills">{skills.map((skill) => <SkillCard key={skill.id} skill={skill} active={selected?.id === skill.id} onSelect={handleSelect} />)}</div>
    <SkillDialog skill={selected} onClose={handleClose} />
  </div></section>;
}
