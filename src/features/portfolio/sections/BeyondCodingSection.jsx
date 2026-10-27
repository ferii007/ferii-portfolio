'use client';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Description from '@/components/typography/Description';
import { usePortfolioInteraction } from '@/features/interaction/InteractionProvider';
import { site } from '@/content/site';

// Shelf scene (books, open journal, hologram) with its labels set in the artwork's own 1500×750 pixels.
function BeyondStudio() {
  return <div className="beyond-studio" aria-hidden="true">
    <Image src="/images/beyond/journal-studio.webp" width={1500} height={750} sizes="(max-width: 767px) 92vw, 1030px" alt="" />
    <svg className="beyond-studio-labels" viewBox="0 0 1500 750" fill="none">
      {/* Gold foil between each spine's own diamonds; each line follows its book's slight slant. */}
      <g className="beyond-foil">
        <text transform="translate(457 423) rotate(-5)" fontSize="31">IDE</text>
        <text transform="translate(440 493) rotate(-2.3)" fontSize="30">JURNAL</text>
        <text transform="translate(440 569) rotate(-1.6)" fontSize="30">TUMBUH</text>
      </g>
      {/* Handwritten on the journal's left page, where the sketched lines were painted out. */}
      <g className="beyond-page-ink">
        <text x="750" y="340" fontSize="36">Catatan</text>
        <text x="754" y="376" fontSize="36">Perjalanan</text>
        <text x="758" y="412" fontSize="36">Ide</text>
      </g>
    </svg>
    {/* The book hologram is projected from an emitter on the top book, like the Hero and My Skills holograms:
        a light cone up to the panel, edge rays and motes rising through the beam. */}
    <svg className="holo-cast" viewBox="0 0 1500 750" fill="none" style={{ '--cast-origin': '548px 396px' }}>
      <defs>
        <linearGradient id="beyond-holo-beam" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#e6fcff" /><stop offset=".45" stopColor="#8ceaff" stopOpacity=".9" /><stop offset="1" stopColor="#58dfff" stopOpacity=".4" /></linearGradient>
        {/* Occlusion mask made from the artwork's pixels: the light shows only where no book, journal or prop is in front. */}
        <mask id="beyond-holo-behind" maskUnits="userSpaceOnUse" x="0" y="0" width="1500" height="750"><image href="/images/beyond/journal-holo-mask.png" width="1500" height="750" /></mask>
        {/* Left edge fades out along the panel's border, with a slightly uneven falloff, instead of a hard cut. */}
        <linearGradient id="beyond-holo-edge-fade" gradientUnits="userSpaceOnUse" x1="482" y1="0" x2="530" y2="0" gradientTransform="rotate(-2.5 495 230)"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".45" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" /></linearGradient>
        <filter id="beyond-holo-edge-noise" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="14" xChannelSelector="R" yChannelSelector="G" /></filter>
        <mask id="beyond-holo-edge" maskUnits="userSpaceOnUse" x="0" y="0" width="1500" height="750"><rect x="440" y="30" width="480" height="400" fill="url(#beyond-holo-edge-fade)" filter="url(#beyond-holo-edge-noise)" /></mask>
        <clipPath id="beyond-holo-panel"><path d="M487 81 823 147 837 297 497 310Z" /></clipPath>
      </defs>
      {/* Source is hidden behind the book stack, under the panel; the occlusion mask hides it wherever the books
          or the journal are in front, so only the light rising from behind the stack shows. */}
      <g mask="url(#beyond-holo-edge)"><g mask="url(#beyond-holo-behind)">
        <ellipse className="holo-cast-source" cx="548" cy="394" rx="62" ry="14" />
        <path className="holo-cast-beam" d="M508 396 478 300 650 296 590 396Z" fill="url(#beyond-holo-beam)" />
        <path className="holo-cast-beam holo-cast-beam--core" d="M530 396 516 304 600 302 566 396Z" fill="url(#beyond-holo-beam)" />
        <path className="holo-cast-ray" d="M522 390 497 310M574 388 837 297M530 390 487 81M566 388 823 147" pathLength="100" />
        {[[530, 0], [546, 1.1], [562, 2.2], [538, 3]].map(([x, d]) => <circle key={x} className="holo-cast-mote" cx={x} cy="392" r="2.6" style={{ animationDelay: `${d}s` }} />)}
      </g></g>
      <rect className="holo-cast-tint" x="480" y="75" width="365" height="240" clipPath="url(#beyond-holo-panel)" />
    </svg>
    <div className="beyond-handnote"><svg viewBox="0 0 68 54" fill="none"><path d="M61 9C36 8 16 21 12 43M7 33l5 12 12-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><p className="hand-note">Pilihan konten<br />personal.</p></div>
  </div>;
}

export default function BeyondCodingSection() {
  const { showRobotMessage } = usePortfolioInteraction();
  return <section className="section beyond-section" id="beyond" aria-labelledby="beyond-title"><div className="container beyond-stage">
    <div className="beyond-heading"><div className="beyond-copy"><h2 className="section-title" id="beyond-title">Beyond Coding</h2></div>
      <BeyondStudio />
    </div>
    <div className="beyond-grid">{site.beyond.map((item) => <article className="beyond-card" key={item.title}><div className="beyond-art"><Image src={item.image} width={480} height={480} alt="" sizes="(max-width: 480px) 120px, 320px" /></div><div className="beyond-content"><h3>{item.title}<svg viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m8 14 7-11M17 23l14-6M18 32l12 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></h3><Description>{item.detail}</Description><button className="beyond-card-trigger" type="button" aria-label={`Buka ${item.title}`} onClick={() => showRobotMessage(item.message)}><span className="beyond-card-accent" aria-hidden="true"><ArrowRight size={18} /></span></button></div></article>)}</div>
  </div></section>;
}
