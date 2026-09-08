# Admin Production-to-Beta Gap Verification (R2)

- Production source: `https://app.officekithr.net`
- Beta source: `https://betatesting.officekithr.net`
- Access date: 2026-09-08
- Account: the same Admin credentials and company code supplied through local environment variables; no secret values were printed or recorded
- Method: authenticated Chromium at 1920 x 1400; relevant sidebar branches expanded; production labels and hrefs checked; every candidate path loaded directly on beta; final URL, semantic headings, and meaningful page text inspected after settling and scrolling
- Safety: login was the only form submitted. No create, edit, delete, upload, import, export, download, save, approve, revoke, generate, scan, assignment, configuration, or other page action was activated. Normal requests made automatically while rendering pages were allowed.
- Overall confidence: **high** for observed links, final URLs, headings, content, and classifications; **medium** for explanations of data-state differences because backend deployment/configuration was not inspected

## Classification Summary

| Classification | Count | Meaning |
| --- | ---: | --- |
| False positive | 23 | Beta has the sidebar link and the directly loaded feature. The R1 omission resulted from incomplete nested-menu discovery. |
| Navigation-only gap | 8 | The production sidebar has the link; beta does not, but direct beta navigation loads the feature at the same path. |
| Feature unavailable/redirected | 1 | The production sidebar has the feature; beta has no link and direct navigation produces an unavailable state. |

No candidate redirected to a different beta URL. All 31 implemented beta routes retained the requested URL; only AI Configuration rendered a 404 at its requested URL.

## Candidate Verification

`Beta link absent?` describes the matching sidebar label/href after opening the relevant module or route. All final URLs below were observed after direct navigation, not inferred.

### My Profile / Finance

| Production sidebar label + href | Beta link absent? | Beta direct-navigation evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `Salary Slip` -> `/my-profile/finance/salary slip` (resolved URL `/my-profile/finance/salary%20slip`) | **No.** Beta shows `salary slip` -> `/my-profile/finance/salary slip`; capitalization differs only. | Final: `https://betatesting.officekithr.net/my-profile/finance/salary%20slip`. Headings: `Salary Slip`, `Monthly Reports`. Content includes salary-slip/monthly-report views, year, dated monthly cards, amounts, and downloads. | **False positive** | High |

### Company

| Production sidebar label + href | Beta link absent? | Beta direct-navigation evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `Employee Directory` -> `/company/employee-information/employee-directory` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/employee-information/employee-directory`. Heading `All Employees`; employee table, status/type filters, Bulk Actions, Add Employee, Export. | **False positive** | High |
| `Employee Reporting` -> `/company/employee-information/employee-reporting` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/employee-information/employee-reporting`. Heading `Employee Reporting`; reporting relationships table, Import, employee-type filter, Export. | **False positive** | High |
| `Transfer Or Promotion` -> `/company/lifecycle-management` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/lifecycle-management`. Heading `Transfer Or Promotion`; analytics, application flow, request/approval views, Pending and Export. | **False positive** | High |
| `Lifecycle Master` -> `/company/lifecycle-management/master` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/lifecycle-management/master`. Heading `Transfer Or Promotion`; Create Master, Export, action-type records and Edit controls. | **False positive** | High |
| `Lifecycle Upload` -> `/company/lifecycle-management/upload` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/lifecycle-management/upload`. Heading `Transfer Or Promotion`; Upload Data, Export, transfer records and approval statuses. | **False positive** | High |
| `Lifecycle Revoke` -> `/company/lifecycle-management/revoke` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/lifecycle-management/revoke`. Heading `Transfer Or Promotion`; Eligible for Revoke, Revoked History, Export, old/new entity attributes. | **False positive** | High |
| `Overview` -> `/company/report-builder/overview` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/report-builder/overview`. Headings `Create a Report`, `AI Report Copilot`, `Build from Scratch`, `Use an existing Template`, `Recent reports`, `Data sources`. | **False positive** | High |
| `AI Report Copilot` -> `/company/report-builder/copilot` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/report-builder/copilot`. Heading `AI Report Copilot`; prompt/history area and report preview with Save to library, Download, Open in Builder. | **False positive** | High |
| `Report Builder` -> `/company/report-builder/builder` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/report-builder/builder`. Headings `Report Studio`, `Field palette`, `Report layout`, `Untitled Report`, `Preview`; draggable HR fields and report zones. | **False positive** | High |
| `Template Library` -> `/company/report-builder/library` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/report-builder/library`. Heading `Template Library`; categorized saved templates and Ask Copilot. | **False positive** | High |
| `Overview` -> `/company/horizon/dashboard` | **Yes.** No matching beta anchor; `Officekit Horizon` and its children are absent from the beta Company sidebar. | Final: `https://betatesting.officekithr.net/company/horizon/dashboard`. Headings `Manpower Budget - Overview`, `Budget vs Actual vs Forecast`, `Variance by department`, `Headcount bridge`; budget KPIs, board-pack export and actuals refresh are rendered. | **Navigation-only gap** | High |
| `Budget Builder` -> `/company/horizon/budget-builder` | **Yes.** No matching beta anchor. | Final: `https://betatesting.officekithr.net/company/horizon/budget-builder`. Headings `Budget Builder`, `Budget Lists`; existing budgets, period/year/month filters, forecasting and Create budget are rendered. | **Navigation-only gap** | High |
| `Budget vs Actual` -> `/company/horizon/budget-vs-actual` | **Yes.** No matching beta anchor. | Final: `https://betatesting.officekithr.net/company/horizon/budget-vs-actual`. Heading `Budget vs Actual`; deviations, risk/opportunities, RAG thresholds, payroll-sync context and Export CSV are rendered. | **Navigation-only gap** | High |
| `Sentinel Insight` -> `/ras` | **Yes.** No matching beta anchor. | Final: `https://betatesting.officekithr.net/ras`. Heading `Operational Risk Dashboard`; health score, Scan now, six risk pillars, graph and scope/schedule/AI-engine context are rendered. | **Navigation-only gap** | High |

### Attendance

| Production sidebar label + href | Beta link absent? | Beta direct-navigation evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `Shift Desk` -> `/attendance/shift-management/shift-desk` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/attendance/shift-management/shift-desk`. Headings `Shift Desk`, `Shift Library`; assignment/creation controls, shift totals, Quick Assign, filters and Export. | **False positive** | High |
| `Policy Desk` -> `/attendance/shift-management/policy-desk` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/attendance/shift-management/policy-desk`. Headings `Policy Desk`, `Policy Library`; assignment/creation controls, filters and Export. | **False positive** | High |

### Payroll

| Production sidebar label + href | Beta link absent? | Beta direct-navigation evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `Pay Period Master` -> `/payroll/pay-period-master` | **Yes.** No matching beta anchor; the beta Payroll sidebar does not expose the production `Masters` branch. | Final: `https://betatesting.officekithr.net/payroll/pay-period-master`. Heading `Pay Period`; Add Pay Period, Pay Periods, Analytics and period records are rendered. | **Navigation-only gap** | High |
| `Paycode Master` -> `/payroll/pay-code-master` | **Yes.** No matching beta anchor. | Final: `https://betatesting.officekithr.net/payroll/pay-code-master`. Heading `Pay Code Master`; Add Pay Code Batch, batch list and Analytics are rendered. | **Navigation-only gap** | High |
| `LOP & Payable Days` -> `/payroll/lop-payable-days` | **Yes.** No matching beta anchor; the beta Payroll sidebar does not expose the production `Amendments` branch. | Final: `https://betatesting.officekithr.net/payroll/lop-payable-days`. Heading `LOP / Payable Days Editor`; payroll period/year/type selectors, Edit LOP Count and Bulk Upload are rendered. | **Navigation-only gap** | High |
| `Generate Salary Slip` -> `/payroll/salary-slip-generate` | **Yes.** No matching beta anchor. | Final: `https://betatesting.officekithr.net/payroll/salary-slip-generate`. Heading `Generate Salary Slip`; batch table and instruction to open a batch for generation are rendered. | **Navigation-only gap** | High |
| `Payscale Designer` -> `/payroll/compiq/payscale-designer` | **No.** Exact label/href present under beta `CompIQ`. | Final: `https://betatesting.officekithr.net/payroll/compiq/payscale-designer`. Headings `Payscale Designer`, `Selected Parameters`, `Available Components`, `AI Suggested Pay Split`; benchmark and split controls are rendered. | **False positive** | High |
| `Payscale Studio` -> `/payroll/compiq/pay-studio` | **No.** Exact label/href present under beta `CompIQ`. | Final: `https://betatesting.officekithr.net/payroll/compiq/pay-studio`. No semantic heading, but meaningful content includes `Pay Studio`, Approvals, Bulk Assign, Existing/New Hire, salary basis, amount and pay-scale template. | **False positive** | High |
| `Rule Engine` -> `/payroll/pay-compliance/rule-engine` | **No.** Exact label/href present under beta `Compliance`. | Final: `https://betatesting.officekithr.net/payroll/pay-compliance/rule-engine`. Headings `Payroll Compliance`, `Batch & Slab`, `Components`; country rules, calculation preview and statutory component records are rendered. | **False positive** | High |
| `Calendar` -> `/payroll/pay-compliance/calendar` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/payroll/pay-compliance/calendar`. Headings `Compliance Calendar`, `Filters`, `September 2026`; obligation generation, filters and month/agenda statuses are rendered. | **False positive** | High |
| `Filings & Challans` -> `/payroll/pay-compliance/filings` | **No.** Exact sidebar label/href present (plus a local `Filings` link to the same path). | Final: `https://betatesting.officekithr.net/payroll/pay-compliance/filings`. Headings `Filing Management`, `Record a Filing`; filing/challan status, history, obligation and document fields are rendered. | **False positive** | High |
| `Reports` -> `/payroll/pay-compliance/analytics` | **No.** Exact label/href present under beta `Compliance`. | Final: `https://betatesting.officekithr.net/payroll/pay-compliance/analytics`. Headings include `Compliance Analytics`, overview, calendar/filings, challans, labor audits, regulatory updates, risk/predictions, liability and reports. | **False positive** | High |

### Settings

| Production sidebar label + href | Beta link absent? | Beta direct-navigation evidence | Classification | Confidence |
| --- | --- | --- | --- | --- |
| `Core Entity Settings` -> `/company/entity-settings/entity-linking` | **No.** Exact label/href present under beta `HR Operations`. | Final: `https://betatesting.officekithr.net/company/entity-settings/entity-linking`. Headings `Core Entity Settings`, `Entity hierarchy`; Entity Linking/Master/Sub-Entity/Parameters and hierarchy content are rendered. | **False positive** | High |
| `Common Masters` -> `/company/entity-settings/common-masters` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/entity-settings/common-masters`. Heading `Common Masters`; Common Master, Branch, Employee Status, Religion and reference records are rendered. | **False positive** | High |
| `General Categories` -> `/company/entity-settings/general-categories` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/entity-settings/general-categories`. Heading `General Categories`; category/subcategory views, dynamic fields and records are rendered. | **False positive** | High |
| `Employee Reference` -> `/company/entity-settings/employee-reference` | **No.** Exact label/href present. | Final: `https://betatesting.officekithr.net/company/entity-settings/employee-reference`. Heading `Employee Reference`; Dependent Master, Consultant Details and reference records are rendered. | **False positive** | High |
| `AI Configuration` -> `/settings/ai-configuration` | **Yes.** No matching beta anchor. | Final remains `https://betatesting.officekithr.net/settings/ai-configuration`, but the page heading is `404 Page not found` with text saying the page does not exist or access is unavailable. Production renders `AI Configuration` / `AI Providers` and provider, key, model, mapping, budget, alert, analytics and audit areas. | **Feature unavailable/redirected** (unavailable; no URL redirect) | High |

## Organisation Difference

Both deployments expose `Organisation` -> `/my-profile/organisation`, retain the direct URL, and render the same structural headings and tabs: `Organisation`, `Employees by level`, `Employees by service line`, `Distribution by country & location`, `Leadership`; `Overview`, `Organisation Chart`, `Hierarchy Levels`, `Teams`, `Reports`; plus `Export Chart` and `Edit`.

| Environment | Observed content |
| --- | --- |
| Production | `https://app.officekithr.net/my-profile/organisation` reports 45 employees, 9 service lines/teams, 19 hierarchy levels, 1 location, populated level/service-line distributions, and leadership content. |
| Beta | `https://betatesting.officekithr.net/my-profile/organisation` reports 0 employees, 0 service lines/teams, 0 hierarchy levels, 0 locations, `No data for this report`, and `No leadership data`. |

Classification: **content/data parity difference, not a navigation or feature-availability gap**. Confidence is **high** that the rendered states differ and **medium** on cause; likely causes include environment-specific data, scope, API behavior, or configuration, none of which was tested directly.

## Limits

- Findings apply to this Admin account, company code, tenant state, feature flags, and permissions on 2026-09-08.
- A directly rendered page proves route-level availability, not that every deeper workflow succeeds.
- Potentially mutating controls were recorded as visible evidence only and were never activated.
- Sidebar absence means no matching anchor was found in the relevant rendered beta navigation state; it does not establish why the product omitted it.
