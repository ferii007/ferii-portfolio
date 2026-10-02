import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import HeroHolograms from '@/features/portfolio/components/HeroHolograms';
import RobotExperience from '@/features/robot/components/RobotExperience';

function HeroAccent({ className }) {
  return <svg className={className} viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M7 2 5 13M20 5l-7 10M31 20l-11 5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg>;
}

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="container hero-grid fp-container fp-hero">
        <div className="hero-text fp-hero__copy">
          <p className="eyebrow fp-eyebrow hero-eyebrow">— Hello, World! <HeroAccent className="hero-spark" /></p>
          <h1 className="fp-display" id="hero-title"><span>Feri</span><span>Ramdani</span></h1>
          <p className="hero-role"><span>{site.hero.role}</span><svg className="hero-role-underline" viewBox="0 0 170 20" fill="none" aria-hidden="true"><path d="M3 15C50 7 109 5 167 9M59 17c43-5 72-6 103-5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg><HeroAccent className="hero-role-spark" /></p>
          <p className="hero-copy">{site.hero.intro}</p>
          <div className="hero-actions fp-row">
            <a className="button button-primary fp-btn fp-btn--primary" href="#projects">Lihat proyek <ArrowRight size={18} /></a>
            <a className="button button-outline fp-btn fp-btn--secondary" href="#about">Kenal lebih dekat <ArrowUpRight size={18} /></a>
          </div>
          <HeroAccent className="hero-cta-spark" />
        </div>

        <div className="hero-visual fp-hero__stage" id="hero-robot-slot" aria-label="Robot pendamping Feri">
          <HeroHolograms />
          <p className="hero-handnote hero-handnote--code" aria-hidden="true">&lt;/&gt;<br />Ide<br />Kode<br />Website<br />Hidup<br />… ♡</p>
          <p className="hero-handnote hero-handnote--right" aria-hidden="true">Setiap<br />ide bisa<br />jadi website<br />yang nyata.</p>
          <HeroAccent className="hero-orange-mark hero-orange-mark--right" />
          <RobotExperience />
          <span className="hero-ground" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
