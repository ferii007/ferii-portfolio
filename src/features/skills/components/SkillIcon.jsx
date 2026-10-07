export default function SkillIcon({ skill }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {skill.iconPath ? <path fill="currentColor" d={skill.iconPath} /> : <>
      <rect width="24" height="24" rx="1.5" fill="currentColor" />
      <text x="22" y="21" textAnchor="end" fill="#15202b" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">{skill.iconLabel || skill.label.slice(0, 2)}</text>
    </>}
  </svg>;
}
