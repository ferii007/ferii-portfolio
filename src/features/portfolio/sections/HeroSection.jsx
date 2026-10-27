import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import HeroHolograms from '@/features/portfolio/components/HeroHolograms';
import RobotExperience from '@/features/robot/components/RobotExperience';

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="container hero-grid fp-container fp-hero">
        <div className="hero-text fp-hero__copy">
          <Eyebrow className="hero-eyebrow">Hello, World!</Eyebrow>
          <h1 className="fp-display" id="hero-title"><span>Feri</span>{' '}<span>Ramdani</span></h1>
          <p className="hero-role"><span>{site.hero.role}</span><svg className="hero-role-underline" viewBox="0 0 170 20" fill="none" aria-hidden="true"><path d="M3 15C50 7 109 5 167 9M59 17c43-5 72-6 103-5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg></p>
          <Description className="hero-copy">{site.hero.intro}</Description>
          <div className="hero-actions fp-row">
            <a className="button button-primary fp-btn fp-btn--primary" href="#projects">Lihat proyek <ArrowRight size={18} /></a>
            <a className="button button-outline fp-btn fp-btn--secondary" href="#about">Kenal lebih dekat <ArrowUpRight size={18} /></a>
          </div>
        </div>

        <div className="hero-visual fp-hero__stage" id="hero-robot-slot" aria-label="Robot pendamping Feri">
          <HeroHolograms />
          <p className="hero-handnote hero-handnote--right" aria-hidden="true">Setiap<br />ide bisa<br />jadi website<br />yang nyata.</p>
          <svg className="hero-handnote-arrow" viewBox="0 0 44 70" fill="none" aria-hidden="true"><path d="M40 6C24 14 12 30 10 60m-8-12 8 14 10-12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <RobotExperience />
        </div>
      </div>
    </section>
  );
}
