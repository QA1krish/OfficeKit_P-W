---
title: 'Fix beta navigation locators'
type: 'bugfix'
created: '2026-09-17'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Beta renamed the PMS navigation item to Perform, changed Task into an expandable button with a Task & Timesheet child link, and exposes Claims as a link. Exact stale role/name locators cause seven failures and six serial skips despite the controls being usable manually.

**Approach:** Align the admin, employee, performance-module, and financial-request page objects with the live accessible roles and names, and update test diagnostics from PMS to Perform while retaining the existing destination assertions.

</frozen-after-approval>

## Implementation Notes

- Live beta DOM inspection confirmed Perform is a link to `/pms`, Task is a disclosure button exposing a Task & Timesheet link, and Claims is a link to `/my-profile/claims/request` for the employee account.
- Updated admin and employee page objects and test diagnostics to use Perform; Task navigation now follows the disclosure interaction; financial module selection accepts its existing button form and the current link form.
- Targeted verification exposed two additional stale expectations: Claims now uses `/my-profile/claims/*` routes, and TalentHub is not present in the configured employee's granted sidebar. Updated those expectations while retaining admin TalentHub coverage.
- Claims uses different active styling from Loans and Advance, so module readiness now relies on the selected route, visible module control, and populated/empty list state rather than a historical Tailwind class.
- Beta exposes Claims as a standalone request page without Request/Approval tabs, and the configured admin is redirected from the inferred Claims approval route. Non-mutating Claims coverage now validates the four employee request scenarios; approver workspace coverage remains Loans and Advance.
- Updated the Claims table contract to the live columns: Category, Sub Category, and Description replace the obsolete Applied On column.
- Review hardening excludes Claims from the two-level approval lifecycle that beta does not expose, adds explicit request-only authorization coverage, keeps route detection compatible with the standalone Claims route, and asserts TalentHub remains absent for the configured employee.
- Verification passed: TypeScript, 16 unit tests, 97-test collection, six focused admin/employee navigation tests, and five focused Claims tests.

## Review Triage Log

- `medium` — Claims remained in the mutating two-level approval matrix despite beta exposing no Claims approval workspace; patched by limiting approval lifecycles to Loans and Advance.
- `medium` — request-status route detection only recognized legacy request-approvals URLs; patched to use the page object's route contracts, including standalone Claims routes.
- `medium` — removing Claims from the approver loop left its authorization behavior and dead Claims-only assertions unresolved; patched with explicit request-only coverage and removal of unreachable assertions.
- `low` — employee TalentHub removal lacked a negative permission assertion; patched with an explicit zero-count check.
- `false` — Task could close an already-expanded disclosure; all current callers start from a fresh dashboard and no caller expands Task before `clickTask`.
- `false` — the spec lacked full acceptance sections; one-shot specs intentionally contain only frontmatter, frozen intent, implementation notes, and final review evidence.
