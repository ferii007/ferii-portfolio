import Link from 'next/link';
import { LABELS } from '@/constants/site';

// The "feri." wordmark. Pass `href="/"` to link home (a page route) or an anchor such as "#top".
export default function Logo({ href, label, className = '' }) {
  const Tag = href.startsWith('#') ? 'a' : Link;
  return <Tag className={`brand fp-logo ${className}`.trim()} href={href} aria-label={label}>{LABELS.logo}<span>.</span></Tag>;
}
