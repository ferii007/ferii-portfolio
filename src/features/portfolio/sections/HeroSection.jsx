import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getLocalization } from '@/constants/localization';
import Lines from '@/components/typography/Lines';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import HeroHolograms from '@/features/portfolio/components/HeroHolograms';
import RobotExperience from '@/features/robot/components/RobotExperience';

export default function HeroSection({ language }) {
  const { text } = getLocalization(language);
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="container hero-grid fp-container fp-hero">
        <div className="hero-text fp-hero__copy">
          <Eyebrow className="hero-eyebrow">{text.hero_eyebrow}</Eyebrow>
          <h1 className="fp-display" id="hero-title"><span>Feri</span>{' '}<span>Ramdani</span></h1>
          <p className="hero-role"><span>{text.hero_role}</span><svg className="hero-role-underline" viewBox="0 0 170 20" fill="none" aria-hidden="true"><path d="M3 15C50 7 109 5 167 9M59 17c43-5 72-6 103-5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" /></svg></p>
          <Description className="hero-copy">{text.hero_intro}</Description>
          <div className="hero-actions fp-row">
            <a className="button button-primary fp-btn fp-btn--primary" href="#projects">{text.hero_cta_projects} <ArrowRight size={18} /></a>
            <a className="button button-outline fp-btn fp-btn--secondary" href="#about">{text.hero_cta_about} <ArrowUpRight size={18} /></a>
          </div>
        </div>

        <div className="hero-visual fp-hero__stage" id="hero-robot-slot" aria-label={text.hero_robot_label}>
          <HeroHolograms />
          <p className="hero-handnote hero-handnote--right" aria-hidden="true"><Lines text={text.hero_handnote} /></p>
          <svg className="hero-handnote-arrow" viewBox="0 0 44 70" fill="none" aria-hidden="true"><path d="M40 6C24 14 12 30 10 60m-8-12 8 14 10-12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <RobotExperience />
        </div>
      </div>
    </section>
  );
}
