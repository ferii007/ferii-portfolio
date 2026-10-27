import Image from 'next/image';
import Eyebrow from '@/components/typography/Eyebrow';
import { getProjects } from '../lib/projects';
import categories from '../data/categories.json';
import ProjectCard from './ProjectCard';
import { getLocalization, localeKey } from '@/constants/localization';
import { Section, SectionTitle } from '@/components/layout/Section';
import Doodle from '@/components/doodles/Doodle';

export default function ProjectsSection({ language }) {
  const { text } = getLocalization(language);
  const projects = getProjects();
  return <Section name="projects" className="projects-section">
    <div className="container">
      <div className="projects-intro">
        <div className="projects-intro-copy"><Eyebrow className="projects-eyebrow">{text.projects_eyebrow}</Eyebrow><SectionTitle name="projects" /></div>
        <div className="projects-illustration" aria-hidden="true">
          <Image className="projects-assistant" src="/images/projects/studio-assistant.webp" width={1100} height={733} sizes="(max-width: 767px) 80vw, 420px" alt="" />
          <div className="projects-art-note"><Doodle name="arrowDive" /><p className="hand-note">{text.projects_handnote}</p></div>
        </div>
      </div>
      {categories.map((category) => {
        const pairs = category.layout === 'pairs';
        return <div className={`project-group project-group--${pairs ? 'pairs' : 'stack'}`} key={category.id}>
          <div className="project-group-heading">
            <div className="project-label"><h3 className="fp-paper" id={`projects-${category.id}`}><span className="fp-pin" aria-hidden="true" />{text[localeKey('category', category.id, 'title')]}</h3></div>
            <div className="project-group-note"><Doodle name="arrowBack" /><p className="hand-note">{text[localeKey('category', category.id, 'note')]}</p></div>
          </div>
          <div className="project-list" role="group" aria-labelledby={`projects-${category.id}`}>{projects.filter((project) => project.category === category.id).map((project) => <ProjectCard key={project.id} project={project} pairs={pairs} text={text} />)}</div>
        </div>;
      })}
    </div>
  </Section>;
}
