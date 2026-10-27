import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RootDocument from '@/components/layout/RootDocument';
import Logo from '@/components/layout/Logo';
import Eyebrow from '@/components/typography/Eyebrow';
import Description from '@/components/typography/Description';
import { getLocalization, pageTitle } from '@/constants/localization';
import { LABELS } from '@/constants/site';

// With two root layouts (app/(id) and app/(en)) Next needs one global 404. It can't know the visitor's language,
// so it speaks Indonesian (the default) and offers the English home as well.
const { text } = getLocalization('id');
const { text: english } = getLocalization('en');

export const metadata = { title: pageTitle(text.not_found_page) };

export default function GlobalNotFound() {
  return <RootDocument language="id"><main className="not-found">
    <Logo className="not-found-logo" href="/" label={text.not_found_logo} />
    <div className="not-found-body">
      <div className="not-found-copy">
        <Eyebrow className="not-found-eyebrow">{LABELS.notFoundCode}</Eyebrow>
        <h1 className="section-title not-found-title">{text.not_found_title}</h1>
        <Description>{text.not_found_description}</Description>
        <div className="not-found-actions">
          <Link className="button button-primary fp-btn fp-btn--primary not-found-home" href="/"><ArrowLeft size={18} aria-hidden="true" /> {text.not_found_back}</Link>
          <Link className="not-found-english" href="/en" hrefLang="en" lang="en">{english.not_found_title}. {english.not_found_back} →</Link>
        </div>
      </div>
      {/* A real frame of the 3D companion (side-eye, hovering), captured from the live canvas. */}
      <div className="not-found-robot" aria-hidden="true">
        <Image src="/images/robot/robot-lost.webp" width={289} height={457} alt="" priority />
        <svg className="not-found-portal" viewBox="0 0 400 120" fill="none"><ellipse cx="200" cy="60" rx="190" ry="50" pathLength="100" /><ellipse cx="200" cy="61" rx="130" ry="32" pathLength="100" /><ellipse cx="200" cy="62" rx="70" ry="16" pathLength="100" /></svg>
      </div>
    </div>
  </main></RootDocument>;
}
