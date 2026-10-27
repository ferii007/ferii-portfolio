import Description from '@/components/typography/Description';
import Image from 'next/image';
import { interpolate, localeKey } from '@/constants/localization';
import Doodle from '@/components/doodles/Doodle';
import Tape from '@/components/paper/Tape';

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
        <Tape className="project-tape" />
        <div className={`project-art${project.imageFit === 'contain' ? ' project-art--contain' : ''}`}>
          {project.image ? <Image src={project.image} alt={imageAlt} fill sizes={pairs ? '(max-width: 767px) 100vw, (max-width: 1023px) 52vw, 340px' : mediaSizes[presentation]} /> : <div className="project-cover"><span>{project.title}</span></div>}
        </div>
      </figure>
      <div className="project-note fp-paper">
        <span className="fp-pin project-pin" aria-hidden="true" />
        <div className="project-heading">
          <h4>{project.title}<Doodle name="sparkCard" /></h4>
          {project.isExample && <span className="example-badge fp-badge fp-badge--warm">{text.project_example_badge}</span>}
        </div>
        {presentation === 'feature' && <Doodle name="underlineSingle" className="project-underline" />}
        <Description>{text[localeKey('project', project.id, 'contribution')]}</Description>
        {project.stack.length > 0 && <ul className="project-tags" aria-label={interpolate(text.project_stack_label, { title: project.title })}><li>{project.stack.join(' · ')}</li></ul>}
      </div>
    </article>
  );
}
