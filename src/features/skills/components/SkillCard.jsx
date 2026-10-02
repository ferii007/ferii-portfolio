import SkillIcon from './SkillIcon';

export default function SkillCard({ skill, active, onSelect }) {
  return <button className={`skill-card fp-skill${active ? ' is-active' : ''}`} type="button" onClick={() => onSelect(skill.id)} aria-haspopup="dialog" aria-expanded={active}>
    <span className="skill-icon fp-skill__icon" style={{ '--skill-color': skill.color }}><SkillIcon skill={skill} /></span><span>{skill.label}</span>
  </button>;
}
