import RootDocument from '@/components/layout/RootDocument';
import { buildMetadata } from '@/lib/seo';

export { viewport } from '@/lib/seo';
export const metadata = buildMetadata('id');

export default function RootLayout({ children }) {
  return <RootDocument language="id">{children}</RootDocument>;
}
