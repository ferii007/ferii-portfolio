import journey from '@/features/portfolio/data/journey.json';
import { interpolate, localeKey } from '@/constants/localization';

const parse = (value) => { const [year, month] = String(value).split('-').map(Number); return { year, month }; };

// A period with `end: null` is still going on.
export const isCurrent = (item) => item.period.end === null;
export const currentJourney = () => journey.find(isCurrent);

// "Jan–Apr\n2020", "2021", "Des\n2021–\nSekarang": month names come from Intl, so only "Sekarang/Now" is copy.
export function formatPeriod({ start, end }, localization) {
  const from = parse(start);
  if (!from.month) return String(from.year);
  if (end === null) return `${localization.month(from.year, from.month)}\n${from.year}–\n${localization.text.journey_present}`;
  const to = parse(end);
  if (to.year === from.year) return `${localization.month(from.year, from.month)}–${localization.month(to.year, to.month)}\n${from.year}`;
  return `${localization.month(from.year, from.month)} ${from.year}–\n${localization.month(to.year, to.month)} ${to.year}`;
}

// Fixed job titles live in the data; a role that needs translating (a school major) lives in the language files.
export const journeyRole = (item, text) => (item.roles ? item.roles.join(' → ') : text[localeKey('journey', item.id, 'role')]);

export const journeyDescription = (item, text) => interpolate(text[localeKey('journey', item.id, 'description')], {
  year: parse(item.period.start).year,
  firstRole: item.roles?.[0],
  lastRole: item.roles?.at(-1),
});
