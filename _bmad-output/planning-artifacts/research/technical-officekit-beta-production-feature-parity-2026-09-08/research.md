---
title: 'Technical research: OfficeKit beta-production feature parity'
type: 'technical'
topic: 'OfficeKit beta production feature parity'
decision: 'Identify production-only tabs and functions that prevent issue reproduction in beta'
source: 'Authenticated beta and production UI inventories'
status: complete
preset: standard
validation: normal
claims_verified: 5
claims_unverified: 1
created: '2026-09-08'
updated: '2026-09-08'
---

# OfficeKit beta and production feature parity

## Executive Summary

A comparison using the same Admin account confirmed **16 production capabilities that beta does not expose in the same way**: eight sidebar navigation entries are missing even though their beta routes work, one feature (`AI Configuration`) is unavailable in beta, and seven page-level Task and Asset functions are absent. The beta `Organisation` page also contains no usable organization data, which can prevent QA from reproducing data-dependent issues. [1][2]

The Employee comparison found **no confirmed build-level omission**. The production and beta Employee accounts are different and have materially different UI exposure. Routes for Employee navigation items shown only in production load in beta when entered directly. Beta redirects team-scope URLs to self scope for the beta account. Treat these as potentially role-, tenant-, hierarchy-, feature flag-, or account-configuration differences until DEV supplies matched accounts. [3][4]

The initial crawl produced 23 false positives because it did not fully expand nested menus. QA rechecked these results and removed them from the final gap list. [1]

## Recommendations for DEV

1. Restore the eight missing Admin sidebar entries or confirm that feature flags intentionally disable them. The direct beta routes already work, so route deployment is not the blocker.
2. Deploy or enable `/settings/ai-configuration` in beta, including its sidebar permission, because it is the only confirmed unavailable production feature.
3. Align Task and Asset Management feature flags or permissions so that beta renders the seven production controls for the same Admin account.
4. Seed beta with `Organisation` data or connect the page to an appropriate data source before asking QA to reproduce organization, hierarchy, leadership, reporting, or export defects.
5. Provide one Employee identity mirrored across production and beta with the same role, manager hierarchy, role-access policy, and feature flags. Do not classify current Employee menu differences as build defects before this is done.
6. Add an environment-parity smoke check that compares expected navigation manifests per role after every beta deployment.

## Open questions

- Are the missing Horizon, Sentinel, Payroll Masters, and Payroll Amendments links intentionally disabled in beta, or omitted accidentally?
- Is AI Configuration intentionally production-only?
- Are Task and Asset tabs controlled by feature flags separate from role access?
- Which back end or data source causes beta Organisation to return zero entities for the same Admin?
- Can DEV provide the same Employee ID and role-access configuration in both environments?

## Verification limits

Verification covered rendered UI and direct-route behavior as of September 8, 2026. QA did not run create, edit, approve, or delete workflows, so parity behind those controls remains unverified. Any release, role change, feature flag update, or tenant data refresh can invalidate these results. Re-run the comparison after each beta deployment and before closing a parity ticket.

## Confirmed Admin Gaps

### A. Feature unavailable in beta

| Priority | Module | Production capability | Production route | Beta result | Replication impact |
| --- | --- | --- | --- | --- | --- |
| P0 | Settings | AI Configuration | `/settings/ai-configuration` | No sidebar entry; direct route displays `404 Page not found`. | Provider/key/model mapping, budgets, alerts, usage analytics, and audit-log issues cannot be reproduced in beta. |

### B. Navigation missing, feature route still works

These findings indicate beta navigation defects or feature flag or menu configuration gaps, not missing implementations. Each listed route rendered functional beta content when opened directly. [1]

| Priority | Module/branch | Missing beta navigation item | Direct beta route | Replication impact |
| --- | --- | --- | --- | --- |
| P1 | Company > Officekit Horizon | Overview | `/company/horizon/dashboard` | Users cannot discover Manpower Budget Overview from beta navigation. |
| P1 | Company > Officekit Horizon | Budget Builder | `/company/horizon/budget-builder` | Budget creation, forecasts, and scenarios are hidden from beta navigation. |
| P1 | Company > Officekit Horizon | Budget vs Actual | `/company/horizon/budget-vs-actual` | Variance, deviation, and risk/opportunity views are hidden from beta navigation. |
| P1 | Company | Sentinel Insight | `/ras` | Operational Risk Dashboard cannot be reached from beta navigation. |
| P1 | Payroll > Masters | Pay Period Master | `/payroll/pay-period-master` | Pay-period setup issues cannot be followed through the normal beta menu. |
| P1 | Payroll > Masters | Paycode Master | `/payroll/pay-code-master` | Pay-code batch setup is hidden from beta navigation. |
| P1 | Payroll > Amendments | LOP & Payable Days | `/payroll/lop-payable-days` | LOP/payable-day editing and bulk-upload flows are hidden. |
| P1 | Payroll > Amendments | Generate Salary Slip | `/payroll/salary-slip-generate` | Salary-slip generation cannot be reached through beta navigation. |

### C. Page-level functions absent in beta

The shared route loads in both environments for the same Admin account, but beta does not render the control available in production. [2]

| Priority | Route | Production-only function/tab | Replication impact |
| --- | --- | --- | --- |
| P1 | `/task-timesheet` | My Team Task | Team-task view issues cannot be reproduced. |
| P1 | `/task-timesheet` | Over All Task | Cross-team/global task issues cannot be reproduced. |
| P1 | `/task-timesheet` | Administration | Task administration issues cannot be reproduced. |
| P1 | `/company/asset-management` | Category Management | Asset-category configuration issues cannot be reproduced. |
| P1 | `/company/asset-management` | Assignment | Asset assignment workflows cannot be reproduced. |
| P1 | `/company/asset-management` | Pending Requests | Pending asset request review cannot be reproduced. |
| P1 | `/company/asset-management` | Analytics | Asset analytics issues cannot be reproduced. |

### D. Data parity issue

| Priority | Route | Production | Beta | Replication impact |
| --- | --- | --- | --- | --- |
| P1 | `/my-profile/organisation` | 45 employees, 9 service lines/teams, 19 hierarchy levels, 1 location, populated distributions and leadership. | 0 employees, 0 teams/service lines, 0 hierarchy levels, 0 locations, `No data for this report`, and no leadership data. | Organisation chart, hierarchy, team, reporting, export, leadership, and edit defects may not reproduce even though the page structure exists. |

The rendered data difference is verified; its cause is not. DEV should compare beta organization APIs, tenant seed data, scope configuration, and permissions before classifying the difference as a front-end defect. [1]

## Items not classified as beta gaps

### Employee differences requiring matched accounts

None of the following Employee differences is confirmed as a beta build gap because the comparison used different Employee accounts in production and beta. [3][4]

| Area | Production Employee | Beta Employee | Verification result |
| --- | --- | --- | --- |
| Resolve | Module and five child pages visible. | Menu absent; `/resolve/my-tickets`, `/resolve/queue`, `/resolve/committee`, `/resolve/analytics`, and `/resolve/config` render functional pages. | Feature deployed in beta; likely role or menu entitlement difference. |
| Attendance Insights | Sidebar entry; `Self` and `My Team`. | Sidebar entry absent; `/attendance-insights` renders `Self`, and `/attendance-insights?scope=team` redirects to `scope=self`. | Beta account lacks team scope. |
| Leave Insights | `Self` and `My Team`. | `Self` only; `/leave-insights?scope=team` redirects to `scope=self`. | Reporting-hierarchy or permission difference. |
| Attendance Requests & Approvals | `On Duty`, `Late in / Early out`, `Break Permission`; `Request`, `Approval`. | Adds `Attendance Regularisation`, `Work Permission`; no visible `Approval`. | Different account permissions/configuration. |
| Leave Requests & Approvals | Four shared categories; `Request`. | Adds `Leave Balance` and `Approval`. | Different account permissions/configuration. |
| Profile Requests & Approvals | `Separation`; `Request`. | Adds `Loans`, `Advance`, `Claims`. | Different account permissions/configuration. |
| Beta-only modules | Not visible: Company, Task, Settings. | Company, Task, Settings visible. | Strong evidence that accounts are not permission-equivalent. |
| Beta-only profile navigation | Not visible. | Organisation, Letter, Finance, Probation Review visible. | Account/tenant permission difference. |

### Rechecked false positives

Do not report the following production functions as missing; they are available in beta: [1][2]

- Company Employee Directory and Employee Reporting.
- Lifecycle Transfer/Promotion, Master, Upload, and Revoke.
- Company Report Builder Overview, Copilot, Builder, and Template Library.
- Attendance Shift Desk and Policy Desk.
- Payroll CompIQ Payscale Designer and Payscale Studio.
- Payroll Compliance Rule Engine, Calendar, Filings & Challans, and Reports.
- Settings HR Operations: Core Entity Settings, Common Masters, General Categories, and Employee Reference.
- My Profile Finance Salary Slip.
- Shared Workflow, Insights, Requests/Approvals, Leave Configuration, Payroll Process, Grid Definition, Penalty, Resolve, TalentHub, and standard Settings landing-page functions.

## Copy-ready DEV message

> QA compared OfficeKit production (`app.officekithr.net`) and beta (`betatesting.officekithr.net`) on 8 Sep 2026. Using the same Admin account, beta is missing eight menu entries whose direct routes work, AI Configuration is unavailable/404, seven Task/Asset page functions are absent, and Organisation has no usable data. These gaps prevent production issues in those areas from being reproduced through normal beta workflows. Employee findings are not yet classified as build gaps because production and beta used different Employee accounts with different UI exposure. Please review the attached route/function table, align beta feature/menu configuration and data, and provide matched Employee access for a final parity pass.

## Source appendix

| Ref | Evidence | Source | Published | Accessed | Confidence |
| --- | --- | --- | --- | --- | --- |
| [1] | Navigation, direct-route, AI Configuration, and `Organisation` verification with the same Admin account | [Production OfficeKit](https://app.officekithr.net) and [Beta OfficeKit](https://betatesting.officekithr.net) | Live application | 2026-09-08 | High for rendered UI; medium for causes |
| [2] | Shared-route function verification with the same Admin account | [Production OfficeKit](https://app.officekithr.net) and [Beta OfficeKit](https://betatesting.officekithr.net) | Live application | 2026-09-08 | High |
| [3] | Production Employee inventory and beta direct-route verification | [Production OfficeKit](https://app.officekithr.net) and [Beta OfficeKit](https://betatesting.officekithr.net) | Live application | 2026-09-08 | High for UI behavior |
| [4] | Attribution limits caused by unmatched Employee accounts | Authenticated account comparison | Live application | 2026-09-08 | Root-cause attribution not verified |
