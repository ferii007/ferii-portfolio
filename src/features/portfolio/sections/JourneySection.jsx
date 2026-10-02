import { Code2, FileCode2, Users } from 'lucide-react';
import { site } from '@/content/site';
const icons = [FileCode2, Code2, Users];

export default function JourneySection() {
  return <section className="section journey-section" id="journey" aria-labelledby="journey-title"><div className="container">
    <div className="section-intro"><p className="eyebrow">05 / The path so far</p><h2 id="journey-title">My Journey<span className="accent-dot">.</span></h2><p>Setiap langkah punya cerita. <span className="example-badge">Contoh isi</span></p></div>
    <ol className="journey-grid">{site.journey.map((item, index) => { const Icon = icons[index]; return <li key={item.title}><span className="journey-number">{index + 1}</span><div className="journey-card"><Icon size={28} /><h3>{item.title}</h3><p>{item.detail}</p></div></li>; })}</ol>
  </div></section>;
}
