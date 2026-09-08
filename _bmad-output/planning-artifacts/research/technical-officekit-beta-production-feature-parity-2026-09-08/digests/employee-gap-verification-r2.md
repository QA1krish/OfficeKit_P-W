# Employee UI Gap Verification R2

## Source And Method

- Sources: authenticated Employee UI at `https://app.officekithr.net` and `https://betatesting.officekithr.net`.
- Access date: 2026-09-08.
- Method: fresh desktop Playwright sessions using the supplied production account and the beta Employee credentials from `.env`. Credentials were read/decoded only in process and were not printed, logged, or written. Sidebar accordions, non-mutating insight scope tabs, and named landing routes were inspected. No create, edit, submit, approve, reject, delete, export, download, or other data-changing action was invoked.
- Comparison constraint: the sites were tested with different Employee accounts. Therefore every UI difference is treated as permission-, tenant-, feature-flag-, or account-sensitive unless exact beta direct-route behavior demonstrates that the build cannot serve the production feature.
- Confidence: high for the observed labels, final URLs, and rendered headings on these two accounts at the access time; low for attributing any account-sensitive difference to a code/build change.

## Result

### Confirmed Build-Like Gaps

None.

Every rechecked production-only landing route also resolved to functional feature content in beta. The evidence supports a navigation/entitlement mismatch between the accounts, not missing beta implementation. The insight team-scope differences are also permission-sensitive: beta deliberately canonicalized direct `scope=team` requests to `scope=self` rather than returning a missing route or broken page.

### Permission-Sensitive Differences

| Area | Production observation | Beta observation | Classification | Confidence |
| --- | --- | --- | --- | --- |
| Resolve module | Top-level `Resolve` is visible with five child routes. | No `Resolve` sidebar label, but all five exact routes render their corresponding pages. | Permission-sensitive navigation/role mismatch; not a build gap. | High |
| Attendance Insights | Sidebar includes `Attendance Insights`; page shows `Self` and `My Team`. Selecting `My Team` ends at `/attendance-insights?scope=team`. | Sidebar omits `Attendance Insights`; direct `/attendance-insights` renders the page with visible `Self` only. Direct `/attendance-insights?scope=team` ends at `/attendance-insights?scope=self`. | Permission-sensitive scope/menu mismatch; not a missing beta page. | High |
| Leave Insights team scope | Sidebar includes `Leave Insights`; page shows `Self` and `My Team`. Selecting `My Team` ends at `/leave-insights?scope=team`. | Sidebar also includes `Leave Insights`, but the normal page exposes visible `Self` only. Direct `/leave-insights?scope=team` ends at `/leave-insights?scope=self` and renders normal Leave Insights content. | Permission-sensitive team-scope mismatch. | High |
| Production-only top-level labels | `Resolve`. | Absent. | Permission-sensitive because direct beta routes work. | High |
| Beta-only top-level labels | Absent in production account. | `Company`, `Task`, `Settings`. | Permission-sensitive; no direct-route proof of a production build omission was gathered or inferred. | High |
| My Profile children | Seven common links only. | Adds `Organisation`, `Letter`, nested `Finance` (`salary slip`, `payroll report`), and `Probation Review`. | Permission-sensitive. | High |
| Attendance request tabs | Common tabs plus production-only `Approval`; lacks beta-only categories. | Adds `Attendance Regularisation` and `Work Permission`; lacks visible `Approval`. | Permission-sensitive. | High |
| Leave request tabs | Four common categories and `Request`. | Adds `Leave Balance` and `Approval`. | Permission-sensitive. | High |
| Profile request categories | `Separation` and `Request`. | Adds `Loans`, `Advance`, and `Claims`; also has `Separation` and `Request`. | Permission-sensitive. | High |

## Production-Only Route Rechecks In Beta

These routes were entered directly after beta Employee login. The five Resolve routes and the Attendance Insights landing remained at the requested beta paths and rendered the expected feature headings. The two explicit team-scope requests rewrote to self scope. None redirected to login, returned an access-denied/not-found state, or exposed a broken/under-development page.

| Production-only navigation item | Direct beta request | Final beta URL | Beta content evidence | Conclusion |
| --- | --- | --- | --- | --- |
| Resolve > My Tickets | `/resolve/my-tickets` | `/resolve/my-tickets` | Heading `My Tickets`; ticket request/list UI loaded. | Feature is deployed; sidebar omission is permission-sensitive. |
| Resolve > Resolution Queue | `/resolve/queue` | `/resolve/queue` | Heading `Resolution Queue`; queue UI loaded. | Feature is deployed; sidebar omission is permission-sensitive. |
| Resolve > Committee Cases | `/resolve/committee` | `/resolve/committee` | Heading `Committee Cases`; case UI loaded. | Feature is deployed; sidebar omission is permission-sensitive. |
| Resolve > Resolution Analytics | `/resolve/analytics` | `/resolve/analytics` | Headings `Resolution Analytics`, `Ticket volume by category`, `Status mix`, `Priority mix`, and `Volume by sub-category`. | Feature is deployed; sidebar omission is permission-sensitive. |
| Resolve > Workflow & Categories | `/resolve/config` | `/resolve/config` | Headings `Workflow & Categories`, `Categories`, and `Sub-categories`. | Feature is deployed; sidebar omission is permission-sensitive. |
| Attendance Insights | `/attendance-insights` | `/attendance-insights` | Headings `Attendance Insights`, `Attendance Trend`, and `Recent Attendance Activity`; visible `Self` scope. | Feature is deployed; sidebar and team-scope omissions are permission-sensitive. |
| Attendance Insights > My Team | `/attendance-insights?scope=team` | `/attendance-insights?scope=self` | Normal Attendance Insights content; no visible `My Team` control or error state. | Beta account is constrained to self scope. |
| Leave Insights > My Team | `/leave-insights?scope=team` | `/leave-insights?scope=self` | Normal Leave Insights content (`Leave Trend`, `Leave Type Breakdown`, `Recent Leave Requests`); no visible team scope on the normal landing. | Beta account is constrained to self scope. |

## Complete Sidebar Comparison

Labels below preserve the observed UI spelling and hierarchy.

### Production Employee

- Top level: `Dashboard`, `My Profile`, `Attendance`, `Leave`, `PMS`, `Resolve`, `TalentHub`, `AI Insight`.
- My Profile: `Personal Info`, `Requests & Approvals`, `Forms and Policies`, `My Holidays`, `HR Forms & Policies`, `News Feeds`, `Surveys & Feedbacks`.
- Attendance: `Attendance Insights`, `Requests & Approvals`, `Reports`.
- Leave: `Leave Insights`, `Requests & Approvals`, `Reports`.
- Resolve: `My Tickets`, `Resolution Queue`, `Committee Cases`, `Resolution Analytics`, `Workflow & Categories`.
- TalentHub: `Overview`, `New Requisition`, `Job Postings`, `Candidates`, `Interviews`, `Offers`, `Analytics`, `JD Master`, `Setup`.

### Beta Employee

- Top level: `Dashboard`, `My Profile`, `Company`, `Attendance`, `Leave`, `PMS`, `Task`, `TalentHub`, `Settings`, `AI Insight`.
- My Profile: `Personal Info`, `Requests & Approvals`, `Forms and Policies`, `My Holidays`, `HR Forms & Policies`, `News Feeds`, `Surveys & Feedbacks`, `Organisation`, `Letter`, `Finance` (`salary slip`, `payroll report`), `Probation Review`.
- Company: `Workflow Management`, `Asset Management`, `Reports`.
- Attendance: `Requests & Approvals`, `Reports`.
- Leave: `Leave Insights`, `Requests & Approvals`, `Reports`.
- TalentHub: `Overview`, `New Requisition`, `Job Postings`, `Candidates`, `Interviews`, `Offers`, `Analytics`, `JD Master`, `Setup`.
- Settings: visible top-level expandable label with no child label exposed.

## Request And Approval Tab Comparison

The following are exact visible local button labels, not inferred capabilities.

| Landing | Shared | Production only | Beta only |
| --- | --- | --- | --- |
| My Profile > Requests & Approvals | Category `Separation`; mode `Request` | None | Categories `Loans`, `Advance`, `Claims` |
| Attendance > Requests & Approvals | Categories `On Duty`, `Late in / Early out`, `Break Permission`; mode `Request` | Mode `Approval` | Categories `Attendance Regularisation`, `Work Permission` |
| Leave > Requests & Approvals | Categories `Leave Application`, `Leave Cancellation`, `Compensatory Gain`, `Leave Grander`; mode `Request` | None | Category `Leave Balance`; mode `Approval` |

## DEV Warning

Do not create or close parity defects from these two accounts by comparing sidebar visibility or local tabs alone. In particular, beta already serves every production-only Resolve route and the Attendance Insights route, while beta team-scope URLs are normalized to self scope. Reproduce with matched tenant, role, reporting hierarchy, and role-access configuration before assigning any difference to the build. The beta account also has several capabilities absent from the production account, reinforcing that the account/tenant permission sets are not equivalent.

## Evidence Boundaries

- This verifies rendered behavior for one production Employee and one beta Employee on the stated date, not global availability for either environment.
- Direct-route success proves that beta can serve the named page to this account; it does not prove authorization for every action on that page.
- Controls were inventoried without activating workflow or mutation actions. Empty lists and data-dependent controls were not used to infer feature absence.
- Exact team URLs were derived by selecting production's read-only `My Team` control, then entered directly in beta. Both beta routes rewrote to self scope.
