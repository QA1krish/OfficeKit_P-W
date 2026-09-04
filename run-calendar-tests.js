#!/usr/bin/env node
// Usage: node run-calendar-tests.js --sleep=2000

const { execSync } = require('child_process');
const path = require('path');

function argument(name, fallback) {
  const value = process.argv.find((item) => item.startsWith(`${name}=`));
  return value ? value.split('=').slice(1).join('=') : fallback;
}

const sleepTime = argument('--sleep', '3000');
const project = argument('--project', 'headed');

console.log(`
==================================================================
  OfficeKit HR - CALENDAR AND APPLICATION JOURNEY
==================================================================
  Pause/step: ${sleepTime}ms

  FLOW 1 - CALENDAR
  Calendar controls, payroll period, legend, month grid, screenshot

  FLOW 2 - EMPLOYEE LIST
  ALL, ACTIVE, NOT ACTIVE filters, list validation, employee selection

  FLOW 3 - APPLICATION JOURNEY
  Select day and verify all five available request actions

  FLOW 4 - APPLICATION FORMS (NO SUBMISSION)
  Leave Application, Attendance Regularization, Late In/Early Out,
  On Duty, and Break Permission forms with module screenshots
==================================================================
`);

try {
  execSync(
    `npx playwright test calendar.spec.ts --project=${project} --reporter=list`,
    {
      cwd: path.dirname(__filename),
      env: { ...process.env, SLEEP_TIME: sleepTime },
      stdio: 'inherit',
    },
  );
} catch {
  process.exitCode = 1;
}
