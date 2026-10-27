import { defineConfig } from '@playwright/test';

const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/e2e',
  // CI runners are slower and render WebGL in software; give the 3D robot more room there.
  timeout: ci ? 60_000 : 30_000,
  expect: { timeout: ci ? 15_000 : 5_000 },
  retries: ci ? 1 : 0,
  // Without a GPU every page renders the robot on the CPU; one test at a time keeps them from starving each other.
  workers: ci ? 1 : undefined,
  reporter: ci ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : undefined,
  },
  webServer: {
    // CI tests the production build from the previous step (what Vercel serves); locally the dev server is reused.
    command: ci ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3100',
    reuseExistingServer: !ci,
    timeout: 120_000,
  },
});
