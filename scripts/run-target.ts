import { spawn, spawnSync } from 'node:child_process';
import { buildTargetArgs, parseListOutput } from '../src/automation/reporting/targeting';

const cli = require.resolve('@playwright/test/cli');
const collection = spawnSync(process.execPath, [cli, 'test', '--project=chromium', '--grep-invert', '@mutating', '--list'], { encoding: 'utf8', shell: false });
if (collection.status !== 0) throw new Error(`Fresh Playwright collection failed: ${collection.stderr}`);
const args = buildTargetArgs({ mode: process.env.TARGET_MODE ?? process.env.JIRA_REVIEW_RERUN_MODE ?? 'test', testCaseId: process.env.TEST_CASE_ID?.trim(), module: process.env.MODULE?.trim(), targets: parseListOutput(collection.stdout) });
const child = spawn(process.execPath, [cli, ...args], { stdio: 'inherit', shell: false });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
