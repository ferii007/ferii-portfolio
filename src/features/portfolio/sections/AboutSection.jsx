import { getLocalization } from '@/constants/localization';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import AboutIllustration from '@/features/portfolio/components/AboutIllustration';
import { Section, SectionTitle } from '@/components/layout/Section';
import Doodle from '@/components/doodles/Doodle';

export default function AboutSection({ language }) {
  const { text } = getLocalization(language);
  return (
    <Section name="about" className="about-section">
      <div className="container about-grid">
        <div className="about-head">
          <Eyebrow className="about-eyebrow">{text.about_eyebrow}</Eyebrow>
          <SectionTitle name="about" className="about-title" />
        </div>
        <AboutIllustration text={text} />
        <div className="about-story fp-paper">
          <span className="fp-tape about-tape" aria-hidden="true" />
          <p className="about-story-headline">{text.about_headline_start}<br /><span>{text.about_headline_end}</span><Doodle name="sparkAccent" /></p>
          <Doodle name="underlineStory" className="about-story-underline" />
          <Description>{text.about_lead}</Description>
          <Description>{text.about_detail}</Description>
          <svg className="about-smile" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" /><path d="M14 16v2M26 16v2M12 24c5 6 11 6 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
      </div>
    </Section>
  );
}
