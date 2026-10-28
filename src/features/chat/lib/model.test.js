import { afterEach, describe, expect, it, vi } from 'vitest';
import { chatConfigured, chatModel, DEFAULT_PROVIDER, PROVIDERS } from './model';

describe('robot chat provider', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('uses Gemini unless CHATBOT_AI_PROVIDER says otherwise', () => {
    vi.stubEnv('CHATBOT_AI_PROVIDER', '');
    vi.stubEnv('CHATBOT_GEMINI_API_KEY', 'test-key');
    expect(DEFAULT_PROVIDER).toBe('google');
    expect(chatConfigured()).toBe(true);
    expect(chatModel().provider).toMatch(/google/);
  });

  it('switches provider with CHATBOT_AI_PROVIDER and that provider\'s own key', () => {
    vi.stubEnv('CHATBOT_AI_PROVIDER', ' Anthropic ');
    vi.stubEnv('CHATBOT_GEMINI_API_KEY', 'test-key');
    vi.stubEnv('CHATBOT_ANTHROPIC_API_KEY', '');
    expect(chatConfigured()).toBe(false);
    vi.stubEnv('CHATBOT_ANTHROPIC_API_KEY', 'test-key');
    expect(chatConfigured()).toBe(true);
    expect(chatModel().provider).toMatch(/anthropic/);
  });

  it('stays off for an unknown provider', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('CHATBOT_AI_PROVIDER', 'nope');
    expect(chatConfigured()).toBe(false);
    expect(errors).toHaveBeenCalled();
    errors.mockRestore();
  });

  it('lists every provider key in .env.example', async () => {
    const { readFileSync } = await import('node:fs');
    const example = readFileSync(new URL('../../../../.env.example', import.meta.url), 'utf8');
    for (const { key } of Object.values(PROVIDERS)) expect(example).toContain(`${key}=`);
  });
});
