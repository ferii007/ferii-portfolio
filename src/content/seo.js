import { site } from './site';
import journey from '@/features/portfolio/data/journey.json';
import skills from '@/features/skills/data/skills.json';

// One place for what search engines and link previews read. Copy here stays in the site's casual voice.
export const siteUrl = 'https://www.ferii-r.my.id';

export const seo = {
  title: `${site.hero.name} | ${site.hero.role}`,
  description: 'Portfolio Feri Ramdani, Full Stack Developer yang suka bikin website pakai Laravel, React, dan Next.js. Intip karya, skill, dan perjalananku di sini.',
  shareDescription: 'Karya, skill, dan cerita di balik kode dari Feri Ramdani, Full Stack Developer.',
  keywords: ['Feri Ramdani', 'Full Stack Developer', 'Software Engineer', 'Web Developer', 'Portfolio', 'Laravel', 'React', 'Next.js', 'Indonesia'],
  locale: 'id_ID',
  language: 'id-ID',
  ogImage: { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Feri Ramdani, Full Stack Developer' },
};

const current = journey.find((item) => item.current);
const school = journey.find((item) => /SMK/.test(item.title));

// schema.org graph: the home page is a ProfilePage about Feri, published on his WebSite.
export function structuredData() {
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: site.hero.name,
    alternateName: ['Feri', 'Pei'],
    jobTitle: site.hero.role,
    description: seo.description,
    url: siteUrl,
    image: `${siteUrl}${seo.ogImage.url}`,
    sameAs: [site.contact.github, site.contact.linkedin],
    knowsAbout: skills.map((skill) => skill.label),
    ...(current && { worksFor: { '@type': 'Organization', name: current.organization } }),
    ...(school && { alumniOf: { '@type': 'EducationalOrganization', name: school.organization } }),
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: site.hero.name, inLanguage: seo.language, publisher: { '@id': person['@id'] } },
      { '@type': 'ProfilePage', '@id': `${siteUrl}/#profile`, url: siteUrl, name: seo.title, inLanguage: seo.language, isPartOf: { '@id': `${siteUrl}/#website` }, mainEntity: { '@id': person['@id'] } },
    ],
  };
}
