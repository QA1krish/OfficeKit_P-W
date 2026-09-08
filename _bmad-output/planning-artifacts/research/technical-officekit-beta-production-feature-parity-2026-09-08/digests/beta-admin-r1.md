# Beta Admin UI inventory (round 1)

- Source: authenticated Admin UI at `https://betatesting.officekithr.net`
- Access date: `2026-09-08`
- Method: Playwright/Chromium via Node, desktop viewport. Each visible sidebar module was clicked with lazy-load waits; 47 unique discovered landing URLs were visited. Navigation failures would have been retried, and sparse/redirected results are called out below.
- Safety: only the login form was submitted. After authentication, `POST`, `PUT`, `PATCH`, and `DELETE` were blocked at the browser context; 126 attempted `POST` requests were blocked. No action that could approve, reject, edit, delete, create, upload, save, change credentials/PIN, or resign an admin was clicked.
- Scope convention: repeated app-shell controls (sidebar, user/header controls, pagination, generic column sorting) are not repeated for every page. Sort/filter/export/pagination capabilities are summarized where locally visible.

## Direct sidebar navigation

### Dashboard

- Navigation: `Dashboard` -> `/hr-dashboard`.
- Headings/areas: greeting; Leave, Attendance, Payroll, My Holidays, Organization quick access; Request & Approvals; My Team; Feeds.
- Functions: View punch history; previous/next day; Present/Absent/Late status filters; View All; Late In / Early Out; Team Leaves; feed filters All, News, Birthdays, Anniversaries.

### PMS

- Navigation: `PMS` -> `/pms`.
- Heading/state: `Feature Under Development`; no local action surfaced.

### Task

- Navigation: `Task` -> `/task-timesheet`.
- Headings: `Task & Timesheet Management`, `My Assigned Tasks`.
- Functions: Watched Tasks, View My Log, Enter Timesheet, New Task, Hide Column; sorting by ID, Task, Employee Code, Assignee, Project, Client, Priority, Watchers, Start Date, End Date, Status.

## My Profile

- Navigation: Personal Info -> `/my-profile/personal-info`; Requests & Approvals -> `/my-profile/request-approvals`; Forms and Policies -> `/my-profile/forms-policy`; My Holidays -> `/my-profile/my-holidays`; HR Forms & Policies -> `/my-profile/forms-policiesHR`; News Feeds -> `/my-profile/news-feed`; Surveys & Feedbacks -> `/my-profile/surveys-feedbacks`; Organisation -> `/my-profile/organisation`; Letter -> `/my-profile/request-approvals/letter`; Probation Review -> `/my-profile/probation-review`.
- `/my-profile/personal-info`: profile name plus Profile Completion, Basic Identity, Employment Details, Employment Dates & Policies, Benefits & Allowances. Local sections: Overview, Personal, Professional, Asset Details, Audit Information, Bank Details, Certifications, Dependent, Languages, Letters, Qualification, Reference, Skill Set, Communication, Documents; horizontal scroll controls.
- `/my-profile/request-approvals` redirected to `/my-profile/request-approvals/separations/request`. Heading `Request & Approvals`. Tabs/sections: Separation, Loans, Advance, Claims; Request, Proxy, Approval, Direct Posting, Resignation Editing. Functions: + Add Request, All filter, Export, View, sortable request table, pagination.
- `/my-profile/forms-policy`: heading `Forms and Policies`; Forms and Policies views; sorting by Form Title and Description.
- `/my-profile/my-holidays`: heading `My Holidays`; year selector (2026 observed); sorting by Holidays, From Date, To Date, No of Days.
- `/my-profile/forms-policiesHR`: heading `Forms and Policies`; Forms and Policies views; Add Form, View, Download, Edit, Delete; sortable document table and pagination.
- `/my-profile/news-feed`: heading `News Feeds`; Released News and My News views; sortable feed table and pagination.
- `/my-profile/surveys-feedbacks` redirected to `/my-profile/surveys-feedbacks/general`. Displayed heading was `Request & Approvals`. Tabs/sections: General, FS Checklist, Exit Feedback; All filter, View, page-size control, pagination.
- `/my-profile/organisation`: route loaded but exposed no page-local heading, tab, action, or link beyond the module navigation.
- `/my-profile/request-approvals/letter`: heading `Request & Approvals`; Request and Direct Posting views; All filter, Export, View, Download as PDF; sortable request table and pagination.
- `/my-profile/probation-review`: headings `Probation Review`, `Probation Overview & Analytics Live DB Model`, `Monthly Review & Confirmation Trend`, `Outcome Distribution Split`, `Competency Category Average Ratings`. Tabs: Overview, Probation Reviews, Manual Nudge, Probation Reports. Functions: Last 6 Months, Last 12 Months, Refresh.

## Company

- Navigation: Work Force Insights -> `/company/work-force-insights`; Workflow Management -> `/company/workflow-management`; Asset Management -> `/company/asset-management`; Reports -> `/company/reports`.
- `/company/work-force-insights`: headings Workforce Insights, Age distribution, Gender diversity, By entity, Team pulse, Headcount trend, Turnover by entity, Absence rate trend, Tenure distribution, Key insights. Tabs: Team Insight, Exit Insight. Functions: Refresh and drilldowns for Total employees, Present today, Late today, On leave, Pending approvals, New joins, Exits.
- `/company/workflow-management`: heading `Workflow`. Tabs: Roles, Workflows, Builder, Assignments, Workflow Monitor. Functions: New role and Retry.
- `/company/asset-management`: headings Asset Inventory, Status Distribution, Asset Aging. Functions: Asset Inventory, Bulk Upload, Add Quantity Stock, Register Asset, status filter, Clear Filters, Add Stock; sortable asset table and pagination.
- `/company/reports`: heading `Company Reports`. Report functions: Documents Report, Entity Change Report, New Joinee Report, Exit Report, Document Expiry Date Report, New Joinee Employee report, Exit Employee report.

## Attendance

- Navigation: Attendance Insights -> `/attendance-insights`; Requests & Approvals -> `/attendance/request-approvals/on-duty`; Reports -> `/attendance/reports`.
- `/attendance-insights`: headings Attendance Insights, Attendance Trend, Recent Attendance Activity. Tabs: Self, My Team, Entity. Functions: Late Arrivals, Absents and Punctuality drilldowns; All filter, Export, sortable attendance table, rows-per-page and pagination.
- `/attendance/request-approvals/on-duty`: heading `Request & Approvals`. Tabs/sections: On Duty, Attendance Regularisation, Late in / Early out, Work Permission, Break Permission; Request, Proxy, Approval. Functions: + Add Request, Pending filter, Export, View, sortable request table, pagination.
- `/attendance/reports`: heading `Attendance Reports`. Report functions: Attendance Report, Attendance Exception Report, Late In Early Out Summary Report, Attendance Summary, Attendance Shortage Report, Daily Log Report, Live Tracking Report, Total Work Hours Report, Work Hours Report, Late In Early Out Report.

## Leave

- Navigation: Leave Insights -> `/leave-insights`; Requests & Approvals -> `/leave/request-approvals/leave-application`; Configurations -> `/leave/configurations/leave-management`; Reports -> `/leave/reports`.
- `/leave-insights`: headings Leave Insights, Leave Trend, Leave Type Breakdown, Recent Leave Requests. Tabs: Self, My Team, Entity. Functions: My Leaves, Approved, Pending and Rejected drilldowns; All filter, Export, sortable request table, rows-per-page and pagination.
- `/leave/request-approvals/leave-application`: heading `Request & Approvals`. Tabs/sections: Leave Application, Leave Cancellation, Compensatory Gain, Leave Grander, Leave Balance; Request, Proxy, Approval, Direct Posting. Functions: + Add Request, Pending filter, Export, View, sortable request table, pagination.
- `/leave/configurations/leave-management`: headings Leave Settings LIVE PREVIEW, Leave Utilization by Type, Absence Trend, Carry-Forward Liability, Coverage Heatmap, Leave Balance Summary, Approvals, Cancellations, Comp-Off (Combo Off), Policy & Basic-Settings Assignment Coverage. Functions/views: country selector, Leave Masters, Leave Policies, Policy Assignments, Basic Settings Assignments, Analytics, Leave Master, Leave Policies, Policy Assignment, Basic Settings Assignment, AI Policy Advisor, Leave Copilot.
- `/leave/reports`: heading `Leave Reports`. Report functions: Compo Off Report, Leave Summary, Leave Request Report.

## Payroll

- Navigation: Process Payroll -> `/payroll/process-payroll`; Grid Format Master -> `/payroll/grid-format-definitions`; Manual Component -> `/payroll/manual-component`; Reports -> `/payroll/payroll-reports`; Penalty -> `/penalty`.
- `/payroll/process-payroll`: headings `Payroll Process`, `No payroll batches found`. Functions/status views: pay-period/selection state, Proceed To Next Step, All Drafts, Review, Approved, Cancelled, Completed, Toggle filters, Export.
- `/payroll/grid-format-definitions`: heading `Grid Format Definitions`. Functions/views: Describe with AI, New Definition, Definitions, Batch Assignments, Export, Select all on this page; sorting by Name, Process Type, Currency, GDF, FormatId, Status.
- `/payroll/manual-component`: heading `Manual Component`; Select Pay Period.
- `/payroll/payroll-reports`: heading `Payroll Reports`. Report functions: EPF, ESI, Gratuity, LWF, LWF Summary, PT, PT Kerala, PT Summary, Bank, Statutory Summary, Payroll Monthly CTC, Payroll Reconciliation, Payscale Monthly, Salary Slip, YTD Summary.
- `/penalty`: headings Penalty Rule, selected policy name, Policy assignments. Functions/views: Penalty Rule, Rule Builder, Scenario Library, Simulate & Preview, Employee Policy View, Payroll Output, Analytics, Import template, New Policy, Export.

## Travel

- Navigation: no child label or href appeared after expansion; Dashboard, PMS, and Task remained the only direct links.
- Local functions: no Travel landing route was discoverable from the sidebar.

## Resolve

- Navigation: My Tickets -> `/resolve/my-tickets`; Resolution Queue -> `/resolve/queue`; Committee Cases -> `/resolve/committee`; Resolution Analytics -> `/resolve/analytics`; Workflow & Categories -> `/resolve/config`.
- `/resolve/my-tickets`: heading `My Tickets`. Functions/status views: Raise a Ticket; All, Open, Pending Employee, Resolved, Closed; Export, Delete ticket; sortable ticket table and pagination.
- `/resolve/queue`: heading `Resolution Queue`. Functions/status views: All, Open, In Progress, Pending Employee, Escalated; All Time, Today, This Month, This Year, Last 30 Days; sortable ticket table.
- `/resolve/committee`: heading `Committee Cases`. Functions/status views: All, Under Review, Closed; sortable ticket table.
- `/resolve/analytics`: headings Resolution Analytics, Ticket volume by category, Status mix, Priority mix, Volume by sub-category. Functions: Select date range, More options.
- `/resolve/config`: headings Workflow & Categories, Categories, Sub-categories. Tabs/views: Categories, TAT Matrix, Escalation Matrix, Committees, Category Routing, Workflow Assign; visible category selectors included Officekit HR, Other Grievances, POSH, Suggestion / Feedback, Team & Interpersonal Conflicts.

## TalentHub

- Navigation: Overview -> `/talent-hub/dashboard`; New Requisition -> `/talent-hub/requisitions`; Job Postings -> `/talent-hub/job-postings`; Candidates -> `/talent-hub/candidates`; Interviews -> `/talent-hub/interviews`; Offers -> `/talent-hub/offers`; Analytics -> `/talent-hub/analytics`; JD Master -> `/talent-hub/jd-master`; Setup -> `/talent-hub/settings`.
- Shared local controls across TalentHub pages: Edit, period selector (`This month` observed), Ask AI.
- `/talent-hub/dashboard`: headings Overview, Hiring funnel, Requisitions needing attention, Upcoming interviews. Functions: Portal, Export, New Requisition; Open Requisitions, Active Candidates, Avg. Time-to-Hire and Offer Acceptance drilldowns; funnel stages Applied, Screened, Shortlisted, Interview, Offer, Hired; stage/mode filters and sortable requisition/interview tables.
- `/talent-hub/requisitions`: headings New Requisition, Requisition list. Functions: New Requisition, stage filter, Export; sortable requisition table.
- `/talent-hub/job-postings`: headings Job Postings, Job postings. Functions: Add job, Setup, All filter, Export; sortable job table.
- `/talent-hub/candidates`: heading `Candidates` with count. Views/functions: Talent Pool, Pipeline, AI Screening, job-role filter, Import resumes; sortable candidate table.
- `/talent-hub/interviews`: heading `Interviews`. Functions/views: Panel & approval, Schedule, Schedule interview.
- `/talent-hub/offers`: no semantic heading surfaced. Functions/views: Offers & Letters, Pre-Onboarding, Approval chain, Generate offer letter.
- `/talent-hub/analytics`: headings Recruitment Analytics, Hiring funnel, Source effectiveness. Functions: Schedule report, Export board pack; KPI cards for Avg. Time-to-Hire, Applications, Offer acceptance, Hires; funnel stages Applied through Hired.
- `/talent-hub/jd-master`: heading `JD Master`; Add JD.
- `/talent-hub/settings`: headings Setup, Entity Applicable & requisition lookups; Entity, Business Vertical, Country, Branch, Location, Department, Division, Band, Grade, Designation, Gender; Approval flow, Horizon budget, Connectors, New Requisition fields. Functions: Save settings; links to Entity master, Role Access Manager, Workflow Management, Horizon budget builder; Add/edit/remove lookup values; connector cards for LinkedIn Jobs, TalentHub portal, Naukri, Indeed, Bayt/GulfTalent, Employee Referral, WhatsApp Apply, Zoom Meetings, Google Meet; Connect; Add field; pagination.

## Settings

- Navigation: Role Access Manager -> `/settings/role-access-manager`; Letter Configuration -> `/settings/letter-configuration`; User Settings -> `/settings/user-settings`; Document Settings -> `/settings/doc-settings`.
- `/settings/role-access-manager`: heading `Role Access Manager`. Functions: Add Role, Edit; sorting by Roles, User Type, Code; pagination.
- `/settings/letter-configuration`: heading `Letters`. Functions: Create Letter, Delete letter; pagination.
- `/settings/user-settings`: heading `User Settings`. Functions: ALL filter, Export, Edit; sorting by User Name, Name, Role, Employee Code, Email, Mobile Status, Action Status; page-size and pagination.
- `/settings/doc-settings` redirected to `/settings/doc-settings/documents`: heading `Document Settings`. Tabs/views: Assign Document, Documents, Document Upload. Functions: Add Document, Edit document, Delete document; sorting by Document Name, Type, NotificationCountDays; pagination.

## AI Insight

- Navigation: no child label or href appeared. Clicking did not replace the already-open Settings submenu and did not expose a landing route.
- Local functions: none discoverable from the sidebar interaction.

## Uncertainties and limits

- Read-only enforcement blocked 126 post-login `POST` requests. Several appear to be authentication verification or read-style API calls, but they were not allowlisted because their server-side behavior could not be proven non-mutating. This may explain missing or partial lazy content, especially Organisation and workflow data.
- `Travel` and `AI Insight` are visible button controls but yielded no child navigation. It is uncertain whether they are disabled, placeholders, permission-gated, hover-only, or dependent on blocked requests.
- Organisation loaded with no local semantic content after the standard settle cycle. TalentHub Offers exposed functions but no semantic heading. These are recorded as observed, not interpreted as intentional product behavior.
- Redirects are material: Requests & Approvals -> `/my-profile/request-approvals/separations/request`; Surveys & Feedbacks -> `/my-profile/surveys-feedbacks/general`; Document Settings -> `/settings/doc-settings/documents`.
- The inventory records controls visible on each landing state only. It did not click local tabs or actions because some controls can mutate data or expose workflows where read/write intent is ambiguous.
