import { streamText } from 'ai';
import { getLocalization } from '@/constants/localization';
import { CHAT_LIMITS, validMessages } from '@/features/chat/config';
import { chatInstructions } from '@/features/chat/lib/instructions';
import { chatConfigured, chatModel } from '@/features/chat/lib/model';
import { createRateLimiter } from '@/features/chat/lib/rateLimit';

const perMinute = createRateLimiter({ limit: 6, windowMs: 60_000 });
const perDay = createRateLimiter({ limit: 60, windowMs: 86_400_000 });
// Room for a full history of the longest messages, with JSON escaping.
const MAX_BODY = CHAT_LIMITS.history * (CHAT_LIMITS.answerLength * 2 + 60) + 200;

const status = (code) => new Response(null, { status: code });

// Only the site's own pages may call this endpoint.
const sameOrigin = (request) => {
  try { return new URL(request.headers.get('origin')).host === request.headers.get('host'); } catch { return false; }
};

// Next text chunk of the model's reply, null when it is done; a provider failure (quota, bad key) throws.
async function nextText(parts) {
  for (;;) {
    const { done, value } = await parts.next();
    if (done) return null;
    if (value.type === 'error') throw value.error;
    if (value.type === 'text-delta' && value.text) return value.text;
  }
}

// Streams the robot's answer as plain text. Nothing is stored; failures are logged to Vercel's Runtime Logs.
export async function POST(request) {
  if (!chatConfigured()) return status(503);
  if (!sameOrigin(request)) return status(403);
  const visitor = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (!perMinute(visitor) || !perDay(visitor)) return status(429);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return status(413);
  let body;
  try { body = JSON.parse(raw); } catch { return status(400); }
  if (!validMessages(body?.messages)) return status(400);

  const result = streamText({
    model: chatModel,
    instructions: chatInstructions(getLocalization(body.language)),
    messages: body.messages.map(({ role, content }) => ({ role, content })),
    maxOutputTokens: 300,
    maxRetries: 1,
    abortSignal: request.signal,
  });
  const parts = result.fullStream[Symbol.asyncIterator]();

  // Wait for the first words, so a provider failure becomes an error status the chat panel can fall back on.
  let first;
  try { first = await nextText(parts); } catch (error) {
    console.error('[chat]', error?.message ?? error);
    return status(error?.statusCode === 429 ? 429 : 502);
  }
  if (!first) return status(502);

  const encoder = new TextEncoder();
  return new Response(new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(first));
      try {
        for (let text = await nextText(parts); text !== null; text = await nextText(parts)) controller.enqueue(encoder.encode(text));
      } catch (error) { console.error('[chat]', error?.message ?? error); }
      controller.close();
    },
  }), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
