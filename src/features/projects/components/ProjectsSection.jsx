import Description from '@/components/typography/Description';
import Image from 'next/image';
import { getProjects } from '../lib/projects';
import categories from '../data/categories.json';
import ProjectCard from './ProjectCard';

function Spark({ className = '' }) {
  return <svg className={`projects-spark ${className}`} viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
}

export default function ProjectsSection() {
  const projects = getProjects();
  return <section className="section projects-section" id="projects" aria-labelledby="projects-title">
    <div className="container">
      <div className="projects-intro">
        <div className="projects-intro-copy"><span className="projects-title-mark" aria-hidden="true" /><h2 id="projects-title">Some things I’ve worked on<Spark /></h2><Description>Produk, website, dan eksperimen yang pernah kubangun.</Description></div>
        <div className="projects-illustration"><Image src="/images/projects/gallery-illustration-v3.webp" width={720} height={480} alt="" sizes="(max-width: 767px) calc(100vw - 105px), (max-width: 1023px) 40vw, 520px" /><div className="projects-art-note" aria-hidden="true"><p>Berbagai ide,<br />solusi, dan eksperimen<br />dalam satu tempat.</p><svg viewBox="0 0 50 60" fill="none"><path d="M43 5C18 13 12 33 12 49m-8-12 8 15 15-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><Spark /></div></div>
      </div>
      {categories.map((category) => <div className={`project-group project-group--${category.id}`} key={category.id}>
        <div className="project-group-heading"><h3 id={`projects-${category.id}`}><span aria-hidden="true" />{category.title}<Spark /></h3><div className="project-group-note"><svg viewBox="0 0 65 36" fill="none" aria-hidden="true"><path d="M60 8C38-1 21 9 9 29m1-11-3 13 15-4M52 3l9 5-10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><Description>{category.note}</Description></div></div>
        <div className="project-grid" aria-labelledby={`projects-${category.id}`}>{projects.filter((project) => project.category === category.id).map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      </div>)}
    </div>
  </section>;
}
