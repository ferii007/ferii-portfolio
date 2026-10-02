import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { site } from '@/content/site';

export default function HeroSection() {
  return <section className="hero-section" id="hero" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <div className="hero-text">
        <p className="eyebrow">— Hello, World!</p>
        <h1 id="hero-title"><span>Feri</span><span>Ramdani<span className="accent-dot">.</span></span></h1>
        <p className="hero-role">{site.hero.role}</p>
        <p className="hero-copy">{site.hero.intro}</p>
        <div className="hero-actions"><a className="button button-primary" href="#projects">Lihat proyek <ArrowDownRight size={18} /></a><a className="button button-outline" href="#about">Kenal lebih dekat <ArrowUpRight size={18} /></a></div>
      </div>
      <div className="hero-visual" id="hero-robot-slot" aria-label="Robot pendamping Feri" />
    </div>
  </section>;
}
