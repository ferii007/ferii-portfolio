import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getLocalization } from '@/constants/localization';
import { anchor, LABELS, PERSON, SECTIONS } from '@/constants/site';
import Lines from '@/components/typography/Lines';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import HeroHolograms from '@/features/portfolio/components/HeroHolograms';
import RobotExperience from '@/features/robot/components/RobotExperience';
import Doodle from '@/components/doodles/Doodle';

export default function HeroSection({ language }) {
  const { text } = getLocalization(language);
  return (
    <section className="hero-section" id={SECTIONS.hero.id} aria-labelledby="hero-title">
      <div className="container hero-grid fp-container fp-hero">
        <div className="hero-text fp-hero__copy">
          <Eyebrow className="hero-eyebrow">{LABELS.heroGreeting}</Eyebrow>
          <h1 className="fp-display" id="hero-title"><span>{PERSON.firstName}</span>{' '}<span>{PERSON.lastName}</span></h1>
          <p className="hero-role"><span>{PERSON.role}</span><Doodle name="underlineDouble" className="hero-role-underline" /></p>
          <Description className="hero-copy">{text.hero_intro}</Description>
          <div className="hero-actions fp-row">
            <a className="button button-primary fp-btn fp-btn--primary" href={anchor('projects')}>{text.hero_cta_projects} <ArrowRight size={18} /></a>
            <a className="button button-outline fp-btn fp-btn--secondary" href={anchor('about')}>{text.hero_cta_about} <ArrowUpRight size={18} /></a>
          </div>
        </div>

        <div className="hero-visual fp-hero__stage" id="hero-robot-slot" role="group" aria-label={text.hero_robot_label}>
          <HeroHolograms />
          <p className="hero-handnote hero-handnote--right" aria-hidden="true"><Lines text={text.hero_handnote} /></p>
          <Doodle name="arrowDrop" className="hero-handnote-arrow" />
          <RobotExperience />
        </div>
      </div>
    </section>
  );
}
