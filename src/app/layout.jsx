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
import { seo, siteUrl } from '@/content/seo';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: 'Feri Ramdani', url: siteUrl }],
  creator: 'Feri Ramdani',
  applicationName: 'Feri Ramdani',
  alternates: { canonical: '/' },
  openGraph: {
    title: seo.title,
    description: seo.shareDescription,
    url: '/',
    siteName: 'Feri Ramdani',
    locale: seo.locale,
    type: 'profile',
    firstName: 'Feri',
    lastName: 'Ramdani',
    images: [seo.ogImage],
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.shareDescription, images: [seo.ogImage] },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export const viewport = { themeColor: '#F8F5EF' };

export default function RootLayout({ children }) {
  return <html lang="id"><body className="feri-theme">
    {/* Shared organic paper edge used by .fp-paper::before. */}
    <svg className="fp-visually-hidden" aria-hidden="true" focusable="false"><filter id="fp-paper-edge" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" /><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" /></filter><filter id="fp-paper-torn" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="11" /><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    {children}
  </body></html>;
}
