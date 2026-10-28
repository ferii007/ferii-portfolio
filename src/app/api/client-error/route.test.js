import { describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const report = (headers = {}) => POST(new Request('http://localhost:3100/api/client-error', {
  method: 'POST',
  headers: { host: 'localhost:3100', 'x-forwarded-for': '10.7.7.7', ...headers },
  body: JSON.stringify({ kind: 'error', message: 'Boom' }),
}));

describe('POST /api/client-error', () => {
  it('logs reports from the site and refuses other websites', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await report({ origin: 'http://localhost:3100' })).status).toBe(204);
    expect((await report()).status).toBe(204); // beacons may omit Origin
    expect((await report({ origin: 'https://example.com' })).status).toBe(403);
    expect((await report({ 'sec-fetch-site': 'cross-site' })).status).toBe(403);
    errors.mockRestore();
  });

  it('stops one visitor from flooding the logs', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const statuses = [];
    for (let index = 0; index < 21; index += 1) statuses.push((await report({ 'x-forwarded-for': '10.8.8.8' })).status);
    expect(statuses.at(-1)).toBe(429);
    expect(statuses.slice(0, 20).every((status) => status === 204)).toBe(true);
    errors.mockRestore();
  });
});
