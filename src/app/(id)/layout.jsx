import RootDocument from '@/components/layout/RootDocument';
import { buildMetadata } from '@/content/seo';

export const metadata = buildMetadata('id');
export const viewport = { themeColor: '#F8F5EF' };

export default function RootLayout({ children }) {
  return <RootDocument language="id">{children}</RootDocument>;
}
