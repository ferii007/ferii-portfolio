import { BookOpen, Lightbulb, Monitor } from 'lucide-react';
import { site } from '@/content/site';
const icons = [Monitor, BookOpen, Lightbulb];

export default function CurrentlySection() {
  return <section className="section currently-section fp-section" id="currently" aria-labelledby="currently-title"><div className="container currently-panel fp-container fp-panel fp-panel--warm fp-currently">
    <div className="currently-heading"><div><p className="eyebrow fp-eyebrow">03 / Right now</p><h2 className="fp-h2" id="currently-title">Currently<span className="accent-dot">.</span></h2><p>Hal-hal yang sedang jadi fokusku.</p></div><span className="example-badge fp-badge fp-badge--warm">Contoh isi</span></div>
    <div className="currently-list fp-currently__items">{site.currently.map((item, index) => { const Icon = icons[index]; return <div className="fp-currently__item" key={item.title}><span className="currently-icon"><Icon size={26} strokeWidth={1.8} /></span><h3>{item.title}</h3><p>{item.detail}</p></div>; })}</div>
  </div></section>;
}
