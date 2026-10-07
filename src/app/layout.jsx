import './globals.css';
import '@/design-system/css/appearance.css';
import '@/components/typography/typography.css';
import '@/features/projects/projects.css';
import '@/features/portfolio/portfolio.css';
import '@/features/contact/contact.css';
import '@/features/robot/robot.css';
import '@/features/skills/skills.css';
import './responsive.css';
import '@/components/layout/footer.css';

export const metadata = {
  metadataBase: new URL('https://www.ferii-r.my.id/'),
  title: 'Feri Ramdani | Full Stack Developer',
  description: 'Portfolio Feri Ramdani: karya, kemampuan, perjalanan, dan cerita di balik kode.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Feri Ramdani | Full Stack Developer',
    description: 'Karya, kemampuan, perjalanan, dan cerita di balik kode.',
    url: 'https://www.ferii-r.my.id/',
    siteName: 'Feri Ramdani',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Feri Ramdani — Full Stack Developer' }],
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return <html lang="id"><body className="feri-theme">{children}</body></html>;
}
