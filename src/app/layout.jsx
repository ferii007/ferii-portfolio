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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return <html lang="id"><body className="feri-theme">
    {/* Shared organic paper edge used by .fp-paper::before. */}
    <svg className="fp-visually-hidden" aria-hidden="true" focusable="false"><filter id="fp-paper-edge" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" /><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" /></filter><filter id="fp-paper-torn" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="11" /><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    {children}
  </body></html>;
}
