import Description from '@/components/typography/Description';
import Image from 'next/image';
import { interpolate, localeKey } from '@/constants/localization';

const mediaSizes = {
  feature: '(max-width: 767px) 100vw, (max-width: 1023px) 55vw, 700px',
  compact: '(max-width: 767px) 100vw, (max-width: 1023px) 52vw, 620px',
};

export default function ProjectCard({ project, pairs = false, text }) {
  const imageAlt = text[localeKey('project', project.id, 'image_alt')] ?? interpolate(text.project_image_alt, { title: project.title });
  const presentation = project.presentation === 'feature' ? 'feature' : 'compact';
  return (
    <article className={`project project--${presentation}`}>
      <figure className="project-media fp-print">
        <span className="fp-tape project-tape" aria-hidden="true" />
        <div className={`project-art${project.imageFit === 'contain' ? ' project-art--contain' : ''}`}>
          {project.image ? <Image src={project.image} alt={imageAlt} fill sizes={pairs ? '(max-width: 767px) 100vw, (max-width: 1023px) 52vw, 340px' : mediaSizes[presentation]} /> : <div className="project-cover"><span>{project.title}</span></div>}
        </div>
      </figure>
      <div className="project-note fp-paper">
        <span className="fp-pin project-pin" aria-hidden="true" />
        <div className="project-heading">
          <h4>{project.title}<svg viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></h4>
          {project.isExample && <span className="example-badge fp-badge fp-badge--warm">{text.project_example_badge}</span>}
        </div>
        {presentation === 'feature' && <svg className="project-underline" viewBox="0 0 170 14" fill="none" aria-hidden="true"><path d="M3 10C52 4 108 3 167 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>}
        <Description>{text[localeKey('project', project.id, 'contribution')]}</Description>
        {project.stack.length > 0 && <ul className="project-tags" aria-label={interpolate(text.project_stack_label, { title: project.title })}><li>{project.stack.join(' · ')}</li></ul>}
      </div>
    </article>
  );
}
