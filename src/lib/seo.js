import journey from '@/features/portfolio/data/journey.json';
import skills from '@/features/skills/data/skills.json';
import { getLocalization, interpolate, pageTitle } from '@/constants/localization';
import { LANGUAGES } from '@/constants/languages';
import { HIGHLIGHT_SKILLS, OG_IMAGES, PERSON, SITE_URL, SOCIAL, THEME } from '@/constants/site';
import { currentJourney } from './journey';

// What search engines and link previews read, per language. Built from constants and copy, never retyped.

export const pageUrl = (path) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

const skillLabel = (id) => skills.find((skill) => skill.id === id).label;
const languageOf = (localization) => LANGUAGES.find((item) => item.value === localization.language);

// "Portfolio Feri Ramdani, Full Stack Developer yang suka bikin website pakai Laravel, React, dan Next.js. …"
export const seoDescription = (localization) => interpolate(localization.text.seo_description, { stack: localization.list(HIGHLIGHT_SKILLS.map(skillLabel)) });

const ogImage = (localization) => ({ url: OG_IMAGES[localization.language], width: OG_IMAGES.width, height: OG_IMAGES.height, alt: `${PERSON.name}, ${PERSON.role}` });


export function buildMetadata(language) {
  const localization = getLocalization(language);
  const { text } = localization;
  const title = pageTitle();
  const share = { title, description: text.seo_share_description, images: [ogImage(localization)] };
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: seoDescription(localization),
    keywords: [PERSON.name, PERSON.role, ...(currentJourney()?.roles ?? []), 'Portfolio', ...HIGHLIGHT_SKILLS.map(skillLabel), 'Indonesia'],
    authors: [{ name: PERSON.name, url: SITE_URL }],
    creator: PERSON.name,
    applicationName: PERSON.name,
    alternates: {
      canonical: languageOf(localization).path,
      // hreflang: Google shows the Indonesian page to Indonesian searchers and English to everyone else.
      languages: { ...Object.fromEntries(LANGUAGES.map((item) => [item.locale, item.path])), 'x-default': '/en' },
    },
    openGraph: {
      ...share,
      url: languageOf(localization).path,
      siteName: PERSON.name,
      locale: localization.openGraphLocale,
      alternateLocale: LANGUAGES.filter((item) => item.value !== localization.language).map((item) => getLocalization(item.value).openGraphLocale),
      type: 'profile',
      firstName: PERSON.firstName,
      lastName: PERSON.lastName,
    },
    twitter: { card: 'summary_large_image', ...share },
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

const school = journey.find((item) => item.id === 'smk-graduation');

// schema.org graph: each home page is a ProfilePage about Feri, published on his WebSite.
export function structuredData(language) {
  const localization = getLocalization(language);
  const url = pageUrl(languageOf(localization).path);
  const work = currentJourney();
  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: PERSON.name,
    alternateName: [PERSON.firstName, PERSON.nickname],
    jobTitle: PERSON.role,
    description: seoDescription(localization),
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGES.id}`,
    sameAs: Object.values(SOCIAL).map((profile) => profile.url),
    knowsAbout: skills.map((skill) => skill.label),
    ...(work && { worksFor: { '@type': 'Organization', name: work.organization } }),
    ...(school && { alumniOf: { '@type': 'EducationalOrganization', name: school.organization } }),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: PERSON.name, inLanguage: LANGUAGES.map((item) => item.locale), publisher: { '@id': person['@id'] } },
      { '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: pageTitle(), inLanguage: localization.locale, isPartOf: { '@id': `${SITE_URL}/#website` }, mainEntity: { '@id': person['@id'] } },
    ],
  };
}

export const viewport = { themeColor: THEME.canvas };
