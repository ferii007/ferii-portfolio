import { MAX_FIELD } from '@/lib/reportError';
import { createRateLimiter } from '@/lib/rateLimit';
import { fromOtherSite, visitorOf } from '@/lib/requestGuard';

const FIELDS = ['kind', 'message', 'stack', 'page', 'source'];
// A page sends at most 5 reports; this keeps one visitor (or a script) from flooding the logs.
const perMinute = createRateLimiter({ limit: 20, windowMs: 60_000 });

// Receives reports from src/lib/reportError.js and logs them, so they show up in Vercel's Runtime Logs.
export async function POST(request) {
  if (fromOtherSite(request)) return new Response(null, { status: 403 });
  if (!perMinute(visitorOf(request))) return new Response(null, { status: 429 });
  const raw = await request.text();
  if (raw.length > FIELDS.length * MAX_FIELD + 200) return new Response(null, { status: 413 });
  let report;
  try { report = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  const entry = Object.fromEntries(FIELDS.map((field) => [field, String(report?.[field] ?? '').slice(0, MAX_FIELD)]));
  console.error('[client-error]', JSON.stringify(entry));
  return new Response(null, { status: 204 });
}
