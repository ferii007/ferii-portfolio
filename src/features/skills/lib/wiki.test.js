import { describe, expect, it, vi } from 'vitest';
import { fetchSkillSummary, WikiRequestError } from './wiki';

describe('Wikipedia summaries', () => {
  it('returns safe plain text and a Wikipedia source URL', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ title: 'React', extract: 'A JavaScript library.' }) }));
    const data = await fetchSkillSummary('React (software)', { fetchImpl });
    expect(data).toEqual({ title: 'React', extract: 'A JavaScript library.', url: 'https://en.wikipedia.org/wiki/React_(software)' });
    expect(fetchImpl.mock.calls[0][0]).toContain('/page/summary/React_(software)');
  });
  it('marks a missing page', async () => {
    await expect(fetchSkillSummary('Missing', { fetchImpl: async () => ({ ok: false, status: 404 }) })).rejects.toMatchObject({ code: 'not_found' });
  });
  it('marks a network failure', async () => {
    await expect(fetchSkillSummary('React', { fetchImpl: async () => { throw new TypeError('offline'); } })).rejects.toBeInstanceOf(WikiRequestError);
  });
  it('preserves an abort', async () => {
    const error = new DOMException('Aborted', 'AbortError');
    await expect(fetchSkillSummary('React', { fetchImpl: async () => { throw error; } })).rejects.toBe(error);
  });
  it('reads the page language edition first and falls back to English when it has no article', async () => {
    const fetchImpl = vi.fn(async (url) => (url.startsWith('https://id.')
      ? { ok: false, status: 404 }
      : { ok: true, json: async () => ({ title: 'Postman', extract: 'An API platform.' }) }));
    const data = await fetchSkillSummary('Postman (software)', { fetchImpl, language: 'id' });
    expect(fetchImpl.mock.calls.map(([url]) => new URL(url).host)).toEqual(['id.wikipedia.org', 'en.wikipedia.org']);
    expect(data.url).toBe('https://en.wikipedia.org/wiki/Postman_(software)');
  });
  it('keeps the Indonesian article when the id edition has one', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ title: 'HTML', extract: 'Bahasa markah.' }) }));
    const data = await fetchSkillSummary('HTML', { fetchImpl, language: 'id' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(data).toMatchObject({ extract: 'Bahasa markah.', url: 'https://id.wikipedia.org/wiki/HTML' });
  });
});
