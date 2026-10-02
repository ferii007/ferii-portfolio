import { site } from '@/content/site';

export default function AboutSection() {
  return <section className="section about-section" id="about" aria-labelledby="about-title"><div className="container about-grid">
    <div><p className="eyebrow">— Sedikit cerita tentangku</p><h2 id="about-title">About Me<span className="accent-dot">.</span></h2><p className="lead-copy">{site.about.lead}</p><p>{site.about.detail}</p></div>
    <div className="about-art" aria-hidden="true"><div className="about-note">Belajar<br />lewat<br /><strong>membangun.</strong><span>〰</span></div><div className="about-books"><span>DESIGN</span><span>CODE</span><span>PROGRESS</span></div></div>
  </div></section>;
}
