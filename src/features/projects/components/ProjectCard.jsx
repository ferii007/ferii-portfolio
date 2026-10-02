import { ArrowUpRight, Code2 } from 'lucide-react';
import Image from 'next/image';

export default function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <div className={`project-art project-art-${index % 3}`}>
        {project.image ? <Image src={project.image} alt={`Pratinjau ${project.title}`} fill sizes="(max-width: 800px) 100vw, 33vw" /> : <span aria-hidden="true">{String(index + 1).padStart(2, '0')} / WORK</span>}
      </div>
      <div className="project-body">
        <div className="project-heading"><h3>{project.title}</h3>{project.isExample && <span className="example-badge">Contoh</span>}</div>
        <p>{project.summary}</p>
        {project.contribution && <p className="project-contribution">{project.contribution}</p>}
        <ul className="tag-list" aria-label={`Teknologi ${project.title}`}>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        {(project.demoUrl || project.codeUrl) && <div className="project-links">
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Demo <ArrowUpRight size={16} /></a>}
          {project.codeUrl && <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">Kode <Code2 size={16} /></a>}
        </div>}
      </div>
    </article>
  );
}
