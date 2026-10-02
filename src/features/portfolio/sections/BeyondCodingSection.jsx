import { BookText, Compass } from 'lucide-react';
import { site } from '@/content/site';
const icons = [BookText, Compass];

export default function BeyondCodingSection() {
  return <section className="section beyond-section fp-section" id="beyond" aria-labelledby="beyond-title"><div className="container fp-container">
    <div className="section-intro fp-section-heading"><div><p className="eyebrow fp-eyebrow">07 / Beyond the screen</p><h2 className="fp-h2 fp-section-title" id="beyond-title">Beyond Coding<span className="accent-dot">.</span></h2><p>Ada cerita di luar layar. <span className="example-badge fp-badge fp-badge--warm">Contoh isi</span></p></div></div>
    <div className="beyond-grid fp-beyond">{site.beyond.map((item, index) => { const Icon = icons[index]; return <article className="beyond-card fp-card fp-interest" key={item.title}><div className={`beyond-art beyond-art-${index} fp-interest__media`}><Icon size={58} strokeWidth={1.25} /></div><div><h3 className="fp-h3">{item.title}</h3><p>{item.detail}</p></div></article>; })}</div>
  </div></section>;
}
