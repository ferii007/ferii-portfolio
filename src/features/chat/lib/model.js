import { createGoogleGenerativeAI } from '@ai-sdk/google';

// The only file that knows which AI provider answers the robot chat. To switch provider, install its AI SDK
// package (for example @ai-sdk/anthropic), change the lines below, and rename the key in .env.example and on Vercel.
// Gemini's free tier (Google AI Studio) needs no billing; the "-latest" alias follows Google's current Flash-Lite.
const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatModel = google('gemini-flash-lite-latest');

export const chatConfigured = () => Boolean(process.env.GEMINI_API_KEY);
