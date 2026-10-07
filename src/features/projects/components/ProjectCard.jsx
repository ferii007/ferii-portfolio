import Description from '@/components/typography/Description';
import { ArrowUpRight, Code2 } from 'lucide-react';
import Image from 'next/image';

export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card fp-card fp-project">
      <div className={`project-art project-art-${index % 3} fp-project__media`}>
        {project.image ? <Image src={project.image} alt={`Pratinjau ${project.title}`} fill sizes="(max-width: 800px) 100vw, 33vw" /> : <div className="project-preview" aria-hidden="true"><div className="preview-chrome"><span/><span/><span/><i/></div><div className="preview-inner"><div className="preview-sidebar"><b/><b/><b/><b/></div><div className="preview-content"><span className="preview-kicker"/><span className="preview-title"/><span className="preview-line"/><div className="preview-tiles"><b/><b/><b/></div></div></div></div>}
      </div>
      <div className="project-body fp-project__body">
        <div className="project-heading"><h3 className="fp-h3">{project.title}</h3>{project.isExample && <span className="example-badge fp-badge fp-badge--warm">Contoh</span>}</div>
        <Description>{project.summary}</Description>
        {project.contribution && <Description>{project.contribution}</Description>}
        <ul className="tag-list" aria-label={`Teknologi ${project.title}`}>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        {(project.demoUrl || project.codeUrl) && <div className="project-links fp-project__actions">
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo <ArrowUpRight size={16} /></a>}
          {project.codeUrl && <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">Kode <Code2 size={16} /></a>}
        </div>}
      </div>
    </article>
  );
}
