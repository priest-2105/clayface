import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3000', channel: 'chrome', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: [
    { command: 'pnpm dev:api', url: 'http://127.0.0.1:4000/api/health', reuseExistingServer: true, timeout: 120000 },
    { command: 'pnpm dev:web', url: 'http://127.0.0.1:3000', reuseExistingServer: true, timeout: 120000 },
  ],
});
