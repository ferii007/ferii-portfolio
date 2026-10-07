import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Description from '@/components/typography/Description';
import Eyebrow from '@/components/typography/Eyebrow';
import { site } from '@/content/site';

export default function BeyondCodingSection() {
  return <section className="section beyond-section" id="beyond" aria-labelledby="beyond-title"><div className="container">
    <div className="beyond-heading"><div><Eyebrow>Ada cerita diluar layar.</Eyebrow><h2 id="beyond-title">Beyond Coding<svg viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></h2></div><div className="beyond-handnote" aria-hidden="true"><svg viewBox="0 0 65 36" fill="none"><path d="M60 8C38-1 21 9 9 29m1-11-3 13 15-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p>Pilihan konten personal.</p></div></div>
    <div className="beyond-grid">{site.beyond.map((item) => <article className="beyond-card" key={item.title}><div className="beyond-art"><Image src={item.image} width={480} height={480} alt="" sizes="(max-width: 480px) 100px, 180px" /></div><div className="beyond-content"><h3>{item.title}</h3><Description>{item.detail}</Description><span className="beyond-card-accent" aria-hidden="true"><ArrowRight size={18} /></span></div></article>)}</div>
  </div></section>;
}
