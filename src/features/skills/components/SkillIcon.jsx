import { siHtml5, siReact, siNextdotjs, siNodedotjs, siPhp, siLaravel, siTailwindcss, siGit, siPostman, siThreedotjs } from 'simple-icons';

const icons = {
  html: siHtml5, react: siReact,
  nextjs: siNextdotjs, nodejs: siNodedotjs, php: siPhp, laravel: siLaravel,
  tailwind: siTailwindcss, git: siGit, postman: siPostman, threejs: siThreedotjs,
};

export default function SkillIcon({ skill }) {
  // The reference uses the CSS3 shield from Simple Icons v13, before the CSS logo changed.
  if (skill.id === 'css') return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" /></svg>;
  if (skill.id === 'javascript') return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="1.5" fill="currentColor" /><text x="22" y="21" textAnchor="end" fill="#15202b" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">JS</text></svg>;
  const icon = icons[skill.id];
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={icon.path} /></svg>;
}
