# OfficeKit Beta Employee UI Evidence Digest

- Source: `https://betatesting.officekithr.net`
- Access date: 2026-09-08
- Role: authenticated Employee using the supplied environment credentials; no secrets were printed or recorded.
- Method: Playwright via Node, desktop viewport. Every visible left-rail module was opened, including the nested My Profile > Finance accordion. Discovered landing routes were loaded with post-navigation waits, network-idle attempts, scroll-based lazy-load triggering, and up to three retries. No local action, form submission, export, download, edit, delete, save, import, or other data-changing control was activated.

## Navigation And Feature Inventory

### Dashboard

- Navigation: `Dashboard` -> `/`.
- Landing UI: quick-access areas `Leave`, `Attendance`, `Payroll`, `My Holidays`, and `Organization`; sections `Request and Approvals`, `Reports`, `My Team`, and `Feeds`; feed filters `All`, `News`, `Birthdays`, `Anniversaries`; `View punch history` and feed menu controls.

### My Profile

- Sidebar links: `Personal Info` -> `/my-profile/personal-info`; `Requests & Approvals` -> `/my-profile/request-approvals`; `Forms and Policies` -> `/my-profile/forms-policy`; `My Holidays` -> `/my-profile/my-holidays`; `HR Forms & Policies` -> `/my-profile/forms-policiesHR`; `News Feeds` -> `/my-profile/news-feed`; `Surveys & Feedbacks` -> `/my-profile/surveys-feedbacks`; `Organisation` -> `/my-profile/organisation`; `Letter` -> `/my-profile/request-approvals/letter`; `Probation Review` -> `/my-profile/probation-review`.
- Nested `Finance` accordion: `salary slip` -> `/my-profile/finance/salary%20slip`; `payroll report` -> `/my-profile/finance/payroll%20report`. `Finance` itself has no href.
- `Personal Info`: headings for profile completion, basic identity, employment details/dates/policies, and benefits/allowances. Tabs/functions: `Overview`, `Personal`, `Professional`, `Asset Details`, `Audit Information`, `Bank Details`, `Certifications`, `Dependent`, `Languages`, `Letters`, `Qualification`, `Reference`, `Skill Set`, `Communication`, `Documents`, with horizontal tab scrolling.
- `Requests & Approvals`: redirects to `/my-profile/request-approvals/separations/request`. Areas `Separation`, `Loans`, `Advance`, `Claims`; `Request` tab; add request, search, status filter, export, sortable request table, approver viewing, and pagination.
- `Forms and Policies`: `Forms` and `Policies`; sortable form list with view, download, and pagination.
- `My Holidays`: year selector, holiday search, sortable holiday/date/day columns, and pagination.
- `HR Forms & Policies`: `Forms` and `Policies`; add form, sortable document list, view/download/edit/delete, and pagination controls are visibly offered.
- `News Feeds`: `Released News` and `My News`; search, sortable event/news/poster/end-date table, and pagination.
- `Surveys & Feedbacks`: redirects to `/my-profile/surveys-feedbacks/general`. Areas `General`, `FS Checklist`, `Exit Feedback`; search, status filter, view/start survey, rows-per-page, and pagination.
- `Organisation`: headings for employee level, service line, country/location distribution, and leadership. Tabs `Overview`, `Organisation Chart`, `Hierarchy Levels`, `Teams`, `Reports`; export chart and edit controls.
- `Letter`: `Request` and `Direct Posting`; search/status, export, sortable request table, view, PDF download, and pagination.
- `salary slip`: `Salary Slip` and `Monthly Report`, year selection, monthly report cards, and download actions.
- `payroll report`: search, export, and sortable pay-period/type/branch/days/earnings/deductions/gross/net salary columns.
- `Probation Review`: heading `My Probation & Performance Status`; `Overview` and `Manager Review`.

### Company

- Sidebar links: `Workflow Management` -> `/company/workflow-management`; `Asset Management` -> `/company/asset-management`; `Reports` -> `/company/reports`.
- `Workflow Management`: tabs `Roles`, `Workflows`, `Builder`, `Assignments`, `Workflow Monitor`; new role, search, export, sortable role/strategy/applicability/usage table, row editing, rows-per-page, and pagination.
- `Asset Management`: asset inventory/status distribution/aging; `Asset Inventory`, `Bulk Upload`, `Add Quantity Stock`, `Register Asset`; search/status filters, clear filters, sortable inventory, add stock, and pagination.
- `Reports`: searchable report launchers for `Documents Report`, `Entity Change Report`, `New Joinee Report`, `Exit Report`, `Document Expiry Date Report`, `New Joinee Employee report`, and `Exit Employee report`.

### Attendance

- Sidebar links: `Requests & Approvals` -> `/attendance/request-approvals/on-duty`; `Reports` -> `/attendance/reports`.
- `Requests & Approvals`: areas `On Duty`, `Attendance Regularisation`, `Late in / Early out`, `Work Permission`, `Break Permission`; `Request` tab; add request, search, status filter, export, sortable request table, and approvers.
- `Reports`: searchable launchers `Attendance Report` and `Attendance Exception Report`.

### Leave

- Sidebar links: `Leave Insights` -> `/leave-insights`; `Requests & Approvals` -> `/leave/request-approvals/leave-application`; `Reports` -> `/leave/reports`.
- `Leave Insights`: `Self` tab; summary cards for total/approved/pending/rejected leave linking to scoped detail routes; leave trend, type breakdown, and recent requests; search/status, export, sortable table, rows-per-page, and pagination.
- `Requests & Approvals`: areas `Leave Application`, `Leave Cancellation`, `Compensatory Gain`, `Leave Grander`, `Leave Balance`; `Request` and `Approval`; add request, search/status, export, sortable leave table, and approvers.
- `Reports`: heading and search field only; the observed state says `No reports found.`

### PMS

- Direct sidebar link: `PMS` -> `/pms`.
- Landing UI: `Feature Under Development`; no module-local action was visible.

### Task

- Direct sidebar link: `Task` -> `/task-timesheet`.
- Landing UI: `Task & Timesheet Management` and `My Assigned Tasks`; `Watched Tasks`, `View My Log`, `Enter Timesheet`, `New Task`, `Hide Column`, and sortable task/assignee/project/client/priority/watcher/date/status columns.

### TalentHub

- Sidebar links: `Overview` -> `/talent-hub/dashboard`; `New Requisition` -> `/talent-hub/requisitions`; `Job Postings` -> `/talent-hub/job-postings`; `Candidates` -> `/talent-hub/candidates`; `Interviews` -> `/talent-hub/interviews`; `Offers` -> `/talent-hub/offers`; `Analytics` -> `/talent-hub/analytics`; `JD Master` -> `/talent-hub/jd-master`; `Setup` -> `/talent-hub/settings`.
- Common local shell: entity context, period selector (`This month` observed), edit, and `Ask AI` controls recur across TalentHub landings.
- `Overview`: hiring funnel, requisitions needing attention, upcoming interviews; portal, export, new requisition, stage/mode filters, search, and sortable requisition/interview tables.
- `New Requisition`: requisition list; new requisition, stage/period filters, search, export, and sortable requisition/position/stage/approval/budget table.
- `Job Postings`: add job, setup, search/status/period filters, export, and sortable job/origin/opening/applicant/status table.
- `Candidates`: `Talent Pool`, `Pipeline`, `AI Screening`; role/period filters, natural-language candidate query, search, resume import, and sortable candidate contact/role table.
- `Interviews`: `Panel & approval`, `Schedule`, and `Schedule interview`.
- `Offers`: `Offers & Letters`, `Pre-Onboarding`, `Approval chain`, and `Generate offer letter`; observed list state was empty.
- `Analytics`: recruitment analytics, hiring funnel, source effectiveness, period KPI cards, schedule report, and export board pack.
- `JD Master`: add JD and a JD/department/designation/band-grade/file table.
- `Setup`: entity/requisition lookups, approval flow, horizon budget, connectors, and new-requisition fields; save/add/edit/remove/connect/add-field controls. Additional local links are `Entity master` -> `/company/entity-settings`, `Role Access Manager` -> `/settings/role-access-manager`, `Workflow Management` -> `/company/workflow-management`, and `Horizon budget builder` -> `/company/horizon/budget-builder`.

### Settings

- Top-level `Settings` is a visible expandable sidebar control, but opening it exposed no child label/link and did not change `/`.

### AI Insight

- Direct sidebar control: `AI Insight` -> `/hrms-bot`.
- Landing UI: `OfficekitHr AI`; back home, voice toggle/input, history, help, message input/send, and prompts for leave application, leave balance, attendance, and PMS goals.

## Uncertainties And Boundaries

- This is a visibility inventory for one Employee account, tenant configuration, and data state on the access date. Feature flags, permissions, tenant setup, viewport, and records can change labels or availability.
- SPA-local tabs are often buttons without hrefs. Their labels and visible landing functions were recorded, but they were not activated where doing so could open edit/create workflows or risk state mutation.
- Visible controls such as add, edit, delete, save, connect, import, and new request indicate UI exposure, not confirmed authorization or successful operation; none was invoked.
- Probation Review initially displayed a transient `Retry` control during the broad crawl, then loaded `Overview` and `Manager Review` on the explicit recheck. PMS remained an explicit under-development state; Leave Reports remained empty; several TalentHub lists were also empty.
- Top-level Settings may be intentionally empty or tenant/permission dependent. TalentHub Setup's additional local links were recorded but are not left-sidebar module landing routes and were therefore not recursively crawled.
