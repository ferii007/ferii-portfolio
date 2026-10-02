import { getProjects } from '../lib/projects';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  return <section className="section projects-section" id="projects" aria-labelledby="projects-title">
    <div className="container">
      <div className="section-intro"><p className="eyebrow">06 / Selected work</p><h2 id="projects-title">Projects<span className="accent-dot">.</span></h2><p>Kumpulan konsep proyek untuk menunjukkan cara karya akan ditampilkan. Detail proyek nyata bisa ditambahkan lewat satu file JSON.</p></div>
      <div className="project-grid">{getProjects().map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
    </div>
  </section>;
}
