import { ogImagePath, pageUrl, siteUrl } from '@/content/seo';
import { LANGUAGES } from '@/constants/languages';
import { getLocalization } from '@/constants/localization';

// One entry per language, each listing its translations so search engines pair them (hreflang in the sitemap).
export default function sitemap() {
  const alternates = { languages: Object.fromEntries(LANGUAGES.map((language) => [getLocalization(language.value).locale, pageUrl(language.path)])) };
  return LANGUAGES.map((language) => ({
    url: language.path === '/' ? `${siteUrl}/` : pageUrl(language.path),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: language.value === 'id' ? 1 : 0.9,
    alternates,
    images: [`${siteUrl}${ogImagePath[language.value]}`],
  }));
}
