import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// The only file that knows which AI answers the robot chat. CHATBOT_AI_PROVIDER picks one of these (default:
// google), and each reads its own key, so switching is a change of environment variables plus a redeploy, with no
// code edits. The CHATBOT_ prefix keeps these apart from any other AI keys (the SDKs' own default names included).
// To add a provider: install its AI SDK package (for example @ai-sdk/openai), add an entry here, and list its key
// in .env.example.
export const PROVIDERS = {
  // Google AI Studio's free tier; the "-latest" alias follows Google's current Flash-Lite.
  google: { key: 'CHATBOT_GEMINI_API_KEY', model: (apiKey) => createGoogleGenerativeAI({ apiKey })('gemini-flash-lite-latest') },
  // Paid (Anthropic Console credits).
  anthropic: { key: 'CHATBOT_ANTHROPIC_API_KEY', model: (apiKey) => createAnthropic({ apiKey })('claude-haiku-5-5') },
};
export const DEFAULT_PROVIDER = 'google';

const selected = () => {
  const name = process.env.CHATBOT_AI_PROVIDER?.trim().toLowerCase() || DEFAULT_PROVIDER;
  const provider = PROVIDERS[name];
  if (!provider) console.error('[chat]', `Unknown CHATBOT_AI_PROVIDER "${name}"; expected one of ${Object.keys(PROVIDERS).join(', ')}`);
  return provider;
};

// The chat is on only when the chosen provider exists and has its key.
export const chatConfigured = () => {
  const provider = selected();
  return Boolean(provider && process.env[provider.key]);
};

export const chatModel = () => {
  const provider = selected();
  return provider.model(process.env[provider.key]);
};
