import { getLocalization } from '@/constants/localization';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import AboutIllustration from '@/features/portfolio/components/AboutIllustration';

export default function AboutSection({ language }) {
  const { text } = getLocalization(language);
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-head">
          <Eyebrow className="about-eyebrow">{text.about_eyebrow}</Eyebrow>
          <h2 className="section-title about-title" id="about-title">{text.about_title}<svg viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2>
        </div>
        <AboutIllustration text={text} />
        <div className="about-story fp-paper">
          <span className="fp-tape about-tape" aria-hidden="true" />
          <p className="about-story-headline">{text.about_headline_start}<br /><span>{text.about_headline_end}</span><svg viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M7 2 5 13M20 5l-7 10M31 20l-11 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></p>
          <svg className="about-story-underline" viewBox="0 0 170 20" fill="none" aria-hidden="true"><path d="M3 13C50 6 109 4 167 8M40 17c43-5 72-6 103-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
          <Description>{text.about_lead}</Description>
          <Description>{text.about_detail}</Description>
          <svg className="about-smile" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="2" /><path d="M14 16v2M26 16v2M12 24c5 6 11 6 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
      </div>
    </section>
  );
}
