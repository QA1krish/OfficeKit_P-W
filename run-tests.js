#!/usr/bin/env node
// Readable test runner for officekithr.net login suite.
// Usage:
//   node run-tests.js                          -> headed, 3000ms sleep between steps
//   node run-tests.js --sleep=5000             -> headed, 5000ms sleep between steps
//   node run-tests.js --sleep=2000 --project=chromium --grep="@login @smoke"
//   SLEEP_TIME=5000 node run-tests.js          -> same via env var (mac/linux)
// The SLEEP_TIME value (2000-5000) controls the pause after every step
// (navigate / fill / click) so the client can watch each flow in the browser.

const { execSync } = require('child_process');
const path = require('path');

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(name + '='));
  if (hit) return hit.split('=').slice(1).join('=');
  return fallback;
}

const SLEEP_TIME = argValue('--sleep', process.env.SLEEP_TIME || '3000');
const PROJECT = argValue('--project', process.env.PROJECT || 'headed');
const GREP = argValue('--grep', process.env.GREP || '');
const HEADED = PROJECT === 'headed';

const flows = [
  { tag: '@login @smoke', name: 'Flow 1: Login Page UI', description: 'Controls, placeholders, required attributes, and password show/hide behavior' },
  { tag: '@login @positive', name: 'Flow 2: Valid Credentials', description: 'Admin reaches HR dashboard and Employee reaches the Employee dashboard' },
  { tag: '@login @negative', name: 'Flow 3: Negative Tests', description: 'Wrong password / username / company code and empty fields each show an error' },
  { tag: '@login @validation', name: 'Flow 4: Required Field Validation', description: 'Empty company code, username, password, and all-empty submission are blocked by browser validation' },
];

console.log('');
console.log('==================================================================');
console.log('  officekithr.net - Login Test Execution (readable flow report)');
console.log('==================================================================');
console.log('');
console.log('  Base URL   : https://betatesting.officekithr.net/login');
console.log('  Browser    : Chromium (' + (HEADED ? 'HEADED - visible window' : 'headless') + ')');
console.log('  Project    : ' + PROJECT + (HEADED ? ' (slowMo 500ms)' : ''));
console.log('  Sleep/step : ' + SLEEP_TIME + 'ms  (use --sleep=2000..5000 to change)');
console.log('  Grep       : ' + (GREP || '(all @login tests)'));
console.log('');
console.log('------------------------------------------------------------------');
console.log('  FLOWS THAT WILL RUN');
console.log('------------------------------------------------------------------');
flows.forEach((flow) => {
  console.log('  ' + flow.name + '  [' + flow.tag + ']');
  console.log('    -> ' + flow.description);
});
console.log('');
console.log('------------------------------------------------------------------');
console.log('  TEST DATA');
console.log('------------------------------------------------------------------');
console.log('  Admin    : credentials loaded from GitHub Secrets / environment');
console.log('  Employee : credentials loaded from GitHub Secrets / environment');
console.log('');
console.log('------------------------------------------------------------------');
console.log('  STARTING EXECUTION - watch the browser, each step pauses ~' + SLEEP_TIME + 'ms');
console.log('------------------------------------------------------------------');
console.log('');

try {
  let cmd = 'npx playwright test --project=' + PROJECT + ' --reporter=list';
  if (GREP) cmd += ' --grep="' + GREP + '"';
  execSync(cmd, {
    cwd: path.dirname(__filename),
    env: { ...process.env, SLEEP_TIME },
    stdio: 'inherit',
  });
  console.log('');
  console.log('==================================================================');
  console.log('  DONE - all listed flows above have finished. See results above.');
  console.log('==================================================================');
} catch (error) {
  console.log('');
  console.log('==================================================================');
  console.log('  FINISHED WITH FAILURES - see the failing flow(s) above.');
  console.log('==================================================================');
  process.exitCode = 1;
}
