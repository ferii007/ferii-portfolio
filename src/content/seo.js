import { site } from './site';
import journey from '@/features/portfolio/data/journey.json';
import skills from '@/features/skills/data/skills.json';
import { getLocalization } from '@/constants/localization';
import { LANGUAGES } from '@/constants/languages';

// One place for what search engines and link previews read, per language.
export const siteUrl = 'https://feriramdani.my.id';

const pageUrl = (path) => (path === '/' ? siteUrl : `${siteUrl}${path}`);

// Share images live in public/og with fixed URLs (file-convention images get hashed names inside route groups).
const ogImagePath = { id: '/og/feri-ramdani-id.png', en: '/og/feri-ramdani-en.png' };

export function buildMetadata(language) {
  const localization = getLocalization(language);
  const { text } = localization;
  const current = LANGUAGES.find((item) => item.value === localization.language);
  const others = LANGUAGES.filter((item) => item.value !== localization.language);
  return {
    metadataBase: new URL(siteUrl),
    title: text.seo_title,
    description: text.seo_description,
    keywords: ['Feri Ramdani', 'Full Stack Developer', 'Software Engineer', 'Web Developer', 'Portfolio', 'Laravel', 'React', 'Next.js', 'Indonesia'],
    authors: [{ name: site.hero.name, url: siteUrl }],
    creator: site.hero.name,
    applicationName: site.hero.name,
    alternates: {
      canonical: current.path,
      // hreflang: Google shows the Indonesian page to Indonesian searchers and English to everyone else.
      languages: { ...Object.fromEntries(LANGUAGES.map((item) => [getLocalization(item.value).locale, item.path])), 'x-default': '/en' },
    },
    openGraph: {
      title: text.seo_title,
      description: text.seo_share_description,
      url: current.path,
      siteName: site.hero.name,
      locale: localization.openGraphLocale,
      alternateLocale: others.map((item) => getLocalization(item.value).openGraphLocale),
      type: 'profile',
      firstName: 'Feri',
      lastName: 'Ramdani',
      images: [{ url: ogImagePath[localization.language], width: 1200, height: 630, alt: text.seo_og_alt }],
    },
    twitter: { card: 'summary_large_image', title: text.seo_title, description: text.seo_share_description, images: [{ url: ogImagePath[localization.language], width: 1200, height: 630, alt: text.seo_og_alt }] },
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

const current = journey.find((item) => item.current);
const school = journey.find((item) => item.id === 'smk-graduation');

// schema.org graph: each home page is a ProfilePage about Feri, published on his WebSite.
export function structuredData(language) {
  const localization = getLocalization(language);
  const { text } = localization;
  const url = pageUrl(LANGUAGES.find((item) => item.value === localization.language).path);
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: site.hero.name,
    alternateName: ['Feri', 'Pei'],
    jobTitle: text.hero_role,
    description: text.seo_description,
    url: siteUrl,
    image: `${siteUrl}${ogImagePath.id}`,
    sameAs: [site.contact.github, site.contact.linkedin],
    knowsAbout: skills.map((skill) => skill.label),
    ...(current && { worksFor: { '@type': 'Organization', name: current.organization } }),
    ...(school && { alumniOf: { '@type': 'EducationalOrganization', name: school.organization } }),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: site.hero.name, inLanguage: LANGUAGES.map((item) => getLocalization(item.value).locale), publisher: { '@id': person['@id'] } },
      { '@type': 'ProfilePage', '@id': `${url}#profile`, url, name: text.seo_title, inLanguage: localization.locale, isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@id': person['@id'] } },
    ],
  };
}

export { ogImagePath, pageUrl };
