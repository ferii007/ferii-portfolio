import Image from 'next/image';
import Eyebrow from '@/components/typography/Eyebrow';
import { getProjects } from '../lib/projects';
import categories from '../data/categories.json';
import ProjectCard from './ProjectCard';
import { getLocalization, localeKey } from '@/constants/localization';

export default function ProjectsSection({ language }) {
  const { text } = getLocalization(language);
  const projects = getProjects();
  return <section className="section projects-section" id="projects" aria-labelledby="projects-title">
    <div className="container">
      <div className="projects-intro">
        <div className="projects-intro-copy"><Eyebrow className="projects-eyebrow">{text.projects_eyebrow}</Eyebrow><h2 className="section-title" id="projects-title">{text.projects_title}</h2></div>
        <div className="projects-illustration" aria-hidden="true">
          <Image className="projects-assistant" src="/images/projects/studio-assistant.webp" width={1100} height={733} sizes="(max-width: 767px) 80vw, 420px" alt="" />
          <div className="projects-art-note"><svg viewBox="0 0 50 60" fill="none"><path d="M43 5C18 13 12 33 12 49m-8-12 8 15 15-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><p className="hand-note">{text.projects_handnote}</p></div>
        </div>
      </div>
      {categories.map((category) => {
        const pairs = category.layout === 'pairs';
        return <div className={`project-group project-group--${pairs ? 'pairs' : 'stack'}`} key={category.id}>
          <div className="project-group-heading">
            <div className="project-label"><h3 className="fp-paper" id={`projects-${category.id}`}><span className="fp-pin" aria-hidden="true" />{text[localeKey('category', category.id, 'title')]}</h3></div>
            <div className="project-group-note"><svg viewBox="0 0 65 36" fill="none" aria-hidden="true"><path d="M60 8C38-1 21 9 9 29m1-11-3 13 15-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p className="hand-note">{text[localeKey('category', category.id, 'note')]}</p></div>
          </div>
          <div className="project-list" role="group" aria-labelledby={`projects-${category.id}`}>{projects.filter((project) => project.category === category.id).map((project) => <ProjectCard key={project.id} project={project} pairs={pairs} text={text} />)}</div>
        </div>;
      })}
    </div>
  </section>;
}
