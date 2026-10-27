// Every hand-drawn mark on the site, drawn once here: sparks, arrows next to hand notes, underlines, the paper clip.
// Strokes use currentColor, so the colour comes from the surrounding CSS.
const DOODLES = {
  // Sparks
  sparkTitle: { viewBox: '0 0 34 42', d: 'm10 12 9-9M13 23l16-3M12 33l11 5', width: 3.5 },
  sparkAccent: { viewBox: '0 0 34 34', d: 'M7 2 5 13M20 5l-7 10M31 20l-11 5', width: 3 },
  sparkCard: { viewBox: '0 0 34 40', d: 'm8 14 7-11M17 23l14-6M18 32l12 5', width: 3 },
  sparkJourney: { viewBox: '0 0 36 40', d: 'm8 17 8-14M17 29l15-7', width: 4 },
  // Arrows beside hand notes
  arrowCurl: { viewBox: '0 0 68 54', d: 'M61 9C36 8 16 21 12 43M7 33l5 12 12-7', width: 2, join: true },
  arrowDrop: { viewBox: '0 0 44 70', d: 'M40 6C24 14 12 30 10 60m-8-12 8 14 10-12', width: 2.2, join: true },
  arrowDive: { viewBox: '0 0 50 60', d: 'M43 5C18 13 12 33 12 49m-8-12 8 15 15-7', width: 2.5, join: true },
  arrowBack: { viewBox: '0 0 65 36', d: 'M60 8C38-1 21 9 9 29m1-11-3 13 15-4', width: 2, join: true },
  arrowRise: { viewBox: '0 0 90 40', d: 'M4 32c22 8 50 2 74-20m-13 0 14-3-1 14', width: 2, join: true },
  arrowFall: { viewBox: '0 0 64 60', d: 'M51 5C25 14 14 30 12 50M5 37l7 15 15-9', width: 2.4, join: true },
  // Underlines
  underlineDouble: { viewBox: '0 0 170 20', d: 'M3 15C50 7 109 5 167 9M59 17c43-5 72-6 103-5', width: 3.2 },
  underlineStory: { viewBox: '0 0 170 20', d: 'M3 13C50 6 109 4 167 8M40 17c43-5 72-6 103-5', width: 3 },
  underlineSingle: { viewBox: '0 0 170 14', d: 'M3 10C52 4 108 3 167 6', width: 3.2 },
  // Objects
  paperclip: { viewBox: '0 0 24 60', d: 'M8 18V8a4 4 0 0 1 8 0v38a7 7 0 0 1-14 0V14', width: 2.2 },
};

export default function Doodle({ name, className, strokeWidth }) {
  const { viewBox, d, width, join } = DOODLES[name];
  return <svg className={className} viewBox={viewBox} fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth={strokeWidth ?? width} strokeLinecap="round" strokeLinejoin={join ? 'round' : undefined} />
  </svg>;
}
