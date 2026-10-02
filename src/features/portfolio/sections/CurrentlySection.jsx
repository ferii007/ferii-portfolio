import { BookOpen, Lightbulb, Monitor } from 'lucide-react';
import { site } from '@/content/site';
const icons = [Monitor, BookOpen, Lightbulb];

export default function CurrentlySection() {
  return <section className="section currently-section" id="currently" aria-labelledby="currently-title"><div className="container currently-panel">
    <div className="currently-heading"><div><h2 id="currently-title">Currently<span className="accent-dot">.</span></h2><p>Hal-hal yang sedang jadi fokusku.</p></div><span className="example-badge">Contoh isi</span></div>
    <div className="currently-list">{site.currently.map((item, index) => { const Icon = icons[index]; return <div key={item.title}><Icon size={32} strokeWidth={1.6} /><h3>{item.title}</h3><p>{item.detail}</p></div>; })}</div>
  </div></section>;
}
