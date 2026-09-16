import { spawn } from 'node:child_process';

const forwarded = process.argv.slice(2);
const hasLoginFilter = forwarded.some((arg) => arg === '--grep' || arg.includes('@login'));
const args = ['playwright', 'test', 'src/tests/login.spec.ts', '--project=chromium', ...forwarded];
if (!hasLoginFilter) {
  const grepIndex = args.indexOf('--grep');
  if (grepIndex >= 0) args[grepIndex + 1] = `(?=.*@login)(?=.*${args[grepIndex + 1]})`;
  else args.push('--grep', '@login');
}
const child = spawn(process.execPath, [require.resolve('@playwright/test/cli'), ...args.slice(1)], { stdio: 'inherit', shell: false });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
