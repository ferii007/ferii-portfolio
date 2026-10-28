import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: { exclude: [...configDefaults.exclude, 'tests/e2e/**'] },
  // Same "@/…" imports as the app (jsconfig.json).
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
});
