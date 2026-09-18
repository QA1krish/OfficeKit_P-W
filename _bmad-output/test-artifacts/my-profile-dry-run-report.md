# My Profile Regression Dry-Run Report

**Date:** 2026-09-15  
**Environment:** Beta  
**Scope:** Non-mutating navigation, read models, safe open/cancel actions, pagination, and downloads  
**Command:** `npx playwright test --project=chromium --grep "@my-profile" --grep-invert "@mutating"`

## Result

- Total: 13
- Passed: 12
- Failed: 1
- Persistent writes submitted: 0
- Screenshot evidence: 18 files in `screenshots/my-profile-dry-run/`
- Failure evidence: `test-results/beta/`

## Functional Results

| Area | Status | Evidence / behavior |
| --- | --- | --- |
| Personal Info | Pass | Identity/employment data rendered; Personal editor opened and cancelled without persistence. |
| Requests & Approvals | Pass (existing coverage) | Dry-run navigation opened Separation, Loans, Advance, and Claims. Existing dedicated specs retain detailed regression coverage. |
| Forms and Policies | Fail | Lists and pagination work, but the first listed document Download action did not start a download. |
| My Holidays | Pass | Year, search, columns, records, and pagination verified. |
| HR Forms & Policies | Pass | Dashboard carousel entry navigated to Forms and Policies. |
| News Feeds | Pass | Released News, search, columns, and explicit list state verified. |
| Surveys & Feedbacks | Pass | General, FS Checklist, and Exit Feedback opened; survey opened and exited without answers/submission. |
| Organisation | Pass | All view tabs rendered; scope editor opened and closed without changing selection; disabled export handled. |
| Letter | Pass | Request and Direct Posting workspaces rendered; released-letter actions opened safely. |
| Salary Slip | Pass | Salary slip iframe loaded; salary and monthly report controls rendered; nested download action completed. |

## Confirmed Defect

### Forms and Policies document download

- Severity: Medium
- Test: `[P1] reads Forms and Policies and downloads an available document`
- User action: Click `Download` for the first listed form.
- Expected: Browser download starts and completes with a filename.
- Actual: No download starts.
- Network evidence: `GET https://empapi.officekithr.net/api/FormsAndPolicies/ViewPolicyFile?policyId=5` returns HTTP 404.
- Playwright evidence: `test-results/beta/my-profile-content-My-Prof-4d934-loads-an-available-document-chromium/`
- Screenshot: `screenshots/my-profile-dry-run/forms-and-policies.png`

### Language cannot be re-added after deletion

- Severity: Medium
- User action: Add Arabic, delete its exact record, then add Arabic again.
- Expected: The deleted Language can be added again and appears in `GET /api/Employee/LanguageSkill`.
- Actual: The initial record persisted and deletion returned `Successfully Deleted`, but later Add requests return HTTP 200 and `Successfully Updated` while the Language collection remains empty.
- API evidence: The deleted record was `emp_LangId=38`; cleanup used `POST /api/Employee/DeleteLanguageSkill?empId=3161&Detailid=38` and restored the empty visible baseline.
- Observed sequence: initial Add returned `Successfully Updated`; GET returned the Arabic record; Delete returned `{ "errorID": 0, "errorMessage": "Successfully Deleted" }`; subsequent identical Add returned `Successfully Updated`; GET returned `[]`.
- Impact: A repeatable Add/Edit/Delete Playwright lifecycle would consume the five finite Language choices and mutate shared beta state over successive runs.
- Evidence: `screenshots/my-profile-updates/language-record-persisted-exploration.png` and `language-record-removed-exploration.png`.
- Reproduction safety: No automated reproduction command is published because another run would consume a different finite Language choice. The retained `npm run test:my-profile:mutating` command does not reproduce this defect.

## Deferred Write Phase

The first controlled write scenario now passes separately from this dry run:

- Test: `[P1] updates Personal Email, verifies persistence, and restores the baseline`
- Command: `npm run test:my-profile:mutating`
- Result: 1 passed in 14.8 seconds on final verification.
- Safety: Captured the original value, verified the temporary value after reload, and restored the exact baseline in `finally`.
- Evidence: `screenshots/my-profile-updates/personal-email-persisted.png` and `personal-email-restored.png`.

Further Add/Edit scenarios must remain tagged `@mutating`, use uniquely identifiable test data, and restore every created value. Language lifecycle automation is blocked until deleted choices can be reactivated or safely hard-deleted.
