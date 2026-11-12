import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCI = Boolean(process.env.CI)

// End-to-end tests run against the production build, at desktop and phone sizes.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    // Optional: point at an already-installed Chromium instead of downloading Playwright's own.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
})
