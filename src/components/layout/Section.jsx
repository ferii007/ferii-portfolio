import Doodle from '@/components/doodles/Doodle';
import { SECTIONS } from '@/constants/site';

const titleId = (name) => `${SECTIONS[name].id}-title`;

// A page section: its anchor id and accessible name come from SECTIONS, so they're defined once.
export function Section({ name, className = '', children }) {
  return <section className={`section ${className}`.trim()} id={SECTIONS[name].id} aria-labelledby={titleId(name)}>{children}</section>;
}

// The section's heading, with its title (and hand-drawn spark, if it has one) from SECTIONS.
export function SectionTitle({ name, className = '' }) {
  const { title, spark } = SECTIONS[name];
  return <h2 className={`section-title ${className}`.trim()} id={titleId(name)}>{title}{spark && <Doodle name={spark} />}</h2>;
}
