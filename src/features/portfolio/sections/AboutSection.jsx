import { site } from '@/content/site';

export default function AboutSection() {
  return <section className="section about-section fp-section" id="about" aria-labelledby="about-title"><div className="container about-grid fp-container fp-about">
    <div className="about-copy"><p className="eyebrow fp-eyebrow">02 / Sedikit cerita tentangku</p><h2 className="fp-h2 fp-section-title" id="about-title">About Me<span className="accent-dot">.</span></h2><p className="lead-copy fp-lead">{site.about.lead}</p><p>{site.about.detail}</p><p className="fp-note about-scribble">Curious by default ✳</p></div>
    <div className="about-art" aria-hidden="true"><div className="about-paper"/><div className="about-note fp-sticky-note">Belajar<br />lewat<br /><strong>membangun.</strong><span>〰</span></div><div className="about-books"><span>DESIGN</span><span>CODE</span><span>PROGRESS</span></div></div>
  </div></section>;
}
