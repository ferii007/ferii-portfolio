// Answers to stand-alone questions, kept in this server instance's memory, so the same question (from anyone) is
// answered once instead of spending the AI quota again. Entries expire, and a new deploy starts with an empty cache,
// so changed portfolio data never meets a stale answer for long.
export function createAnswerCache({ ttlMs, maxEntries, now = Date.now }) {
  const entries = new Map();
  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return null;
      if (now() - entry.time >= ttlMs) { entries.delete(key); return null; }
      return entry.answer;
    },
    set(key, answer) {
      entries.delete(key);
      if (entries.size >= maxEntries) entries.delete(entries.keys().next().value); // oldest first
      entries.set(key, { answer, time: now() });
    },
  };
}
