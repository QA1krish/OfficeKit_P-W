export type TestEnvironment = 'beta' | 'staging' | 'production';

const environmentUrls: Partial<Record<TestEnvironment, string>> = {
  beta: 'https://betatesting.officekithr.net',
  production: 'https://officekithr.net',
};

export function resolveTestEnvironment(): TestEnvironment {
  const environment = process.env.TEST_ENV ?? 'beta';
  if (!['beta', 'staging', 'production'].includes(environment)) {
    throw new Error(`Unsupported TEST_ENV "${environment}". Use beta, staging, or production.`);
  }
  return environment as TestEnvironment;
}

export function resolveBaseUrl(): string {
  const environment = resolveTestEnvironment();
  const baseUrl = process.env.BASE_URL || environmentUrls[environment];
  if (!baseUrl) {
    throw new Error(`BASE_URL is required when TEST_ENV=${environment}.`);
  }
  return baseUrl.replace(/\/$/, '');
}
