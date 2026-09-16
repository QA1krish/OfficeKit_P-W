---
title: 'Complete Playwright CI/CD and Jira defect automation'
type: 'feature'
created: '2026-09-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
baseline_commit: '8a0d23f730debf8380d140b457cb01b75239109d'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository runs Playwright in GitHub Actions and uploads native artifacts, but has no structured QA report, conservative failure classification, Jira deduplication/update flow, execution email, or Jira In Review re-verification path.

**Approach:** Extend the existing single-worker, non-mutating CI without rewriting tests: emit Playwright JSON, normalize results with deterministic test IDs, produce HTML/JSON QA summaries, integrate Jira and SMTP behind secrets, and add a secured webhook-triggered targeted verification workflow.

## Boundaries & Constraints

**Always:** Preserve Playwright's exit result even when Jira/email fails; create Jira bugs only for explicit application failures; deduplicate by test ID, module, and signature; query Jira transitions; default re-verification to one test; keep credentials out of code/logs; mock every external unit test; retain existing tags, fixtures, projects, serial lifecycles, and `@mutating` exclusions.

**Never:** Create real Jira issues or send email during tests; auto-file locator/browser/config/environment failures; assume Jira transition IDs; run full regression for Jira verification unless configured; deploy or expose a webhook without authentication; modify unrelated generated BMAD files.

**Decision:** Implement a portable Node HTTP webhook receiver with a documented hosting/TLS contract; no cloud-provider infrastructure will be added.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Main pass | Playwright JSON has no final failures | Native report, QA summaries, PASS email, no Jira write | Email failure is reported but test result remains pass |
| Application failure | Explicit product marker and evidence | Search Jira, update match or create one Bug, link evidence, FAIL email | Jira failure is isolated and original test failure remains fail |
| Non-app failure | Automation, infrastructure, environment, or configuration evidence | Classified and reported, no Jira bug | Preserve diagnostics |
| In Review | Valid unique Jira webhook event | Resolve deterministic test ID and dispatch targeted workflow | Reject invalid secret/project/status/event and duplicate events |
| Verification | Target test passes or fails | Update the same issue, query optional transition on pass, send verification email | Never create a second issue |

</frozen-after-approval>

## Code Map

- `playwright.config.ts` -- preserve projects/artifact policy; add machine-readable JSON reporter.
- `.github/workflows/playwright.yml` -- extend existing push/PR/manual pipeline; capture Playwright outcome, always process/upload/notify, then restore original result.
- `.github/workflows/jira-reverification.yml` -- new guarded manual/dispatch workflow for test/module/suite/full targeting and same-issue verification.
- `src/tests`, `src/pages`, `src/fixtures` -- source of resolved titles/tags/modules; do not rewrite tests or auth.
- `src/automation/` -- typed config, results/classification, reports, Jira, email, GitHub dispatch, webhook, and target resolution modules.
- `scripts/` and `webhook/` -- thin executable entry points over reusable services.
- `.env.example`, `.gitignore`, `README.md`, `package*.json`, `tsconfig.json` -- secret contract, ignored outputs, commands, dependencies, and compile scope.
- `unit/` -- Node test-runner suites with injected fetch/SMTP mocks and temporary output directories.

## Tasks & Acceptance

**Execution:**
- [x] `src/automation/reporting/*`, `scripts/process-results.ts` -- parse Playwright JSON, derive stable IDs/modules, classify failures, generate `reports/summary.{json,html}` and target metadata.
- [x] `src/automation/jira/*`, `scripts/process-jira.ts` -- implement authenticated search/create/comment/attachment/transition services with signature labels and no-duplicate behavior.
- [x] `src/automation/email/*`, `scripts/send-email.ts` -- implement Nodemailer transport and escaped execution/defect/verification templates with recipient fallback.
- [x] `src/automation/github/*`, `src/automation/webhook/*`, `webhook/jiraWebhook.ts` -- validate/idempotently process In Review events and dispatch GitHub workflow inputs.
- [x] `.github/workflows/*.yml`, `playwright.config.ts`, `package*.json` -- orchestrate main and targeted pipelines without masking test results.
- [x] `unit/**/*.test.ts` -- cover parsing, calculations, classification, matching, Jira create/update, status, targeting, dispatch, email, reports, webhook validation/idempotency.
- [x] `.env.example`, `.gitignore`, `README.md` -- document secrets, GitHub/Jira/webhook setup, operation, reports, and limitations.

**Acceptance Criteria:**
- Given a push, PR, or manual run, when tests finish, then native artifacts and calculated QA summaries are uploaded and an execution email is attempted.
- Given an explicit application failure, when Jira processing runs, then one matching issue is updated or one Bug is created with run/evidence links; other classifications create none.
- Given a valid In Review webhook, when its deterministic test ID resolves, then one idempotent targeted workflow runs and updates only that Jira issue for pass or fail.
- Given Jira or SMTP is unavailable, when integration steps fail, then diagnostics are recorded and the final workflow status still equals the Playwright result.

## Implementation Notes

- Added Playwright JSON reporting and deterministic IDs without changing existing tests, fixtures, projects, tags, serial lifecycles, or the default `@mutating` exclusion.
- Added typed reporting, conservative classification, Jira Cloud deduplication/assignment/evidence, SMTP templates, GitHub dispatch, file-backed webhook idempotency, and fresh target resolution.
- Main and verification workflows isolate Jira/SMTP failures but fail for browser installation, configuration, framework, collection, or Playwright failures.
- Jira project key and default assignee are required GitHub Secrets. A pass transition is optional and is only used after querying available Jira transitions; no transition is assumed.
- Added `npm run test:unit` to both workflow pipelines; unit test failures now gate the final result.
- Fixed `test:login` argument forwarding to preserve all Playwright options while adding the `@login` filter.
- Added per-message email failure isolation so one failed notification does not block others.
- Added per-test error isolation inside Jira processing so one integration failure does not skip remaining defects.
- Added `JIRA_PASS_TRANSITION` result verification; a missing transition now throws instead of silently succeeding.
- Fixed attachment error diagnostics to log actual failures instead of suppressing all errors.
- Fixed webhook to return HTTP 500 for server-side exceptions and release the event-store claim after successful dispatch.
- Fixed targeting to validate module targets exist and use deterministic IDs consistently.
- Added config validation for SMTP/Webhook port bounds (1-65535) and `SMTP_SECURE` boolean enforcement.
- Added JSON report ID ↔ fresh list ID contract test to prevent deterministic ID drift.
- Added `process-results.ts` exit code propagation for synthetic failures and overall FAILED results.
- Fixed targeted re-verification to handle missing test results with a synthetic fallback that updates the Jira issue.
- Validation on 2026-09-16 (review round 1): typecheck passed; 16 unit tests passed; configuration, workflow YAML, test collection, and safe login tests all passed. Review layers identified and fixed 10 patch-level defects.

## Review Triage Log

- **Blind Hunter** (finding floor 10): Identified issues including synthetic summary exit code, email isolation, tags on specs vs test objects, targeting by leaf title, module verification without test-case ID, Jira transition handling, deduplication race conditions, attachment error suppression, sequential email failures, webhook 400 for server errors. Verdicts: all `patch`.
- **Edge Case Hunter** (finding floor 11): Identified issues including targeted run failure handling, duplicate test titles, module inference without matching tags, zero-test PASS, port/boolean validation, Jira processing loop isolation, summary length limits, email failure isolation, event expiry, dispatch claim handling, package.json argument forwarding, CI test exclusion. Verdicts: all `patch`.
- **Verification Gap**: Identified issues including Jira classification tests excluded from CI, JSON/fresh-list ID drift, targeted run with missing results. Verdicts: all `patch`.

## Verification

**Commands:**
- `npm run typecheck` -- all production, script, webhook, and unit TypeScript compiles strictly.
- `npm run test:unit` -- all mocked unit tests pass without network or SMTP side effects.
- `npm run validate:config` -- required values and supported modes validate without printing secrets.
- `npm run validate:workflows` -- both workflow YAML files parse.
- `npm run test:list` -- existing Playwright collection remains valid.
- `npm run test:login -- --grep "required"` -- at least one safe Playwright test executes when credentials/environment permit.

## Spec Change Log
