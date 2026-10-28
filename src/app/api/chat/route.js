import { streamText } from 'ai';
import { getLocalization } from '@/constants/localization';
import { CHAT_LIMITS, normalizeQuestion, validMessages } from '@/features/chat/config';
import { createAnswerCache, shareableAnswer } from '@/features/chat/lib/answerCache';
import { chatInstructions } from '@/features/chat/lib/instructions';
import { chatConfigured, chatModel } from '@/features/chat/lib/model';
import { createRateLimiter } from '@/lib/rateLimit';
import { fromOwnSite, visitorOf } from '@/lib/requestGuard';

const perMinute = createRateLimiter({ limit: 6, windowMs: 60_000 });
const perDay = createRateLimiter({ limit: 60, windowMs: 86_400_000 });
const answers = createAnswerCache({ ttlMs: 86_400_000, maxEntries: 500 });
// Room for a full history of the longest messages, with JSON escaping.
const MAX_BODY = CHAT_LIMITS.history * (CHAT_LIMITS.answerLength * 2 + 60) + 200;

const status = (code) => new Response(null, { status: code });
const TEXT_HEADERS = { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' };

// Next text chunk of the model's reply, null when it is done; a provider failure (quota, bad key) throws.
async function nextText(parts) {
  for (;;) {
    const { done, value } = await parts.next();
    if (done) return null;
    if (value.type === 'error') throw value.error;
    if (value.type === 'text-delta' && value.text) return value.text;
  }
}

// Streams the robot's answer as plain text. Only answers to stand-alone questions are kept (no visitor data);
// failures are logged to Vercel's Runtime Logs.
export async function POST(request) {
  if (!fromOwnSite(request)) return status(403);
  if (!chatConfigured()) return status(503);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return status(413);
  let body;
  try { body = JSON.parse(raw); } catch { return status(400); }
  if (!validMessages(body?.messages)) return status(400);

  // A first question doesn't depend on earlier turns, so its answer can be shared; a cached answer costs no quota.
  const localization = getLocalization(body.language);
  const cacheKey = body.messages.length === 1 ? `${localization.language}:${normalizeQuestion(body.messages[0].content)}` : null;
  const cached = cacheKey && answers.get(cacheKey);
  if (cached) return new Response(cached, { headers: { ...TEXT_HEADERS, 'X-Chat-Cache': 'hit' } });

  const visitor = visitorOf(request);
  if (!perMinute(visitor) || !perDay(visitor)) return status(429);

  const result = streamText({
    model: chatModel(),
    instructions: chatInstructions(localization),
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
      let answer = first;
      controller.enqueue(encoder.encode(first));
      try {
        for (let text = await nextText(parts); text !== null; text = await nextText(parts)) {
          answer += text;
          controller.enqueue(encoder.encode(text));
        }
        if (cacheKey && shareableAnswer(answer)) answers.set(cacheKey, answer);
      } catch (error) { console.error('[chat]', error?.message ?? error); }
      controller.close();
    },
  }), { headers: TEXT_HEADERS });
}
