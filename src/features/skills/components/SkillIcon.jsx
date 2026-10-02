import { siHtml5, siCss, siJavascript, siReact, siNextdotjs, siNodedotjs, siPhp, siLaravel, siTailwindcss, siGit, siPostman, siThreedotjs } from 'simple-icons';

const icons = {
  html: siHtml5, css: siCss, javascript: siJavascript, react: siReact,
  nextjs: siNextdotjs, nodejs: siNodedotjs, php: siPhp, laravel: siLaravel,
  tailwind: siTailwindcss, git: siGit, postman: siPostman, threejs: siThreedotjs,
};

export default function SkillIcon({ skill }) {
  const icon = icons[skill.id];
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={icon.path} /></svg>;
}
