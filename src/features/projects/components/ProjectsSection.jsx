import { getProjects } from '../lib/projects';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  return <section className="section projects-section fp-section" id="projects" aria-labelledby="projects-title">
    <div className="container fp-container">
      <div className="section-intro fp-section-heading"><div><p className="eyebrow fp-eyebrow">06 / Selected work</p><h2 className="fp-h2 fp-section-title" id="projects-title">Projects<span className="accent-dot">.</span></h2><p>Kumpulan konsep proyek untuk menunjukkan cara karya akan ditampilkan. Detail proyek nyata bisa ditambahkan lewat satu file JSON.</p></div></div>
      <div className="project-grid fp-projects">{getProjects().map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    </div>
  </section>;
}
