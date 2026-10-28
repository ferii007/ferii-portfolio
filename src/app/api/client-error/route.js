import { MAX_FIELD } from '@/lib/reportError';

const FIELDS = ['kind', 'message', 'stack', 'page', 'source'];

// Receives reports from src/lib/reportError.js and logs them, so they show up in Vercel's Runtime Logs.
export async function POST(request) {
  const raw = await request.text();
  if (raw.length > FIELDS.length * MAX_FIELD + 200) return new Response(null, { status: 413 });
  let report;
  try { report = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  const entry = Object.fromEntries(FIELDS.map((field) => [field, String(report?.[field] ?? '').slice(0, MAX_FIELD)]));
  console.error('[client-error]', JSON.stringify(entry));
  return new Response(null, { status: 204 });
}
