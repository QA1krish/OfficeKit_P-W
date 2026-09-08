# OfficeKit Production Employee UI Evidence Digest

- Source: `https://app.officekithr.net`
- Authenticated landing URL: `https://app.officekithr.net/`
- Access date: 2026-09-08
- Role: authenticated Employee using the supplied company code and username; credentials were decoded only in process and were not printed or recorded.
- Method: headless Playwright via Node, 1920 x 1400 viewport. Each visible sidebar module was independently expanded because opening one accordion collapses another. Landing routes used DOM/content waits, network-idle attempts, scroll-based lazy-load triggering, a visible Retry fallback, and up to three attempts. No page-local action, form, download, export, edit, delete, save, approval, survey, ticket, resignation, or other data-changing control was activated.

## Navigation And Feature Inventory

### Dashboard

- Navigation: `Dashboard` -> `/`.
- Landing headings/areas: greeting, `Leave`, `Attendance`, `Payroll`, `My Holidays`, `Organization`, `Request and Approvals`, `Reports`, `My Team`, and `Feeds`.
- Local functions: `View punch history`, feed menu, and feed filters `All`, `News`, `Birthdays`, `Anniversaries`.

### My Profile

- Navigation: `Personal Info` -> `/my-profile/personal-info`; `Requests & Approvals` -> `/my-profile/request-approvals`; `Forms and Policies` -> `/my-profile/forms-policy`; `My Holidays` -> `/my-profile/my-holidays`; `HR Forms & Policies` -> `/my-profile/forms-policiesHR`; `News Feeds` -> `/my-profile/news-feed`; `Surveys & Feedbacks` -> `/my-profile/surveys-feedbacks`.
- `Personal Info`: headings `Basic Identity`, `Employment Details`, `Employment Dates & Policies`, `Benefits & Allowances`; sections/tabs `Overview`, `Personal`, `Professional`, `Asset Details`, `Audit Information`, `Bank Details`, `Certifications`, `Dependent`, `Languages`, `Letters`, `Qualification`, `Reference`, `Skill Set`, `Communication`, `Documents`, plus horizontal tab scrolling.
- `Requests & Approvals`: redirects to `/my-profile/request-approvals/separations/request`; heading `Request & Approvals`; `Separation` and `Request`; add request, status filter, export, sortable request table, approvers, view, and pagination.
- `Forms and Policies`: heading `Forms and Policies`; `Forms` and `Policies`; sortable form list. The observed state was `No forms found`.
- `My Holidays`: heading `My Holidays`; year selector, sortable holiday/date/day table, and pagination.
- `HR Forms & Policies`: heading `Forms and Policies`; `Forms`, `Policies`, `Add Form`, and sortable document columns. The observed state had no forms.
- `News Feeds`: heading `News Feeds`; `Released News`, `My News`, sortable news/event/poster/end-date columns, and pagination.
- `Surveys & Feedbacks`: redirects to `/my-profile/surveys-feedbacks/general`; displayed heading `Request & Approvals`; `General`, `FS Checklist`, `Exit Feedback`, status filter, `Start Survey`, `View`, rows-per-page, and pagination.

### Attendance

- Navigation: `Attendance Insights` -> `/attendance-insights`; `Requests & Approvals` -> `/attendance/request-approvals/on-duty`; `Reports` -> `/attendance/reports`.
- `Attendance Insights`: `Self` and `My Team`; summary links for late arrivals -> `/attendance-insights/late?scope=self`, absences -> `/attendance-insights/absent?scope=self`, and punctuality -> `/attendance/reports/late-in-early-out-report`; headings `Attendance Trend` and `Recent Attendance Activity`; status filter, export, sortable activity table, rows-per-page, and pagination.
- `Requests & Approvals`: heading `Request & Approvals`; areas `On Duty`, `Late in / Early out`, `Break Permission`; `Request` and `Approval`; add request, status filter, export, sortable request table, and approvers. The observed On Duty list was empty.
- `Reports`: heading `Attendance Reports`; launchers `Attendance Report` and `Attendance Exception Report`.

### Leave

- Navigation: `Leave Insights` -> `/leave-insights`; `Requests & Approvals` -> `/leave/request-approvals/leave-application`; `Reports` -> `/leave/reports`.
- `Leave Insights`: `Self` and `My Team`; summary links for total -> `/leave-insights/total?scope=self`, approved -> `/leave-insights/approved?scope=self`, pending -> `/leave-insights/pending?scope=self`, and rejected -> `/leave-insights/rejected?scope=self`; headings `Leave Trend`, `Leave Type Breakdown`, `Recent Leave Requests`; status filter, export, sortable request table, rows-per-page, and pagination.
- `Requests & Approvals`: heading `Request & Approvals`; areas `Leave Application`, `Leave Cancellation`, `Compensatory Gain`, `Leave Grander`; `Request`; add request, status filter, export, sortable leave table, and approvers. The observed Leave Application list was empty.
- `Reports`: heading `Leave Reports`; no report launcher was visible and the observed state said `No reports found`.

### PMS

- Direct navigation: `PMS` -> `/pms`.
- Landing heading: `Feature Under Development`; no local action was visible.

### Resolve

- Navigation: `My Tickets` -> `/resolve/my-tickets`; `Resolution Queue` -> `/resolve/queue`; `Committee Cases` -> `/resolve/committee`; `Resolution Analytics` -> `/resolve/analytics`; `Workflow & Categories` -> `/resolve/config`.
- `My Tickets`: heading `My Tickets`; raise ticket, filters `All`, `Open`, `Pending Employee`, `Resolved`, `Closed`, export, sortable ticket table. The observed list was empty.
- `Resolution Queue`: heading `Resolution Queue`; status filters `All`, `Open`, `In Progress`, `Pending Employee`, `Escalated`; date filters `All Time`, `Today`, `This Month`, `This Year`, `Last 30 Days`; sortable queue. The observed queue was empty.
- `Committee Cases`: heading `Committee Cases`; filters `All`, `Under Review`, `Closed`; sortable case table. The observed list was empty.
- `Resolution Analytics`: headings `Resolution Analytics`, `Ticket volume by category`, `Status mix`, `Priority mix`, `Volume by sub-category`; date-range and chart-options controls plus KPI/category/status/priority analytics.
- `Workflow & Categories`: headings `Workflow & Categories`, `Categories`, `Sub-categories`; tabs/functions `Categories`, `TAT Matrix`, `Escalation Matrix`, `Committees`, `Category Routing`, `Workflow Assign`, and category selectors.

### TalentHub

- Navigation: `Overview` -> `/talent-hub/dashboard`; `New Requisition` -> `/talent-hub/requisitions`; `Job Postings` -> `/talent-hub/job-postings`; `Candidates` -> `/talent-hub/candidates`; `Interviews` -> `/talent-hub/interviews`; `Offers` -> `/talent-hub/offers`; `Analytics` -> `/talent-hub/analytics`; `JD Master` -> `/talent-hub/jd-master`; `Setup` -> `/talent-hub/settings`.
- Common local shell: entity context, period selector, `Edit`, and `Ask AI` recur across landings.
- `Overview`: headings `Overview`, `Hiring funnel`, `Requisitions needing attention`, `Upcoming interviews`; portal, export, new requisition, funnel-stage controls, stage/mode filters, sortable tables, and summary links to requisitions, candidates, analytics, and offers.
- `New Requisition`: headings `New Requisition`, `Requisition list`; new requisition, stage filter, export, sortable list, review, and post job.
- `Job Postings`: headings `Job Postings`, `Job postings`; add job, setup, status filter, export, and sortable postings list.
- `Candidates`: heading `Candidates`; `Talent Pool`, `Pipeline`, `AI Screening`; job-role filter, resume import/download, sortable candidate list, and pagination.
- `Interviews`: heading `Interviews`; `Panel & approval` and `Schedule` with an interview list.
- `Offers`: no semantic heading was exposed; `Offers & Letters`, `Pre-Onboarding`, `Approval chain`, and `Generate offer letter`, with offer/automation status cards.
- `Analytics`: headings `Recruitment Analytics`, `Hiring funnel`, `Source effectiveness`; schedule report, export board pack, period KPI/funnel controls, source cards, and signals.
- `JD Master`: heading `JD Master`; add JD and a JD/department/designation/band-grade/file list.
- `Setup`: headings `Setup`, `Entity Applicable & requisition lookups`, organization lookup headings, `Gender`, `Approval flow`, `Horizon budget`, `Connectors`, `New Requisition fields`; save settings, add/edit/remove, connect, paging, and add-field controls. Local links: `Entity master` -> `/company/entity-settings`; `Role Access Manager` -> `/settings/role-access-manager`; `Workflow Management` -> `/company/workflow-management`; `Horizon budget builder` -> `/company/horizon/budget-builder`.

### AI Insight

- Direct navigation: `AI Insight` -> `/hrms-bot`.
- Landing UI: `OfficekitHr AI`, greeting heading, voice/history/help controls, message input/send, and suggested prompts for leave application, leave balance, attendance, and PMS goals.

## Uncertainties And Boundaries

- This is a visibility inventory for one production Employee account, tenant configuration, data state, desktop viewport, and the access date. Permissions, feature flags, setup, records, and responsive layout can change what appears.
- Visible top-level sidebar controls were `Dashboard`, `My Profile`, `Attendance`, `Leave`, `PMS`, `Resolve`, `TalentHub`, and `AI Insight`. No Company, Payroll, Task, Settings, Finance, Organisation, Letter, or Probation Review sidebar link was visible to this account. Dashboard cards named Payroll and Organization do not establish corresponding sidebar access.
- Accordion labels have no href; only their visible child-link hrefs are recorded. TalentHub Setup's four additional local links are not sidebar module links and were not recursively crawled.
- Many visual tabs are ordinary buttons or text controls without ARIA tab semantics. Labels were inventoried from rendered landing content, but controls were not activated where they could open workflows or mutate data.
- Action labels such as Add, Edit, Remove, Save, Connect, Import, Export, Start Survey, Raise a Ticket, Review, and Post job indicate visible UI exposure only, not confirmed authorization or successful operation; none was invoked.
- All discovered sidebar landing routes produced content on the first crawl attempt after waits and lazy-load scrolling. Empty-state observations are not proof that conditional functions never appear.
