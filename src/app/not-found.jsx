import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Eyebrow from '@/components/typography/Eyebrow';
import Description from '@/components/typography/Description';

export const metadata = { title: 'Halaman nggak ketemu | Feri Ramdani' };

export default function NotFound() {
  return <main className="not-found">
    <Link className="brand fp-logo not-found-logo" href="/" aria-label="Feri, ke beranda">feri<span>.</span></Link>
    <div className="not-found-body">
      <div className="not-found-copy">
        <Eyebrow className="not-found-eyebrow">Error 404</Eyebrow>
        <h1 className="section-title not-found-title">Waduh, nyasar nih</h1>
        <Description>Halaman yang kamu cari nggak ada, atau mungkin udah pindah. Robotku aja ikut bingung.</Description>
        <Link className="button button-primary fp-btn fp-btn--primary not-found-home" href="/"><ArrowLeft size={18} aria-hidden="true" /> Balik ke beranda</Link>
      </div>
      {/* A real frame of the 3D companion (side-eye, hovering), captured from the live canvas. */}
      <div className="not-found-robot" aria-hidden="true">
        <Image src="/images/robot/robot-lost.webp" width={289} height={457} alt="" priority />
        <svg className="not-found-portal" viewBox="0 0 400 120" fill="none"><ellipse cx="200" cy="60" rx="190" ry="50" pathLength="100" /><ellipse cx="200" cy="61" rx="130" ry="32" pathLength="100" /><ellipse cx="200" cy="62" rx="70" ry="16" pathLength="100" /></svg>
      </div>
    </div>
  </main>;
}
