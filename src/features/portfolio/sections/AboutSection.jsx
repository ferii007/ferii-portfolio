import { site } from '@/content/site';
import AboutIllustration from '@/features/portfolio/components/AboutIllustration';

export default function AboutSection() {
  return (
    <section className="section about-section fp-section" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-copy">
          <p className="about-eyebrow">Sedikit cerita tentangku</p>
          <h2 id="about-title">About Me<svg className="about-title-spark" viewBox="0 0 34 42" fill="none" aria-hidden="true"><path d="m10 12 9-9M13 23l16-3M12 33l11 5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></h2>
          <p className="about-lead">{site.about.lead}</p>
          <p>{site.about.detail}</p>
          <svg className="about-arrow" viewBox="0 0 82 62" fill="none" aria-hidden="true"><path d="M7 37c10 16 36 20 41 8 5-13-13-14-12-4 2 15 33 8 31-30M58 18l9-9 7 11" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <AboutIllustration />
      </div>
    </section>
  );
}
