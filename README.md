# OfficeKit Playwright Tests

Playwright TypeScript test automation for the OfficeKit beta environment using Page Object Model structure.

## Test Suites

- Login validation
- Admin dashboard validation and navigation
- Employee dashboard validation and navigation
- Calendar, employee filters, and application journey forms
- Full-page screenshots grouped by module

## Local Setup

Install dependencies and Chromium:

```bash
npm ci
npx playwright install chromium
```

Set these environment variables before running tests:

```text
COMPANY_CODE
ADMIN_USERNAME
ADMIN_PASSWORD
EMPLOYEE_USERNAME
EMPLOYEE_PASSWORD
```

Run all tests headlessly:

```bash
npm test
```

Run headed tests with readable delays:

```bash
npm run test:headed
```

Individual suites:

```bash
npm run test:login
npm run test:dashboard
npm run test:user-dashboard
npm run test:calendar
```

## GitHub Actions

The workflow is stored at `.github/workflows/playwright.yml`. Add the five environment variables above as repository Actions secrets under **Settings > Secrets and variables > Actions**.

Reports and module screenshots are uploaded as GitHub Actions artifacts after each run.
