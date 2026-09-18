---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-identify-targets', 'step-03c-aggregate', 'step-04-validate-and-summarize']
lastStep: 'step-04-validate-and-summarize'
lastSaved: '2026-09-15'
inputDocuments:
  - playwright.config.ts
  - package.json
  - src/tests/calendar.spec.ts
  - src/tests/dashboard.spec.ts
  - src/tests/financial-requests.spec.ts
  - src/tests/login.spec.ts
  - src/tests/separation.spec.ts
  - src/tests/user-dashboard.spec.ts
---

# Automation Expansion Summary

## Preflight

- Detected stack: frontend Playwright and TypeScript E2E repository.
- Execution mode: standalone automation workflow with parallel generation subagents; no My Profile story or test-design artifact was supplied.
- Framework readiness: Playwright configuration, page objects, tests, screenshots, HTML reporting, video, and trace retention are present.
- Existing relevant coverage: Admin navigation confirms My Profile opens Personal Information. No dedicated regression suite covers the requested My Profile sections.
- Requested dry-run boundary: navigate, read, open controls, cancel forms, and validate safe downloads only. Do not submit or persist profile, request, form, survey, or feedback changes.
- TEA flags: Playwright Utils enabled in configuration, browser automation auto, Pact utilities enabled but irrelevant to this browser-only scope.
- Utility availability: referenced TEA knowledge fragments and the `playwright-utils` package are not installed in this repository. Existing vanilla Playwright patterns will be used; no unavailable APIs will be invented.

## Requested Areas

- Personal Info
- Requests & Approvals
- Forms and Policies
- My Holidays
- HR Forms & Policies
- News Feeds
- Surveys & Feedbacks
- Organisation
- Letter
- Salary Slip

## Dry-Run Discovery

| Area | Observed route / entry | Dry-run result |
| --- | --- | --- |
| Personal Info | `/my-profile/personal-info` | Opened; 15 profile subareas exposed. |
| Requests & Approvals | `/my-profile/request-approvals/separations/request` | Opened; Separation, Loans, Advance, and Claims exposed. |
| Forms and Policies | `/my-profile/forms-policy` | Opened; Forms and Policies tabs and paginated records exposed. |
| My Holidays | `/my-profile/my-holidays` | Opened; year and paginated holiday records exposed. |
| HR Forms & Policies | Dashboard `Forms & Policies` entry | Alias/alternate entry to the profile forms-policy capability. |
| News Feeds | `/my-profile/news-feed/released` | Opened; Released News and paginated records exposed. |
| Surveys & Feedbacks | `/my-profile/surveys-feedbacks/general` | Opened; General, FS Checklist, Exit Feedback, View, and Start Survey controls exposed. |
| Organisation | `/my-profile/organisation` | Opened; overview, chart, hierarchy, teams, reports, export, and edit controls exposed. |
| Letter | `/my-profile/request-approvals/letter` | Opened; Request, Direct Posting, Export, and released-letter controls exposed. |
| Salary Slip | `/my-profile/finance/salary%20slip` | Opened through expandable submenu; report content remained at `Loading reports...` during observation. |

Screenshots from exploration are stored under the ignored `screenshots/my-profile-dry-run/` directory.

## Coverage Plan

| Priority | Test level | Target scenarios |
| --- | --- | --- |
| P0 | E2E | My Profile navigation; Personal Info identity/read model; each top-level area route and primary content; no unexpected application error. |
| P0 | E2E | Personal Info write-capable controls open and cancel without persistence; later write phase must capture baseline, update one safe field/record, verify persistence, capture screenshot, and restore when supported. |
| P1 | E2E | Requests & Approvals module tabs and explicit list/empty states, reusing existing financial and Separation coverage instead of duplicating lifecycle mutations. |
| P1 | E2E | Forms/Policies tabs, pagination and available download actions; HR Forms & Policies dashboard entry reaches the same capability. |
| P1 | E2E | Holiday year/list state; News released list state; Survey tabs and safe View/Start Survey open-cancel behavior. |
| P1 | E2E | Organisation tabs, explicit report/empty states, safe Edit open-cancel and chart export when enabled. |
| P1 | E2E | Letter tabs, list state, released-letter view/download controls, and exports when enabled. |
| P1 | E2E | Salary Slip and Monthly Report tabs, year filter, report/empty/error state, and downloads when available. |
| P2 | E2E | Pagination and filtering edge cases for seeded lists; disabled controls and empty-state behavior. |

Scope is comprehensive read-only regression for the first run. Persistent Add/Edit/Submit scenarios remain excluded from the dry run and will only execute under an explicit `@mutating` tag with baseline verification and screenshot evidence.

## Generated Automation

- Execution: parallel subagents for API-boundary and E2E analysis.
- API tests: 0; no endpoint inventory, provider source, or API contract was available, so no speculative tests were created.
- E2E tests: 14 across four My Profile spec files: 13 dry-run tests plus one separately invoked mutating test.
- Priority coverage: 2 P0, 10 P1, 2 P2.
- Shared infrastructure: `MyProfilePage`, application-failure monitoring, and download verification.
- Screenshot folder: `screenshots/my-profile-dry-run/`.

### Playwright Utils Deviations

- `src/fixtures/auth.fixture.ts:47`: form-driven isolated role sessions are retained because `auth-session` and a project auth provider are unavailable.
- `src/tests/my-profile-personal-info.spec.ts:1`: tests use the repository fixture entry point because `mergeTests` utilities are not installed.
- `src/tests/my-profile-content.spec.ts:1`: repository-native browser actions are used because `interceptNetworkCall` and file utilities are unavailable.
- `src/tests/my-profile-actions.spec.ts:1`: repository-native browser actions are used because `networkErrorMonitor` and file utilities are unavailable.
- `src/utils/applicationFailures.ts:1`: response/page-error monitoring is implemented with vanilla Playwright because `networkErrorMonitor` is unavailable.
- `src/utils/downloads.ts:1`: download verification uses Playwright's download event because the utility file handlers are unavailable.
- Browser discovery used authenticated repository Playwright execution after `playwright-cli` was found unavailable; no CLI session was created.

## Validation

- `npm run typecheck`: passed.
- Focused dry-run collection: 13 My Profile tests registered across three files; one additional mutating test is registered in a fourth file.
- Initial dry run: 7 passed, 6 failed; evidence review identified five selector/interaction assumptions and one Forms download failure.
- Stabilized dry run: 12 passed, 1 failed.
- Reversible Personal Email lifecycle: 1 passed; persistence and exact baseline restoration verified after reload.
- Confirmed application defect: the first Forms and Policies document download calls `ViewPolicyFile?policyId=5`, receives HTTP 404, and emits no browser download.
- Confirmed application defect: deleting a Language succeeds, but adding that Language again returns success without restoring it to the employee collection; repeatable Language mutation automation is blocked.
- Detailed report: `my-profile-dry-run-report.md`.
- Browser hygiene: all exploration browsers were closed in `finally`; no CLI session was opened.

## Files Created or Updated

- `src/pages/MyProfilePage.ts`
- `src/tests/my-profile-personal-info.spec.ts`
- `src/tests/my-profile-personal-info-mutating.spec.ts`
- `src/tests/my-profile-content.spec.ts`
- `src/tests/my-profile-actions.spec.ts`
- `src/utils/applicationFailures.ts`
- `src/utils/downloads.ts`
- `package.json`
- `README.md`
- `_bmad-output/test-artifacts/my-profile-dry-run-report.md`
- `_bmad-output/test-artifacts/automation-summary.md`
- `_bmad-output/test-artifacts/automation-generation-summary.json`
- `_bmad-output/implementation-artifacts/spec-my-profile-language-lifecycle.md`

## Assumptions and Risks

- Beta list contents are shared seeded data and can change; assertions accept explicit populated or empty states where relevant.
- Requests & Approvals reuses existing financial and Separation suites rather than duplicating mutating workflows.
- Additional persistent Personal Info Add/Edit coverage remains deferred and must be tagged `@mutating` with restoration or deletion.
- The Forms download test will continue failing until the missing document/API behavior is repaired or the seeded record is corrected.
- Language Add/Edit/Delete must not be automated repeatedly until the API can reactivate a soft-deleted language or provide safe hard-delete cleanup.

## Recommended Next Workflow

Repair the Forms download and Language reactivation defects before expanding their regression coverage; retain the reversible Personal Email mutation test meanwhile.
