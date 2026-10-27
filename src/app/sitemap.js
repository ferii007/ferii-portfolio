import { pageUrl } from '@/lib/seo';
import { LANGUAGES } from '@/constants/languages';
import { OG_IMAGES, SITE_URL } from '@/constants/site';

// One entry per language, each listing its translations so search engines pair them (hreflang in the sitemap).
export default function sitemap() {
  const alternates = { languages: Object.fromEntries(LANGUAGES.map((language) => [language.locale, pageUrl(language.path)])) };
  return LANGUAGES.map((language) => ({
    url: language.path === '/' ? `${SITE_URL}/` : pageUrl(language.path),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: language.value === 'id' ? 1 : 0.9,
    alternates,
    images: [`${SITE_URL}${OG_IMAGES[language.value]}`],
  }));
}
