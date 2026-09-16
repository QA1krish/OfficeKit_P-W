export interface AutomationConfig {
  jira?: { baseUrl: string; email: string; token: string; projectKey: string; defaultAssigneeAccountId: string; evidenceMaxBytes: number };
  smtp?: { host: string; port: number; secure: boolean; username: string; password: string; from: string; testerEmail: string; projectManagerEmail: string; developerEmail?: string };
  github?: { owner: string; repo: string; token: string; workflow: string; ref: string };
  webhook?: { secret: string; projectKey: string; port: number; targetRegistry: string; eventStore: string; ttlMs: number; rerunMode: 'test' | 'module' | 'suite' | 'full' };
}

function value(name: string, env: NodeJS.ProcessEnv, alias?: string): string | undefined { return env[name]?.trim() || (alias ? env[alias]?.trim() : undefined); }
function required(name: string, env: NodeJS.ProcessEnv, alias?: string): string { const result = value(name, env, alias); if (!result) throw new Error(`Missing required configuration: ${name}`); return result; }
function positiveInteger(name: string, raw: string): number { const parsed = Number(raw); if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`); return parsed; }
function boundedInteger(name: string, raw: string, min: number, max: number): number { const parsed = Number(raw); if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new Error(`${name} must be between ${min} and ${max}`); return parsed; }
function rerunMode(env: NodeJS.ProcessEnv): 'test' | 'module' | 'suite' | 'full' {
  const mode = env.JIRA_REVIEW_RERUN_MODE ?? 'test';
  if (!['test', 'module', 'suite', 'full'].includes(mode)) throw new Error('JIRA_REVIEW_RERUN_MODE must be test, module, suite, or full');
  return mode as 'test' | 'module' | 'suite' | 'full';
}
function boolean(name: string, env: NodeJS.ProcessEnv, key: string): boolean {
  const raw = env[key];
  if (raw === undefined || raw === '') return false;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`${name} must be 'true' or 'false'`);
}

export function loadConfig(mode: 'jira' | 'email' | 'webhook' | 'all', env = process.env): AutomationConfig {
  const config: AutomationConfig = {};
  if (mode === 'jira' || mode === 'all') config.jira = {
    baseUrl: required('JIRA_BASE_URL', env).replace(/\/$/, ''), email: required('JIRA_EMAIL', env), token: required('JIRA_API_TOKEN', env),
    projectKey: required('JIRA_PROJECT_KEY', env), defaultAssigneeAccountId: required('JIRA_DEFAULT_ASSIGNEE', env),
    evidenceMaxBytes: positiveInteger('JIRA_EVIDENCE_MAX_BYTES', env.JIRA_EVIDENCE_MAX_BYTES ?? '5000000'),
  };
  if (mode === 'email' || mode === 'all') config.smtp = {
    host: required('SMTP_HOST', env), port: boundedInteger('SMTP_PORT', env.SMTP_PORT ?? '587', 1, 65535), secure: boolean('SMTP_SECURE', env, 'SMTP_SECURE'),
    username: required('SMTP_USERNAME', env, 'SMTP_USER'), password: required('SMTP_PASSWORD', env), from: required('EMAIL_FROM', env),
    testerEmail: required('TESTER_EMAIL', env), projectManagerEmail: required('PROJECT_MANAGER_EMAIL', env), developerEmail: value('DEVELOPER_EMAIL', env),
  };
  if (mode === 'webhook' || mode === 'all') {
    config.webhook = {
      secret: required('JIRA_WEBHOOK_SECRET', env), projectKey: required('JIRA_PROJECT_KEY', env), port: boundedInteger('WEBHOOK_PORT', env.WEBHOOK_PORT ?? '3000', 1, 65535),
      targetRegistry: env.TARGET_REGISTRY ?? 'reports/targets.json', eventStore: env.WEBHOOK_EVENT_STORE ?? 'reports/webhook-events.json',
      ttlMs: positiveInteger('WEBHOOK_EVENT_TTL_MS', env.WEBHOOK_EVENT_TTL_MS ?? '86400000'), rerunMode: rerunMode(env),
    };
    config.github = { owner: required('GITHUB_OWNER', env), repo: required('GITHUB_REPO', env), token: required('GITHUB_TOKEN', env), workflow: env.GITHUB_WORKFLOW ?? 'jira-reverification.yml', ref: env.GITHUB_REF_NAME ?? 'main' };
  }
  return config;
}

export function validateOptionalRuntimeConfig(env = process.env): void {
  rerunMode(env);
  if (env.JIRA_BASE_URL || env.JIRA_API_TOKEN) loadConfig('jira', env);
  if (env.SMTP_HOST || env.SMTP_USERNAME || env.SMTP_USER) loadConfig('email', env);
}
