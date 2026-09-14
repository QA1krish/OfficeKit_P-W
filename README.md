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

Financial lifecycle tests additionally require the eligible Employee above and both sequential
financial Approver accounts:

```text
FINANCIAL_APPROVER_1_USERNAME
FINANCIAL_APPROVER_1_PASSWORD
FINANCIAL_APPROVER_2_USERNAME
FINANCIAL_APPROVER_2_PASSWORD
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

The default `npm test` command excludes every `@mutating` test. Run financial requests separately,
after confirming the Employee is eligible for all three modules and the two Approvers are configured
in that order:

```bash
npm run test:financial-requests
npm run test:financial-requests -- --grep @financial-lifecycle
```

Run only one focused financial suite at a time. Each lifecycle execution creates and retains three
records per module: one Approved, one rejected by the first Approver, and one rejected by the second
Approver. Set `FINANCIAL_LIFECYCLE_RUN_ID` to a unique value when a stable marker is needed across a
manual retry; never reuse that value for concurrent runs.

## GitHub Actions

The workflow is stored at `.github/workflows/playwright.yml`. Add the five base environment variables
above as repository Actions secrets under **Settings > Secrets and variables > Actions**. Lifecycle
Approver secrets are intentionally not required because CI uses the non-mutating default command.

Reports and module screenshots are uploaded as GitHub Actions artifacts after each run.
