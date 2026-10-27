export default function manifest() {
  return {
    name: 'Feri Ramdani | Full Stack Developer',
    short_name: 'Feri',
    description: 'Portfolio Feri Ramdani: karya, kemampuan, perjalanan, dan cerita di balik kode.',
    start_url: '/',
    display: 'browser',
    background_color: '#F8F5EF',
    theme_color: '#081827',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
