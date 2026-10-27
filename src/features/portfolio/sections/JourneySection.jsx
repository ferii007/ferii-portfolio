import Description from '@/components/typography/Description';
import Image from 'next/image';
import journey from '../data/journey.json';
import { getLocalization, localeKey } from '@/constants/localization';
import { formatPeriod, isCurrent, journeyDescription, journeyRole } from '@/lib/journey';
import Lines from '@/components/typography/Lines';
import { Section, SectionTitle } from '@/components/layout/Section';
import Doodle from '@/components/doodles/Doodle';
import { splitLines } from '@/lib/text';
import Tape from '@/components/paper/Tape';

// A scene illustration (optional) sits left of the story; the real logo is laid over the scene's clear area
// using `logoBox` (percent of the scene canvas). Without a scene the logo/icon is shown on its own.
function JourneyArt({ item }) {
  if (!item.scene) return <div className="journey-art" aria-hidden="true"><Image className="journey-logo" src={item.icon} width={256} height={256} unoptimized alt="" /></div>;
  return <div className="journey-art journey-art--scene" aria-hidden="true">
    <div className="journey-scene">
      <Image src={item.scene} width={900} height={600} sizes="(max-width: 767px) 90vw, 360px" alt="" />
      {item.logoBox && <Image className="journey-scene-logo" src={item.icon} width={256} height={256} unoptimized alt="" style={{ left: `${item.logoBox.left}%`, top: `${item.logoBox.top}%`, width: `${item.logoBox.width}%` }} />}
    </div>
  </div>;
}

export default function JourneySection({ language }) {
  const localization = getLocalization(language);
  const { text } = localization;
  const field = (item, name) => text[localeKey('journey', item.id, name)];
  return (
    <Section name="journey" className="journey-section">
      <div className="container journey-stage">
        <div className="journey-heading">
          <div><SectionTitle name="journey" /></div>
          <div className="journey-handnote" aria-hidden="true"><p className="hand-note"><Lines text={text.journey_handnote} /></p><Doodle name="arrowFall" /></div>
        </div>
        <ol className="journey-timeline">
          {journey.map((item, index) => <li className={`journey-item${isCurrent(item) ? ' journey-item--current' : ''}`} key={item.id}>
            <div className="journey-period">{splitLines(formatPeriod(item.period, localization)).map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}</div>
            <span className="journey-marker" aria-hidden="true">{index + 1}</span>
            <article className="journey-card fp-paper">
              <Tape className="journey-tape" />
              <Doodle name="paperclip" className="journey-clip" />
              <JourneyArt item={item} />
              <div className="journey-content"><h3>{field(item, 'title')}</h3><p className="journey-organization">{item.organization}</p><p className="journey-role">{journeyRole(item, text)}</p><Description>{journeyDescription(item, text)}</Description></div>
            </article>
          </li>)}
        </ol>
        <div className="journey-decor" aria-hidden="true">
          <div className="journey-books">
            <Image src="/images/journey/books-corner.webp" width={900} height={450} sizes="520px" alt="" />
            {/* Cover titles in the artwork's own pixels: skewed to each cover's slant and clipped to the cover, like the About books. */}
            <svg viewBox="0 0 900 450" fill="none">
              <defs>
                <clipPath id="journey-cover-blue"><path d="M172 213 436 186 438 256 174 302Z" /></clipPath>
                {/* Worn print: ink thins where the cloth grain shows through, edges catch the weave. */}
                <filter id="journey-book-print" x="-5%" y="-20%" width="110%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency=".9 .35" numOctaves="2" seed="5" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="1" xChannelSelector="R" yChannelSelector="G" result="d" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -.55 1.25" result="wear" />
                  <feComposite in="d" in2="wear" operator="in" />
                </filter>
                <clipPath id="journey-cover-tan"><path d="M246 316 460 273 462 348 248 398Z" /></clipPath>
              </defs>
              {/* Each line follows its own slant: the cover's top and bottom edges converge toward the far end, so lower lines tilt a little more. */}
              <g clipPath="url(#journey-cover-blue)" className="journey-books-ink journey-books-ink--light" filter="url(#journey-book-print)">
                <text transform="translate(201 228) skewY(-6) skewX(9)"><tspan fontSize="32">Little</tspan></text>
                <text transform="translate(201 264) skewY(-8) skewX(9)"><tspan fontSize="33">Better</tspan><tspan dx="7" fontSize="30.5">Every</tspan><tspan fontSize="28.5">day</tspan></text>
              </g>
              <g clipPath="url(#journey-cover-tan)" className="journey-books-ink" filter="url(#journey-book-print)">
                <text transform="translate(290 325) skewY(-11.6) skewX(9)"><tspan fontSize="32">Ideas</tspan></text>
                <text transform="translate(272 360) skewY(-12.6) skewX(9)"><tspan fontSize="33">Build</tspan><tspan dx="7" fontSize="30">Tomor</tspan><tspan fontSize="27.5">row</tspan></text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
}
