---
title: 'Automate reversible My Profile language lifecycle'
type: 'feature'
created: '2026-09-15'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** My Profile mutation coverage verifies Personal Email, but Language records cannot currently support a repeatable create/delete lifecycle in the shared beta account.

**Approach:** Preserve the empty visible Language baseline, retain only the proven reversible Personal Email test, and report the confirmed Language deletion/reactivation defect instead of consuming additional finite choices.

</frozen-after-approval>

## Implementation Notes

- Reuse `src/tests/my-profile-personal-info-mutating.spec.ts`, `MyProfilePage`, `monitorApplicationFailures`, and `captureScreen`.
- The account initially has no Language records. The form offers English, Malayalam, Hindi, Arabic, Tamil and Beginner, Intermediate, Fluent, Native.
- Verify with `npm run typecheck` and the targeted mutating Playwright command.
- Exploration created Arabic/Fluent with Speak and Read as record `emp_LangId=38`, verified it through the read API, and removed it through `POST /api/Employee/DeleteLanguageSkill?empId=3161&Detailid=38`; the visible collection returned to empty.
- The Delete endpoint is not exposed in the UI. It appears to soft-delete: subsequent identical Add submissions return HTTP 200 and `Successfully Updated`, but `GET /api/Employee/LanguageSkill` remains empty. A fixed Language lifecycle would therefore consume finite choices and is not repeatable.
- Removed the attempted permanent Language test after reproducing this behavior; the passing Personal Email lifecycle remains unchanged.
- Final verification: `npm run typecheck` passed; `npm run test:my-profile:mutating` passed one test in 14.8 seconds; focused `git diff --check` passed.

## Code Map

- `src/tests/my-profile-personal-info-mutating.spec.ts` -- retain the passing Personal Email lifecycle; add Language coverage only if a repeatable baseline strategy is approved.
- `src/pages/MyProfilePage.ts` -- reuse Personal Info navigation.
- `src/utils/applicationFailures.ts` -- retain API and page-error monitoring for supported mutation scenarios.
- `_bmad-output/test-artifacts/my-profile-dry-run-report.md` -- record the Language add/delete/reactivation defect after scope is decided.

- User selected report defect and stop; no further Language records will be created until the backend can reactivate a deleted choice or provide hard-delete test cleanup.

## Tasks & Acceptance

**Execution:**
- [x] `src/tests/my-profile-personal-info-mutating.spec.ts` -- remove the non-repeatable Language lifecycle while retaining the reversible Personal Email test.
- [x] `_bmad-output/test-artifacts/my-profile-dry-run-report.md` -- record the observed delete/re-add API sequence and automation impact.

**Acceptance Criteria:**
- Given the shared employee has an empty visible Language collection, when the retained mutating suite runs, then it does not create or consume a Language choice.
- Given a Language is deleted and an identical Add returns success without restoring the collection entry, when results are reported, then the behavior is identified as a blocking product defect and no repeatable Language lifecycle is claimed.

## Review Triage Log

- `medium`, patched: the documented dry-run command included `@mutating`; it now explicitly excludes that tag.
- `medium`, patched: suite totals mixed dry-run and mutation scopes; totals now state 14 tests across four files and identify the 13-test dry-run subset.
- `low`, patched: execution mode wording appeared contradictory; it now identifies a standalone workflow that used parallel generation subagents.
- `medium`, patched: superseded Arabic creation instructions contradicted the final decision; they were removed.
- `medium`, patched: application-failure validation could be skipped after a body assertion; it now runs from nested cleanup `finally`.
- `medium`, patched: restoration shared the default timeout budget; the mutation test now uses Playwright's slow-test timeout allocation.
- `low`, rejected: cross-machine account locking remains theoretically possible, but this project uses one worker, default CI excludes mutations, and adding distributed locking is disproportionate.
- `low`, rejected: cleanup can replace the primary assertion error; aggregate error plumbing would add complexity without changing restoration safety or pass/fail behavior.
- `medium`, patched: blocked-work acceptance criteria were absent; explicit no-consumption and defect-reporting criteria were added.
- `medium`, patched: the defect report lacked the complete API sequence and safe reproduction guidance; both are now recorded.
- `maybe-false`, deferred: screenshots and Playwright failure artifacts may be replaceable, but no durable artifact retention requirement or target store exists in the repository.
- `low`, patched: the changed-file inventory omitted generated summaries and this specification; they are now listed.
