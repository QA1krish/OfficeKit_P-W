# Production Admin UI Inventory (R1)

- Source: https://app.officekithr.net
- Authenticated landing URL: https://app.officekithr.net/hr-dashboard
- Access date: 2026-09-08
- Role: Admin, using the requested environment credentials without exposing them
- Method: headless Playwright via Node; read-only navigation; 1920 x 1400 viewport; sidebar groups expanded; lazy content scrolled into view; network-idle waits, fallback delays, and one retry per module/route
- Scope: visible production Admin UI. Repeated header/profile/notification controls, table sorting, pagination, and record-specific values are omitted from local-function summaries.

## Direct Navigation

- **Dashboard** -> `/hr-dashboard`. Headings/sections: dashboard greeting, Leave, Attendance, Payroll, My Holidays, Organization, Request & Approvals, My Team, Feeds. Functions: View punch history, previous/next day, attendance status cards, View All, Late In / Early Out, Team Leaves, feed filters All/News/Birthdays/Anniversaries.
- **PMS** -> `/pms`. Heading: Feature Under Development. No local actions observed.
- **Task** -> `/task-timesheet`. Headings: Task & Timesheet Management; My Assigned Tasks. Functions: Watched Tasks, My Team Task, Over All Task, Administration, View My Log, Enter Timesheet, New Task, Hide Column.

## My Profile

Navigation:

- Personal Info -> `/my-profile/personal-info`
- Requests & Approvals -> `/my-profile/request-approvals`
- My Holidays -> `/my-profile/my-holidays`
- HR Forms & Policies -> `/my-profile/forms-policiesHR`
- News Feeds -> `/my-profile/news-feed`
- Surveys & Feedbacks -> `/my-profile/surveys-feedbacks`
- Organisation -> `/my-profile/organisation`
- Finance -> expandable group, no href; Salary Slip -> `/my-profile/finance/salary%20slip`
- Letter -> `/my-profile/request-approvals/letter`
- Probation Review -> `/my-profile/probation-review`

Landing evidence:

- `/my-profile/personal-info` — Headings: profile identity, Profile Completion, Basic Identity, Employment Details, Employment Dates & Policies, Benefits & Allowances. Local sections/buttons: Overview, Personal, Professional, Asset Details, Audit Information, Bank Details, Letters, Qualification, Skill Set, Communication, Documents.
- `/my-profile/request-approvals` -> `/my-profile/request-approvals/separations/request` — Heading: Request & Approvals. Functions: Separation, Loans, Advance, Claims; Request, Proxy, Approval, Direct Posting, Resignation Editing; Add Request, All, Export, View.
- `/my-profile/my-holidays` — Heading: My Holidays. Year selector/table only; no additional feature action observed.
- `/my-profile/forms-policiesHR` — Heading: Forms and Policies. Functions: Forms, Policies, Add Form.
- `/my-profile/news-feed` — Heading: News Feeds. Functions: Released News, My News.
- `/my-profile/surveys-feedbacks` -> `/my-profile/surveys-feedbacks/general` — Heading shown as Request & Approvals. Functions: General, FS Checklist, Exit Feedback, All, View.
- `/my-profile/organisation` — Headings: Organisation, Employees by level/service line, Distribution by country & location, Leadership. Tabs: Overview, Organisation Chart, Hierarchy Levels, Teams, Reports. Actions: Export Chart, Edit.
- `/my-profile/finance/salary%20slip` — Headings: Salary Slip, Monthly Reports. Functions: Salary Slip, Monthly Report, Download.
- `/my-profile/request-approvals/letter` — Heading: Request & Approvals. Functions: Request, Direct Posting, All, Export.
- `/my-profile/probation-review` — Headings: Probation Review, overview/analytics, monthly trend, outcome distribution, competency ratings. Tabs: Overview, Probation Reviews, Manual Nudge, Probation Reports. Functions: Last 6 Months, Last 12 Months, Refresh, Pending Approvals, Overdue Action, Review Completed.

## Company

Navigation:

- Employee Information -> expandable group: Employee Directory -> `/company/employee-information/employee-directory`; Employee Reporting -> `/company/employee-information/employee-reporting`
- Lifecycle Management -> expandable group: Transfer Or Promotion -> `/company/lifecycle-management`; Lifecycle Master -> `/company/lifecycle-management/master`; Lifecycle Upload -> `/company/lifecycle-management/upload`; Lifecycle Revoke -> `/company/lifecycle-management/revoke`
- Workflow Management -> `/company/workflow-management`
- Asset Management -> `/company/asset-management`
- Reports -> `/company/reports`
- Report Builder -> expandable group: Overview -> `/company/report-builder/overview`; AI Report Copilot -> `/company/report-builder/copilot`; Report Builder -> `/company/report-builder/builder`; Template Library -> `/company/report-builder/library`
- Officekit Horizon -> expandable group: Overview -> `/company/horizon/dashboard`; Budget Builder -> `/company/horizon/budget-builder`; Budget vs Actual -> `/company/horizon/budget-vs-actual`
- Work Force Insights -> `/company/work-force-insights`
- Sentinel Insight -> `/ras`

Landing evidence:

- `/company/employee-information/employee-directory` — Heading: All Employees. Functions: Bulk Actions, Add Employee, status/type filters, Export.
- `/company/employee-information/employee-reporting` — Heading: Employee Reporting. Functions: Import, employment-type filter, Export.
- `/company/lifecycle-management` — Heading: Transfer Or Promotion. Functions: View Analytics, Apply Transfer and Promotion, Pending, Export.
- `/company/lifecycle-management/master` — Heading: Transfer Or Promotion. Functions: View Analytics, Create Master, Export, Edit.
- `/company/lifecycle-management/upload` — Heading: Transfer Or Promotion. Functions: View Analytics, Upload Data, Export.
- `/company/lifecycle-management/revoke` — Heading: Transfer Or Promotion. Functions: View Analytics, Eligible for Revoke, Revoked History, Export.
- `/company/workflow-management` — Heading: Workflow. Tabs: Roles, Workflows, Builder, Assignments, Workflow Monitor. Functions: New role, Export, Edit.
- `/company/asset-management` — Headings: Asset Inventory, Status Distribution, Asset Aging. Functions: Asset Inventory, Category Management, Assignment, Pending Requests, Reports, Analytics, Bulk Upload, Add Quantity Stock, Register Asset, status filter, Clear Filters.
- `/company/reports` — Heading: Company Reports. Functions: Documents Report, Entity Change Report, New Joinee Report, Exit Report, Document Expiry Date Report, New Joinee Employee report, Exit Employee report.
- `/company/report-builder/overview` — Headings/functions: Create a Report, AI Report Copilot, Build from Scratch, Use an existing Template, Recent reports, Data sources, View all.
- `/company/report-builder/copilot` — Heading: AI Report Copilot. Functions: History, Send message, Save to library, Download, Open in Builder.
- `/company/report-builder/builder` — Headings: Report Studio, Field Palette, Report layout, Untitled Report, Preview. Tabs: Table, Chart. Functions: Tour, Calculated field, Clear, Save to library, date mode/range controls, data-source filters, Download, Expand preview, Ask AI, Back, Next.
- `/company/report-builder/library` — Heading: Template Library. Functions: Ask Copilot, All.
- `/company/horizon/dashboard` — Headings: Manpower Budget Overview, Budget vs Actual vs Forecast, Variance by department, Headcount bridge. Functions: Export board pack, Refresh actuals.
- `/company/horizon/budget-builder` — Headings: Budget Builder, Budget Lists. Functions: Budget Builder, Forecast & scenario, Create budget, period/year/month filters, Delete budget.
- `/company/horizon/budget-vs-actual` — Heading: Budget vs Actual. Functions: Budget vs Actual, Deviations, Risk & Opportunities, Export CSV.
- `/company/work-force-insights` — Headings: Workforce Insights; age, gender, entity, team pulse, headcount, turnover, absence, tenure, key insights. Tabs: Team Insight, Exit Insight. Function: Refresh. Drill-down links observed for headcount, present, late, on leave, pending approvals, new joins, and exits.
- `/ras` — Heading: Operational Risk Dashboard. Functions: Scan now, Attrition, Payroll Accuracy, Compliance, Engagement, Operations, Asset Clearance, Fit view, Edit.

## Attendance

Navigation:

- Attendance Insights -> `/attendance-insights`
- Requests & Approvals -> `/attendance/request-approvals/on-duty`
- Configurations -> expandable group, no href: Shift Desk -> `/attendance/shift-management/shift-desk`; Policy Desk -> `/attendance/shift-management/policy-desk`
- Reports -> `/attendance/reports`

Landing evidence:

- `/attendance-insights` — Headings: Attendance Insights, Attendance Trend, Recent Attendance Activity. Tabs: Self, My Team, Entity. Functions: All, Export. Drill-down links: late arrivals, absences, punctuality.
- `/attendance/request-approvals/on-duty` — Heading: Request & Approvals. Functions: On Duty, Attendance Regularisation, Late in / Early out, Work Permission, Break Permission; Request, Proxy, Approval; Add Request, Pending, Export, View.
- `/attendance/shift-management/shift-desk` — Headings: Shift Desk, Shift Library. Functions: More, Assign Shift, Create Shift, Edit, Weekends, Quick Assign, Export, Card/List view, ordering/filter controls, Delete, Assign.
- `/attendance/shift-management/policy-desk` — Headings: Policy Desk, Policy Library. Functions: Assign Policy, Create Policy, Edit, Export, Card/List view, ordering/filter controls, Delete, View Details, Assign.
- `/attendance/reports` — Heading: Attendance Reports. Functions: Attendance Report, Attendance Exception Report.

## Leave

Navigation:

- Leave Insights -> `/leave-insights`
- Requests & Approvals -> `/leave/request-approvals/leave-application`
- Configurations -> `/leave/configurations/leave-management`
- Reports -> `/leave/reports`

Landing evidence:

- `/leave-insights` — Headings: Leave Insights, Leave Trend, Leave Type Breakdown, Recent Leave Requests. Tabs: Self, My Team, Entity. Functions: All, Export. Drill-down links: total, approved, pending, rejected.
- `/leave/request-approvals/leave-application` — Heading: Request & Approvals. Functions: Leave Application, Leave Cancellation, Compensatory Gain, Leave Grander, Leave Balance; Request, Proxy, Approval, Direct Posting; Add Request, Pending, Export.
- `/leave/configurations/leave-management` — Headings: Leave Settings, utilization, absence trend, carry-forward liability, coverage heatmap, balance summary, approvals, cancellations, comp-off, assignment coverage. Functions: country selector, Leave Masters, Leave Policies, Policy Assignments, Basic Settings Assignments, Analytics, Leave Master, Leave Policies, Policy Assignment, Basic Settings Assignment, AI Policy Advisor, Leave Copilot.
- `/leave/reports` — Heading: Leave Reports. No visible local action loaded.

## Payroll

Navigation:

- Process Payroll -> `/payroll/process-payroll`
- Masters -> expandable group: Pay Period Master -> `/payroll/pay-period-master`; Paycode Master -> `/payroll/pay-code-master`
- Amendments -> expandable group: Manual Component -> `/payroll/manual-component`; LOP & Payable Days -> `/payroll/lop-payable-days`; Generate Salary Slip -> `/payroll/salary-slip-generate`
- CompIQ -> expandable group: Payscale Designer -> `/payroll/compiq/payscale-designer`; Payscale Studio -> `/payroll/compiq/pay-studio`
- Grid Format Master -> `/payroll/grid-format-definitions`
- Reports -> `/payroll/payroll-reports`
- Compliance -> expandable group: Rule Engine -> `/payroll/pay-compliance/rule-engine`; Calendar -> `/payroll/pay-compliance/calendar`; Filings & Challans -> `/payroll/pay-compliance/filings`; Reports -> `/payroll/pay-compliance/analytics`
- Penalty -> `/penalty`

Landing evidence:

- `/payroll/process-payroll` — Heading: Payroll Process. Functions: payroll basis/year/period selectors, Proceed To Next Step, All Drafts, Review, Approved, Cancelled, Completed, Toggle filters, Export, View, Edit, More actions.
- `/payroll/pay-period-master` — Heading: Pay Period. Functions: Add Pay Period, Pay Periods, Analytics.
- `/payroll/pay-code-master` — Heading: Pay Code Master. Functions: Add Pay Code Batch, Pay Code Batches, Analytics.
- `/payroll/manual-component` — Heading: Manual Component. No additional visible local action loaded.
- `/payroll/lop-payable-days` — Heading: LOP / Payable Days Editor. Functions: LOP Count, Bulk Upload.
- `/payroll/salary-slip-generate` — Heading: Generate Salary Slip. No additional visible local action loaded.
- `/payroll/compiq/payscale-designer` — Headings: Payscale Designer, Selected Parameters, Available Components, AI Suggested Pay Split. Functions: Templates & Drafts, Metro/Non-Metro, Annual, Recalculate Split, Pay Code, Compliance, Rebalance, Save as Draft, Save & Continue.
- `/payroll/compiq/pay-studio` — Functions: Pay Studio, Approvals, Bulk Assign, Existing, New Hire, employee search. No visible heading was exposed.
- `/payroll/grid-format-definitions` — Heading: Grid Format Definitions. Functions: Describe with AI, New Definition, Definitions, Batch Assignments, Export.
- `/payroll/payroll-reports` — Heading: Payroll Reports. Functions: EPF, ESI, Gratuity, LWF, LWF Summary, PT, PT Kerala, PT Summary, Bank, Statutory Summary, Payroll Monthly CTC, Payroll Reconciliation, Payscale Monthly, Salary Slip, YTD Summary reports.
- `/payroll/pay-compliance/rule-engine` — Headings: Payroll Compliance, Batch & Slab, Components. Functions: Country Rule Engine, Calculation Preview, country/company selector, Add Default Components, Add Component, statutory component cards.
- `/payroll/pay-compliance/calendar` — Headings: Compliance Calendar, Filters, current month. Functions: Calendar Config, Generate Obligations, country/status filters, Today, previous/next month, Month/Agenda views, Upcoming, Due Soon, Overdue, Filed, Filed Late.
- `/payroll/pay-compliance/filings` — Headings: Filing Management, Record a Filing. Functions: Filing History, Upload, Save Filing.
- `/payroll/pay-compliance/analytics` — Headings/functions: Compliance Analytics, Compliance Overview, Calendar & Filings, Challans, Labor Audits, Regulatory Updates, Risk & Predictions, Liability Report, Compliance Reports.
- `/penalty` — Headings: Penalty Rule, New Policy, annual penalty, Policy assignments. Functions: Penalty Rule, Rule Builder, Scenario Library, Simulate & Preview, Employee Policy View, Payroll Output, Analytics, Import template, New Policy, Export.

## Resolve

Navigation:

- My Tickets -> `/resolve/my-tickets`
- Resolution Queue -> `/resolve/queue`
- Committee Cases -> `/resolve/committee`
- Resolution Analytics -> `/resolve/analytics`
- Workflow & Categories -> `/resolve/config`

Landing evidence:

- `/resolve/my-tickets` — Heading: My Tickets. Functions: Raise a Ticket, All, Open, Pending Employee, Resolved, Closed, Export, Delete ticket.
- `/resolve/queue` — Heading: Resolution Queue. Functions: All, Open, In Progress, Pending Employee, Escalated; All Time, Today, This Month, This Year, Last 30 Days.
- `/resolve/committee` — Heading: Committee Cases. Functions: All, Under Review, Closed.
- `/resolve/analytics` — Headings: Resolution Analytics, ticket volume by category, status mix, priority mix, volume by sub-category. Functions: date range, More options.
- `/resolve/config` — Headings: Workflow & Categories, Categories, Sub-categories. Functions: Categories, TAT Matrix, Escalation Matrix, Committees, Category Routing, Workflow Assign, category selectors.

## TalentHub

Navigation:

- Overview -> `/talent-hub/dashboard`
- New Requisition -> `/talent-hub/requisitions`
- Job Postings -> `/talent-hub/job-postings`
- Candidates -> `/talent-hub/candidates`
- Interviews -> `/talent-hub/interviews`
- Offers -> `/talent-hub/offers`
- Analytics -> `/talent-hub/analytics`
- JD Master -> `/talent-hub/jd-master`
- Setup -> `/talent-hub/settings`

Landing evidence:

- `/talent-hub/dashboard` — Headings: Overview, Hiring funnel, Requisitions needing attention, Upcoming interviews. Functions: Edit, period selector, Portal, Export, New Requisition, funnel stages, stage/mode filters, Ask AI. Summary cards link to requisitions, candidates, analytics, and offers.
- `/talent-hub/requisitions` — Headings: New Requisition, Requisition list. Functions: Edit, period selector, New Requisition, stage filter, Export, Review, Post job, Ask AI.
- `/talent-hub/job-postings` — Headings: Job Postings, Job postings. Functions: Edit, period selector, Add job, Setup, All, Export, Ask AI.
- `/talent-hub/candidates` — Heading: Candidates. Functions: Edit, period selector, Talent Pool, Pipeline, AI Screening, job-role filter, Import resumes, Download, Ask AI.
- `/talent-hub/interviews` — Heading: Interviews. Functions: Edit, period selector, Panel & approval, Schedule, Ask AI.
- `/talent-hub/offers` — Functions: Edit, period selector, Offers & Letters, Pre-Onboarding, Approval chain, Generate offer letter, Ask AI. No visible heading was exposed.
- `/talent-hub/analytics` — Headings: Recruitment Analytics, Hiring funnel, Source effectiveness. Functions: Edit, period selector, Schedule report, Export board pack, funnel/source cards, Ask AI.
- `/talent-hub/jd-master` — Heading: JD Master. Functions: Edit, period selector, Add JD, Ask AI.
- `/talent-hub/settings` — Headings: Setup, requisition lookups, Entity, Business Vertical, Country, Branch, Location, Department, Division, Band, Grade, Designation, Gender, Approval flow, Horizon budget, Connectors, New Requisition fields. Functions: Edit, period selector, Save settings, Add/Edit/Remove, Connect, Add field, Ask AI. Local links: Entity master -> `/company/entity-settings`; Role Access Manager -> `/settings/role-access-manager`; Workflow Management -> `/company/workflow-management`; Horizon budget builder -> `/company/horizon/budget-builder`.

## Settings

Navigation:

- Role Access Manager -> `/settings/role-access-manager`
- User Settings -> `/settings/user-settings`
- Document Settings -> `/settings/doc-settings`
- Letter Configuration -> `/settings/letter-configuration`
- HR Operations -> expandable group: Core Entity Settings -> `/company/entity-settings/entity-linking`; Common Masters -> `/company/entity-settings/common-masters`; General Categories -> `/company/entity-settings/general-categories`; Employee Reference -> `/company/entity-settings/employee-reference`
- AI Configuration -> `/settings/ai-configuration`

Landing evidence:

- `/settings/role-access-manager` — Heading: Role Access Manager. Functions: Add Role, Edit.
- `/settings/user-settings` — Heading: User Settings. Functions: All, Export, Edit.
- `/settings/doc-settings` -> `/settings/doc-settings/documents` — Heading: Document Settings. Functions: Assign Document, Documents, Document Upload, Add Document, Edit document, Delete document.
- `/settings/letter-configuration` — Heading: Letters. Function: Create Letter.
- `/settings/ai-configuration` — Headings: AI Configuration, AI Providers. Functions: provider/key/feature status cards, Usage Analytics View, Providers & Keys, Models, Feature Mapping, Rate Limits & Budgets, Alerts, Usage Analytics, Audit Log, Add Provider, Enable, Manage Keys.
- `/company/entity-settings/entity-linking` — Headings: Core Entity Settings, Entity hierarchy. Functions: Entity Linking, Entity Master, Sub-Entity Master, Entity Parameters, guided tour/follow mode, Whole tree, Fullscreen, Graph/List, level roster views, Edit, zoom, Fit View.
- `/company/entity-settings/common-masters` — Heading: Common Masters. Functions: Common Master, Branch, Employee Status, Religion, Add, View/Edit/Delete.
- `/company/entity-settings/general-categories` — Heading: General Categories. Functions: General Category, General Subcategory, Add, Manage fields, View/Edit/Delete.
- `/company/entity-settings/employee-reference` — Heading: Employee Reference. Functions: Dependent Master, Consultant Details, Add, View/Edit/Delete.

## Uncertainties And Limits

- Inventory reflects controls visible to this production Admin account on 2026-09-08; tenant configuration, permissions, data state, responsive layout, and feature flags may alter visibility.
- Eight expandable left-rail modules were visible: My Profile, Company, Attendance, Leave, Payroll, Resolve, TalentHub, Settings. `AI Insight` was visible in the global header, not the left sidebar, and was excluded as requested.
- Expandable group rows have no href; their nested link hrefs are recorded. No navigation group or local action was activated except read-only sidebar expansion and URL visits.
- Some visual tabs are implemented as ordinary buttons rather than ARIA tabs. They are listed under local functions where semantic tab metadata was absent.
- Routes that redirected are shown with both source and final paths. Empty-function findings mean no additional visible control loaded after scroll/wait/retry, not proof that the feature has no conditional or deeper functionality.
- Action labels such as Add, Edit, Delete, Save, Approve, and Export were inventoried but never activated. No forms were submitted other than the authentication action; no PIN/password, resignation, approval, rejection, or data mutation was attempted.
