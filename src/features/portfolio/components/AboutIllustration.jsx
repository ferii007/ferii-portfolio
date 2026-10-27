import Image from 'next/image';

// Labels are real SVG text drawn in the artwork's own pixel space (1536 × 1024), so each sits exactly on its object:
// book titles are skewed to the cover planes and clipped to them, the mug lines bend around the cylinder,
// and the sticky note is pinned over the photo wall.
const mugLines = ['Good', 'Ideas', 'Build', 'Better', 'Websites.'];
const mugIndent = [4, 0, 2, 0, -6];
const spark = 'M0 -9 8 -14M2 0H11M0 9 8 14';

export default function AboutIllustration() {
  return (
    <div className="about-art" aria-hidden="true">
      <Image className="about-still-life" src="/images/about/studio-desk.webp" width={1536} height={1024} sizes="(max-width: 767px) 100vw, 880px" alt="" />
      <svg className="about-art-labels" viewBox="0 0 1536 1024">
        <defs>
          <clipPath id="about-cover-1"><path d="M596 388 751 375 753 410 597 426Z" /></clipPath>
          <clipPath id="about-cover-2"><path d="M592 448 762 429 764 492 594 512Z" /></clipPath>
          <clipPath id="about-cover-3"><path d="M580 524 770 497 772 556 582 580Z" /></clipPath>
          <clipPath id="about-mug"><path d="M868 410C930 422 1000 422 1062 408V566C1000 584 930 584 868 566Z" /></clipPath>
          {mugLines.map((line, i) => <path key={line} id={`about-mug-line-${i}`} d={`M${916 + mugIndent[i]} ${430 + i * 27}Q960 ${437 + i * 27} 1050 ${431 + i * 27}`} />)}
          <filter id="about-paper-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n" /><feColorMatrix in="n" values="0 0 0 0 .45 0 0 0 0 .35 0 0 0 0 .2 0 0 0 .08 0" result="g" /><feComposite in="g" in2="SourceGraphic" operator="in" result="t" /><feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="t" /></feMerge></filter>
          <linearGradient id="about-note-paper" x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#fffcf2" /><stop offset=".75" stopColor="#fbf2dd" /><stop offset="1" stopColor="#f1e3c6" /></linearGradient>
        </defs>

        {/* Cover titles with the mockup's hand-drawn spark marks on both sides. */}
        <g className="about-art-foil">
          <g clipPath="url(#about-cover-1)"><g transform="translate(674 401) skewY(-5)">
            <text fontSize="29">DESIGN</text>
            <path d={spark} transform="translate(60 0)" /><path d={spark} transform="translate(-60 0) scale(-1 1)" />
          </g></g>
          <g clipPath="url(#about-cover-2)"><g transform="translate(675 470) skewY(-6.3)">
            <text fontSize="31">CODE</text>
            <path d={spark} transform="translate(56 0)" /><path d={spark} transform="translate(-56 0) scale(-1 1)" />
          </g></g>
          <g clipPath="url(#about-cover-3)"><g transform="translate(681 541) skewY(-5.6)">
            <text fontSize="27">PROGRESS</text>
            <path d={spark} transform="translate(80 0)" /><path d={spark} transform="translate(-80 0) scale(-1 1)" />
          </g></g>
        </g>

        <g className="about-art-ink about-art-ink--mug" clipPath="url(#about-mug)">
          {mugLines.map((line, i) => <text key={line}><textPath href={`#about-mug-line-${i}`}>{line}</textPath></text>)}
          <path className="about-art-stroke" d="M938 566Q976 571 1014 563" />
          <path className="about-art-stroke" d="M952 575Q980 578 1006 573" />
        </g>

        <g className="about-art-ink about-art-ink--page">
          {/* Each note uses its page's own axes, measured from the painted wireframes:
              left page baseline rises 7.4° with verticals leaning (0.31, 0.95); right page is nearly level with (0.39, 0.92). */}
          <g transform="matrix(.992 -.129 .31 .951 598 684)">
            <text><tspan x="0">Dari</tspan><tspan x="4" dy="34">ide</tspan></text>
            <path className="about-art-stroke" d="M26 50c6 14-2 26-20 32m-1-10 1 11 11 1" />
          </g>
          <g transform="matrix(1 -.015 .389 .921 1108 680)">
            <text><tspan x="0">… jadi</tspan><tspan x="0" dy="31">website</tspan><tspan x="0" dy="31">nyata.</tspan></text>
            <path className="about-art-stroke" d="M14 78c24-3 46-4 68-2M10 85c26-3 48-3 68-1" />
          </g>
        </g>

        <g className="about-art-note" transform="rotate(-2 1290 90)">
          <path d="M1182 -46H1398L1400 186C1350 190 1240 192 1184 188Z" fill="#3d2a10" opacity=".14" transform="translate(6 10)" filter="blur(6px)" />
          <path d="M1182 -46H1398L1400 186C1350 190 1240 192 1184 188Z" fill="url(#about-note-paper)" filter="url(#about-paper-grain)" />
          <path d="M1400 158 1400 186C1380 188 1366 189 1352 189Z" fill="#e7d6b2" />
          <text className="about-art-note-text" transform="rotate(-3 1290 90)"><tspan x="1222" y="30">Ide</tspan><tspan x="1216" dy="44">Kode</tspan><tspan x="1220" dy="44">Website</tspan><tspan x="1234" dy="44">Hidup</tspan></text>
          <rect className="about-art-tape" x="1262" y="-66" width="58" height="26" rx="2" transform="rotate(-7 1291 -53)" />
        </g>
      </svg>
    </div>
  );
}
