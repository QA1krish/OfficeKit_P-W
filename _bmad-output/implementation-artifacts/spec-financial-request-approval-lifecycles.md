---
title: 'Financial request and approval lifecycles'
type: 'feature'
created: '2026-09-11'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'f5056fa6481fcecd46d0fe3e8849b5908f0a08a8'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Loans, Advance, and Claims automation currently verifies read-only workspaces but does not prove that an Employee request reaches the correct Approver or that approve and reject decisions propagate back to the Employee. The configured beta data observed during the prior implementation cannot support those paths.

**Approach:** Extend the financial page object and focused suite with row-scoped, end-to-end lifecycle tests. For each module, create uniquely marked requests, capture their generated IDs, action only those exact IDs as the configured financial Approver, and verify the Employee sees the terminal outcomes.

## Boundaries & Constraints

**Always:** Keep credentials environment-driven; use the supplied eligible test accounts; create separate records for approve and reject outcomes; identify every mutable action by captured request ID or unique marker; execute serially; make retries idempotent where possible; retain the existing read-only coverage.

**Never:** Approve or reject the first arbitrary Pending row; mutate schemes, categories, workflows, PINs, or unrelated records; include Claims administration or Separation; commit account identifiers or secrets; treat an absent approval workflow as a passing lifecycle.

**Decisions:** Use the supplied Employee and two sequential Approver accounts through environment variables only, with the same order for all three modules. Run the full two-level matrix during every focused financial-suite execution: both Approvers approve one request, the first Approver rejects a second, and the first approves before the second rejects a third. Retain all nine uniquely labelled terminal records per run as beta history.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Submit | Eligible Employee completes a valid module request with a unique marker | Request ID is captured and matching Employee row becomes Pending | Missing scheme/category/approver fails with actionable evidence |
| Approve | Matching request ID is Pending at each approval level | First Approver advances only that row; second Approver completes it; both roles show Approved | Missing/duplicate row aborts before mutation |
| Reject level 1 | A second matching request ID is Pending with the first Approver | First Approver rejects only that row and Employee sees Rejected | Missing confirmation or validation keeps the record Pending and fails |
| Reject level 2 | A third matching request passes the first Approver | Second Approver rejects only that row and Employee sees Rejected | Wrong approval level or ambiguous row aborts before mutation |
| Retry | Test restarts after submission | Existing unique request is reused or safely detected | Never creates duplicate actions against an unknown row |

</frozen-after-approval>

## Code Map

- `src/pages/FinancialRequestsPage.ts` -- Extend existing module navigation and form panel with module-specific completion, submission result, exact-row lookup, and approve/reject dialog controls; replace `.first()` for all mutating actions.
- `src/tests/financial-requests.spec.ts` -- Add isolated `@mutating @financial-lifecycle` tests that carry request IDs across Employee and both sequential Approver sessions; keep existing read-only scenarios.
- `src/pages/LoginPage.ts` -- Reuse credential login when switching roles; do not embed account values.
- `src/utils/environment.ts` -- Reuse required-variable validation, loading lifecycle-only credentials inside mutating tests so non-mutating CI collection does not require them.
- `.env.example` -- Document both financial Approver credential pairs without values.
- `README.md` -- Document setup, persistent side effects, focused command, and safe execution order.
- `package.json` -- Keep `test:financial-requests` mutating as approved and exclude `@mutating` from the default `npm test` CI path.
- `.github/workflows/playwright.yml` -- Default `npm test` remains non-mutating; no new lifecycle secrets are required in CI.
- `playwright.config.ts` -- Existing single worker supports serial mutation; no change expected.
- `_bmad-output/implementation-artifacts/spec-profile-financial-request-approval-automation.md` -- Prior observed beta constraints and read-only implementation evidence; do not alter its frozen intent.

## Tasks & Acceptance

**Execution:**
- [x] `src/pages/FinancialRequestsPage.ts` -- Add module form data, unique request discovery, and exact-ID approval/rejection operations.
- [x] `src/tests/financial-requests.spec.ts` -- Add the full sequential approval, first-level rejection, and second-level rejection matrix for each financial module.
- [x] `.env.example`, `README.md`, `package.json` -- Document and wire the approved account, mutation, and record-retention policies while keeping default CI non-mutating.

**Acceptance Criteria:**
- Given eligible accounts, when each focused module lifecycle runs, then three uniquely identifiable requests traverse the expected two-level workflow and finish as one Approved and two Rejected records.
- Given unrelated Pending records, when lifecycle decisions execute, then no row except the captured request IDs is mutated.
- Given missing configuration or ambiguous matching rows, when a lifecycle reaches a mutation boundary, then it fails before approving or rejecting anything.
- Given the default full-suite command, when tests run locally or in CI, then `@mutating` lifecycle tests are excluded; given the focused financial command, all lifecycle tests execute.

## Implementation Notes

- Added one serial lifecycle test per module. Each creates three marked requests, carries captured IDs through both Approvers, and verifies the Employee's Approved/Rejected terminal rows.
- Employee creation, first-level approval, second-level approval, and Employee verification each use a newly created browser context that is closed in `finally`; no authenticated page or context is shared between roles.
- Markers are not visible table data, so search results are not treated as proof of ownership. Submission clears and settles the full Pending list before snapshotting IDs, captures exactly one before/after ID delta, and journals that ID locally for proven retry reuse. An interrupted submission without a captured ID aborts before another request can be created.
- Every approval mutation requires one exact Pending ID row; the request form also requires exactly two configured approval stages before submission.
- Claims complete category, subcategory, expense date, amount, and marked description fields, including a generated receipt fixture when the selected subcategory requires an attachment.
- Lifecycle outcomes execute one at a time, with both rejection paths before the approval path. This allows a rejected request to release module capacity before the next request while leaving the retained Approved record last.
- Claims request controls use the live side-sheet structure rather than the Loan/Advance modal container; submission still requires one exact module-specific action.
- Default `npm test` excludes `@mutating`; the focused financial script retains read-only coverage and includes lifecycle tests.

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: TypeScript passes.
- `npx playwright test financial-requests.spec.ts --project=chromium --list` -- expected: lifecycle tests are registered.
- `npm run test:financial-requests` -- expected: read-only checks and all nine lifecycle records execute successfully.
- `npm run test:financial-requests -- --grep @financial-lifecycle` -- expected: every configured module lifecycle passes exactly once.
- `npm test` -- expected: full non-destructive suite passes without running deferred Separation work.

**Results (2026-09-11):**
- `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit` -- passed. The first unconstrained TypeScript process exhausted the host's Node heap; no type errors were reported after increasing the heap.
- `npx playwright test financial-requests.spec.ts --project=chromium --list` -- passed; 18 tests registered, including three lifecycle tests.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep "@financial-lifecycle" --list` -- passed; all three module lifecycles registered exactly once.
- `npx playwright test --project=chromium --grep-invert "@mutating" --list` -- passed; 81 tests registered and no lifecycle test was included.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep "exposes statuses"` -- passed; all three module status/filter regressions passed.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep "Claims exports"` -- passed after waiting for the settled Claims empty state.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep-invert "@mutating"` -- passed; all 15 retained Employee and Approver financial checks passed against beta.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep "@financial-lifecycle"` -- blocked before login or mutation because `FINANCIAL_APPROVER_1_USERNAME` and the other lifecycle Approver variables are not configured locally.
- `npm test` -- began correctly with 81 non-mutating tests and passed the first 11 before the command was stopped by the execution timeout; a complete full-suite result is not available.
- `git diff --check` -- passed.
- Baseline-finding remediation: `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit` -- passed after isolating every role phase in a new browser context, settling the unfiltered Pending list before ID snapshots, and replacing unprovable marker-table reuse with a local submission journal.
- Loans-only lifecycle run -- the first two attempts failed before submission while list and scheme-load synchronization were corrected; neither could mutate data. The final attempt issued one `Submit Request` click for the labelled Approved-path Loans request, but the form remained open and no request ID was captured. The journal records the submission as uncertain and prevents an unsafe retry. No Approver session, approval, or rejection occurred. Advance and Claims were not run.

**Results (2026-09-14):**
- `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit` -- passed after the capacity-aware lifecycle sequencing and Claims side-sheet locator corrections.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep "@financial-lifecycle" --list` -- passed; all three lifecycle tests registered exactly once.
- `npx playwright test --project=chromium --grep-invert "@mutating" --list` -- passed; 81 default-suite tests registered and no lifecycle test was included.
- `npx playwright test financial-requests.spec.ts --project=chromium --grep-invert "@mutating"` -- passed; all 15 retained Employee and Approver financial checks passed.
- Advance lifecycle -- passed the full rejection-at-level-1, rejection-at-level-2, and two-level approval matrix with Employee terminal verification and Approved history visible to both Approvers.
- Loans lifecycle -- blocked safely before a fresh submission because both two-stage schemes return `data: "exists"` for the supplied Employee. A journaled prior request was advanced by exact ID through both Approvers before its run stopped at a different pre-existing uncertain journal entry; no unrelated row was actioned.
- Claims lifecycle -- blocked safely before submission with `Financial lifecycle cannot continue: no claim category is available.` The live category control opened with no selectable options.
- `npm test` -- started with 81 non-mutating tests and passed the first 10 before the 120-second command timeout; a complete default-suite result is not available.
- `git diff --check` -- passed; only line-ending conversion warnings were reported for existing working-tree files.
