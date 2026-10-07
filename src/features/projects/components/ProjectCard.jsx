import Description from '@/components/typography/Description';
import Image from 'next/image';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className={`project-art${project.imageFit === 'contain' ? ' project-art--contain' : ''}`}>
        {project.image ? <Image src={project.image} alt={project.imageAlt || `Pratinjau ${project.title}`} fill sizes="(max-width: 767px) 100vw, 50vw" /> : <div className="project-cover"><span>{project.title}</span></div>}
      </div>
      <div className="project-body">
        <div className="project-heading"><h4>{project.title}</h4>{project.isExample && <span className="example-badge fp-badge fp-badge--warm">Contoh</span>}</div>
        <Description>{project.contribution}</Description>
        {project.stack.length > 0 && <ul className="project-tags" aria-label={`Teknologi ${project.title}`}><li>{project.stack.join(' · ')}</li></ul>}
      </div>
    </article>
  );
}
