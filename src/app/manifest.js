import { getLocalization, pageTitle } from '@/constants/localization';
import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { PERSON, THEME } from '@/constants/site';
import { seoDescription } from '@/lib/seo';

export default function manifest() {
  return {
    name: pageTitle(),
    short_name: PERSON.firstName,
    description: seoDescription(getLocalization(DEFAULT_LANGUAGE)),
    start_url: '/',
    display: 'browser',
    background_color: THEME.canvas,
    theme_color: THEME.heading,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
