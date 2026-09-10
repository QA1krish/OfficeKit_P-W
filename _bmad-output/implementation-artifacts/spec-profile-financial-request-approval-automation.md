---
title: 'Profile financial request and approval automation'
type: 'feature'
created: '2026-09-10'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'bf27dda34917b204b80ffc223e03208e3a9492a8'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Profile Requests & Approvals lacks Playwright coverage for Loans, Advance, and Claims under the supplied Employee and Approver roles. Regressions in request navigation, forms, filters, exports, and approval workspaces can therefore go undetected.

**Approach:** Add a shared financial-requests page object and role-based tests for all three modules, following the existing Separation suite's environment-driven login, stable role locators, screenshots, and download assertions. Exercise request creation and approval only to the level supported by the selected beta-data strategy.

## Boundaries & Constraints

**Always:** Read the company, Employee, and Approver credentials from existing environment variables; keep tests serial and repeatable; assert module-specific routes and visible behavior; preserve existing Separation coverage; record current beta configuration failures accurately.

**Never:** Commit or print credentials; modify admin PIN, claim categories, loan schemes, approval workflow configuration, or unrelated application data without explicit approval; include destructive Separation work in this scope; approve or reject unrelated existing requests.

**Beta-data decision:** Implement non-mutating coverage now. Assert the available UI, history, exports, and deterministic missing-configuration behavior; do not submit requests or alter beta setup to manufacture approval paths.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Request workspace | Employee opens Loans, Advance, or Claims | Correct route, request controls, status filter, search, and export are available | Empty lists render their documented empty state |
| Financial form | Employee opens Add Request | Module-specific form shell and required controls are asserted | Missing approvers or category API failure is handled according to the approved beta-data strategy |
| Approval workspace | Approver opens a supported approval route | Pending and historical statuses, request columns, and approver details are covered | Empty Pending queues remain valid and do not mutate history |
| Export | Employee or Approver chooses Excel/PDF | Download succeeds with the expected extension | Test fails on browser-reported download failure |

</frozen-after-approval>

## Code Map

- `src/pages/SeparationPage.ts` -- Reuse navigation, status-selection, approver-detail, export-menu, and optional `SLEEP_TIME` patterns; do not broaden this destructive-domain POM.
- `src/tests/separation.spec.ts` -- Reuse environment-driven Employee/Admin setup, role-based describes, download assertions, screenshots, and empty-state unions; do not change Separation execution.
- `src/pages/LoginPage.ts` -- Reuse `LoginCredentials` and `login`; no credential literals.
- `src/utils/environment.ts` -- Reuse fail-fast environment lookup for Employee and Approver credentials.
- `src/utils/screenshots.ts` -- Reuse artifact naming under a dedicated financial-requests module directory.
- `playwright.config.ts` -- Existing single-worker, non-parallel execution makes shared beta state deterministic; no change expected.
- `src/pages/FinancialRequestsPage.ts` -- New cohesive POM for module navigation, request controls/forms, status filters, exports, and Claims approval views.
- `src/tests/financial-requests.spec.ts` -- New Employee and Approver coverage for Loans, Advance, and Claims.
- `package.json` -- Add a focused financial-request test script.

## Tasks & Acceptance

**Execution:**
- [x] `src/pages/FinancialRequestsPage.ts` -- Encapsulate stable financial request and approval interactions without embedding credentials or test assertions.
- [x] `src/tests/financial-requests.spec.ts` -- Cover the matrix for both roles and isolate all permitted beta mutations.
- [x] `package.json` -- Add `test:financial-requests` for focused verification.

**Acceptance Criteria:**
- Given valid environment credentials, when the focused suite runs, then all three Employee request workspaces and every approval workspace available to the supplied Approver are checked without touching Separation.
- Given an empty request or Pending approval list, when assertions run, then the suite accepts the explicit empty state rather than relying on seeded rows.
- Given an export action, when the download completes, then its extension and browser failure state are validated.
- Given the approved beta-data strategy, when unsupported request/approval paths are reached, then tests produce deterministic expectations rather than accidental timeouts or mutations.

## Implementation Notes

- Added 15 serial, non-mutating tests across Employee request and Approver approval access for Loans, Advance, and Claims.
- The form checks accept either configured module-specific fields and approval workflow details or an explicit approver/category configuration error.
- Approval tests inspect only workspaces exposed to the supplied Approver and never invoke approve or reject actions.
- Baseline diff review corrected the Loan route, request-search locator, form labels, module-specific columns and empty states, explicit Claims category API failure, and Loan/Advance Approval-tab absence to match observed beta behavior.
- The earlier form-fallback note is superseded: Loan and Advance now assert their observed missing-approver UI directly, while Claims asserts the observed category API response directly.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: TypeScript passes.
- `npm run test:financial-requests` -- expected: focused Chromium suite passes against beta with required environment variables.
- `npm test` -- expected: full Chromium suite passes, including unchanged Separation coverage.

**Results (2026-09-10):**
- `npx tsc --noEmit` -- passed.
- `npx playwright test financial-requests.spec.ts --project=chromium --list` -- passed; 15 tests registered.
- `npx playwright test --project=chromium --list` -- passed; 81 tests registered, including the unchanged Separation suite.
- `npm run test:financial-requests` -- blocked by beta availability: initial navigation to `https://betatesting.officekithr.net/login` timed out after 30 seconds; 1 test failed before login and 14 serial tests did not run.
- `npm test` -- not run because the same beta navigation outage prevents meaningful full-suite verification.
- `npx tsc --noEmit` after baseline-diff corrections -- passed.
- `npm run test:financial-requests` after corrections -- blocked at the same initial beta navigation; 1 test failed before login and 14 serial tests did not run.
- `curl.exe -I --max-time 30 https://betatesting.officekithr.net/login` -- confirmed the external outage with a connection timeout and no response bytes.
- `npx playwright test financial-requests.spec.ts --project=chromium --list` after corrections -- passed; 15 tests registered.
- `npx playwright test --project=chromium --list` after corrections -- passed; 81 tests registered across 6 files.
- `git diff --check` after corrections -- passed.
- User confirmed the beta login and a fresh Incognito sign-in work normally; the earlier "beta availability" diagnosis is superseded by an automation-execution network-path issue.
- Fresh headless Chromium, headed installed Chrome, curl, PowerShell HTTP, and MCP browser sessions launched from OpenCode all timed out before HTTP response; public and system DNS consistently resolved `35.207.212.62`.
- The same Playwright Chromium process reached `https://www.google.com` with HTTP 200, and no enabled Windows outbound firewall rule targets Node, Chrome, or Playwright; the connectivity failure is specific to fresh clients reaching the beta host.
