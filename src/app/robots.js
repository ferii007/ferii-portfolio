const site = 'https://www.ferii-r.my.id';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
