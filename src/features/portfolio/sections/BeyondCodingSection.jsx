import { BookText, Compass } from 'lucide-react';
import { site } from '@/content/site';
const icons = [BookText, Compass];

export default function BeyondCodingSection() {
  return <section className="section beyond-section" id="beyond" aria-labelledby="beyond-title"><div className="container">
    <div className="section-intro"><p className="eyebrow">07 / Beyond the screen</p><h2 id="beyond-title">Beyond Coding<span className="accent-dot">.</span></h2><p>Ada cerita di luar layar. <span className="example-badge">Contoh isi</span></p></div>
    <div className="beyond-grid">{site.beyond.map((item, index) => { const Icon = icons[index]; return <article className="beyond-card" key={item.title}><div className={`beyond-art beyond-art-${index}`}><Icon size={58} strokeWidth={1.25} /></div><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>; })}</div>
  </div></section>;
}
