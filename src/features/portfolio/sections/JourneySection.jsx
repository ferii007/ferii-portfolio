import Description from '@/components/typography/Description';
import { Code2, FileCode2, Users } from 'lucide-react';
import { site } from '@/content/site';
const icons = [FileCode2, Code2, Users];

export default function JourneySection() {
  return <section className="section journey-section fp-section" id="journey" aria-labelledby="journey-title"><div className="container fp-container">
    <div className="section-intro fp-section-heading"><div><p className="eyebrow fp-eyebrow">05 / The path so far</p><h2 className="fp-h2 fp-section-title" id="journey-title">My Journey<span className="accent-dot">.</span></h2><Description>Setiap langkah punya cerita. <span className="example-badge fp-badge fp-badge--warm">Contoh isi</span></Description></div></div>
    <ol className="journey-grid fp-journey">{site.journey.map((item, index) => { const Icon = icons[index]; return <li key={item.title}><div className="journey-card fp-card"><Icon size={28} /><h3 className="fp-h3">{item.title}</h3><Description>{item.detail}</Description></div></li>; })}</ol>
  </div></section>;
}
