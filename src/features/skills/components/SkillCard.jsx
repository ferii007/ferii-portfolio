import { ArrowRight } from 'lucide-react';
import SkillIcon from './SkillIcon';

export default function SkillCard({ skill, active, onSelect }) {
  return <button className={`skill-card fp-skill${active ? ' is-active' : ''}`} type="button" onClick={() => onSelect(skill.id)} aria-haspopup="dialog" aria-expanded={active}>
    <span className="skill-icon" style={{ '--skill-color': skill.color, '--skill-color-holo': skill.colorOnHolo ?? skill.color }}><SkillIcon skill={skill} /></span><span>{skill.label}</span><ArrowRight className="skill-card-arrow" size={20} aria-hidden="true" />
  </button>;
}
