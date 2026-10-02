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
});
