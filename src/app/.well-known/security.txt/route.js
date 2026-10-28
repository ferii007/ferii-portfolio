import { SITE_URL, SOCIAL } from '@/constants/site';

// RFC 9116: tells whoever finds a security problem how to reach Feri. Built at deploy time; Expires is a year out,
// so any deploy within the year renews it.
export const dynamic = 'force-static';

export function GET() {
  const expires = new Date(Date.now() + 365 * 86_400_000).toISOString();
  const body = [
    `Contact: ${SOCIAL.linkedin.url}`,
    `Expires: ${expires}`,
    'Preferred-Languages: id, en',
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
  ].join('\n');
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
