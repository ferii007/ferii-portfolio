import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import RobotExperience from '@/features/robot/components/RobotExperience';

export default function HeroSection() {
  return <section className="hero-section" id="hero" aria-labelledby="hero-title">
    <div className="container hero-grid fp-container fp-hero">
      <div className="hero-text fp-hero__copy">
        <p className="eyebrow fp-eyebrow">— Hello, World!</p>
        <h1 className="fp-display" id="hero-title"><span>Feri</span><span>Ramdani<span className="accent-dot">.</span></span></h1>
        <p className="hero-role">{site.hero.role}</p>
        <p className="hero-copy">{site.hero.intro}</p>
        <div className="hero-actions fp-row"><a className="button button-primary fp-btn fp-btn--primary" href="#projects">Lihat proyek <ArrowDownRight size={18} /></a><a className="button button-outline fp-btn fp-btn--secondary" href="#about">Kenal lebih dekat <ArrowUpRight size={18} /></a></div>
      </div>
      <div className="hero-visual fp-hero__stage" id="hero-robot-slot" aria-label="Robot pendamping Feri"><div className="hero-orbit hero-orbit-one" aria-hidden="true" /><div className="hero-orbit hero-orbit-two" aria-hidden="true" /><div className="hero-window hero-window-top" aria-hidden="true"><span/><span/><span/><i/><i/></div><RobotExperience /><div className="hero-window hero-window-bottom" aria-hidden="true"><span/><span/><i/><i/><i/></div><p className="hero-scribble fp-note">always building <span>↗</span></p></div>
    </div>
  </section>;
}
