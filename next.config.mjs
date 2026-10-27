const isDev = process.env.NODE_ENV === 'development';

// No nonces: the page is static, so inline scripts are allowed. Wikipedia is fetched for the skill details;
// three.js may decode textures through blob: URLs and workers, and drei's mesh decoder compiles WebAssembly.
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self' https://*.wikipedia.org${isDev ? ' ws:' : ''};
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Webpack's module concatenation crashes on this page ("Unexpected end of JSON input" in
  // ConcatenationScope.matchModuleReference); bundling modules unconcatenated avoids it.
  webpack(config) {
    config.optimization.concatenateModules = false;
    return config;
  },
  // Dev runs on Turbopack, which needs no workaround; declaring it keeps Next from rejecting the webpack hook.
  turbopack: {},
  // Two root layouts (app/(id), app/(en)) need one global 404 page.
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
