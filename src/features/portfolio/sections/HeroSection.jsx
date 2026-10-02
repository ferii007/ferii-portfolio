import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import RobotExperience from '@/features/robot/components/RobotExperience';

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="container hero-grid fp-container fp-hero">
        <div className="hero-text fp-hero__copy">
          <p className="eyebrow fp-eyebrow hero-eyebrow">— Hello, World! <span className="hero-spark" aria-hidden="true" /></p>
          <h1 className="fp-display" id="hero-title"><span>Feri</span><span>Ramdani</span></h1>
          <p className="hero-role"><span>{site.hero.role}</span><span className="hero-role-spark" aria-hidden="true">✳</span></p>
          <p className="hero-copy">{site.hero.intro}</p>
          <div className="hero-actions fp-row">
            <a className="button button-primary fp-btn fp-btn--primary" href="#projects">Lihat proyek <ArrowRight size={18} /></a>
            <a className="button button-outline fp-btn fp-btn--secondary" href="#about">Kenal lebih dekat <ArrowUpRight size={18} /></a>
          </div>
          <span className="hero-cta-spark" aria-hidden="true" />
        </div>

        <div className="hero-visual fp-hero__stage" id="hero-robot-slot" aria-label="Robot pendamping Feri">
          <div className="hero-browser hero-browser--back" aria-hidden="true"><div className="hero-browser__bar"><i /><i /><i /></div><span /><span /><span /></div>
          <div className="hero-browser hero-browser--mini" aria-hidden="true"><div className="hero-browser__bar"><i /><i /><i /></div><span /><span /></div>
          <div className="hero-browser hero-browser--right" aria-hidden="true"><div className="hero-browser__bar"><i /><i /><i /></div><span /><span /><span /></div>
          <div className="hero-browser hero-browser--bottom" aria-hidden="true"><div className="hero-browser__bar"><i /><i /><i /></div><span /><span /><span /><span /></div>
          <p className="hero-handnote hero-handnote--code" aria-hidden="true">&lt;/&gt;<br />Ide<br />Kode<br />Website<br />Hidup<br />… ♡</p>
          <p className="hero-handnote hero-handnote--right" aria-hidden="true">Setiap<br />ide bisa<br />jadi website<br />yang nyata.</p>
          <span className="hero-orange-mark hero-orange-mark--right" aria-hidden="true" />
          <RobotExperience />
          <span className="hero-ground" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
