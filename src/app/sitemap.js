import { siteUrl, seo } from '@/content/seo';

export default function sitemap() {
  return [{ url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1, images: [`${siteUrl}${seo.ogImage.url}`] }];
}
