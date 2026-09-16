import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';
import { resolveBaseUrl, resolveTestEnvironment } from './src/config/environments';

dotenv.config({ path: [`.env.${process.env.TEST_ENV ?? 'beta'}`, '.env'], quiet: true });
const testEnvironment = resolveTestEnvironment();

export default defineConfig({
  testDir: './src/tests',
  outputDir: `test-results/${testEnvironment}`,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never', outputFolder: `playwright-report/${testEnvironment}` }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(process.env.CI ? ([['junit', { outputFile: 'test-results/junit.xml' }]] as const) : []),
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: resolveBaseUrl(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'headed',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          slowMo: 500,
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
