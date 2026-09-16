import { loadConfig, validateOptionalRuntimeConfig } from '../src/automation/config';

const mode = (process.argv[2] ?? 'none') as 'jira' | 'email' | 'webhook' | 'all' | 'runtime' | 'none';
if (!['jira', 'email', 'webhook', 'all', 'runtime', 'none'].includes(mode)) throw new Error(`Unsupported validation mode: ${mode}`);
if (mode === 'runtime') validateOptionalRuntimeConfig(); else if (mode !== 'none') loadConfig(mode);
console.log(`Configuration valid (${mode})`);
