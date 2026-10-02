export default function SkillCard({ skill, active, onSelect }) {
  return <button className={`skill-card${active ? ' is-active' : ''}`} type="button" onClick={() => onSelect(skill.id)} aria-haspopup="dialog" aria-expanded={active}>
    <span className="skill-icon" style={{ '--skill-color': skill.color }} aria-hidden="true">{skill.iconLabel}</span><span>{skill.label}</span>
  </button>;
}
