# Admin Function Verification R2

- Account: same Admin account in production and beta; credentials loaded locally from `.env` and not reproduced here.
- Method: authenticated Chromium, 1920 x 1400 viewport, normal application requests, direct visits to shared routes, 6.5-second initial settle, full-page incremental scroll, and 2.5-second final settle. Read-only interactions only.
- Access date: 2026-09-08.

## Confirmed Production-Visible / Beta-Absent Functions

| Route | Production function | Beta observation | Impact | Confidence | Source / access date |
|---|---|---|---|---|---|
| `/task-timesheet` | `My Team Task` | The page reached its loaded task table state, but this scope tab was absent. Shared controls including `Watched Tasks`, `View My Log`, `Enter Timesheet`, `New Task`, and `Hide Column` were present. | Admins cannot select the team-task scope in beta, preventing parity testing of team task views. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/task-timesheet` | `Over All Task` | The page reached its loaded task table state, but this scope tab was absent. | Admins cannot select the overall-task scope in beta, preventing parity testing of cross-team task views. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/task-timesheet` | `Administration` | The page reached its loaded task table state, but this function/tab was absent. | Task administration behavior available to the production Admin cannot be exercised in beta. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/company/asset-management` | `Category Management` | Asset inventory, charts, filters, table, pagination, `Bulk Upload`, `Add Quantity Stock`, and `Register Asset` loaded, but this tab was absent. | Asset-category configuration cannot be reached from the beta Asset Management page. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/company/asset-management` | `Assignment` | The same beta page loaded normally, but this tab was absent. | Asset assignment workflows cannot be parity-tested from beta. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/company/asset-management` | `Pending Requests` | The same beta page loaded normally, but this tab was absent. | Pending asset requests cannot be reviewed or reproduced in beta from this page. | High | Production and beta authenticated Admin UI, 2026-09-08 |
| `/company/asset-management` | `Analytics` | The same beta page loaded normally, but this tab was absent. | Asset analytics available in production cannot be parity-tested in beta. | High | Production and beta authenticated Admin UI, 2026-09-08 |

## Excluded False Positives

| Route(s) | Apparent difference | Why it is not a confirmed function gap |
|---|---|---|
| `/company/workflow-management` | Production exposed some additional `Edit <role>` labels; the earlier beta inventory showed `Retry`. | With normal requests, beta loaded the shared `Roles`, `Workflows`, `Builder`, `Assignments`, `Workflow Monitor`, `New role`, `Export`, and edit capability. The remaining label differences are role-record data differences, not missing functions. |
| `/company/work-force-insights`, `/attendance/request-approvals/on-duty`, `/leave/configurations/leave-management`, `/payroll/process-payroll`, `/penalty`, `/resolve/queue`, `/resolve/committee`, `/my-profile/probation-review` | Different counts, record identifiers, period labels, policy names, paging controls, or summary-card text. | The corresponding controls/cards loaded in both environments. Differences follow environment data, such as probation `Pending Approvals 1` in production versus `Pending Approvals 0` in beta. |
| `/payroll/grid-format-definitions` | Production showed `Definitions 50`, definition rows, `Edit`, `Delete`, assignment actions, and pagination; beta showed `Definitions 0`. | Shared definition-level controls loaded in both environments. Row actions and pagination were absent only because beta had no definition records, so this is a data-state difference. |
| `/talent-hub/dashboard`, `/talent-hub/requisitions`, `/talent-hub/job-postings`, `/talent-hub/candidates`, `/talent-hub/analytics`, `/talent-hub/settings` | KPI/funnel values, pagination, requisition `Review`/`Post job`, candidate row `Download` and data-backed columns, and connector status strings differed. | Shared page tabs and top-level functions loaded. Production had requisition/candidate records while beta had empty or different data; row-level actions and combined status labels are therefore not evidence of missing beta functions. |
| Several Company and Settings routes | `Sentinel Insight` or `AI Configuration` appeared in production-only text comparisons. | These are sidebar navigation labels, not local functions on the inspected route, and were excluded from local feature parity. |
| `/payroll/manual-component` | `LOP & Payable Days` and `Generate Salary Slip` appeared in production-only comparisons. | These are Payroll sidebar links, not Manual Component page functions. The local page itself loaded in both environments. |

## Coverage Result

No other production-visible/beta-absent local tab or function was confirmed on the requested shared routes: Company Workflow Management, Company Reports, Workforce Insights, Attendance Insights, Attendance Requests, Attendance Reports, Leave Insights, Leave Requests, Leave Configuration, Payroll Process, Grid Definitions, Manual Component, Payroll Reports, Penalty, all five Resolve pages, all nine TalentHub pages, Settings Role/User/Document/Letter, and Profile Requests/Forms/Holidays/News/Surveys/Letter/Probation.

This result concerns visible landing-page functions for this Admin account and tenant state on the access date. It does not assert parity for workflows behind unactivated create, edit, approval, upload, or delete controls.
