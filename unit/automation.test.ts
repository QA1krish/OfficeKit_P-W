import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadConfig } from '../src/automation/config';
import { recipients, renderDefectEmail, renderExecutionEmail, renderVerificationEmail, sendMail } from '../src/automation/email/mailer';
import { dispatchWorkflow } from '../src/automation/github/dispatch';
import { JiraClient } from '../src/automation/jira/client';
import { processDefects, updateVerification } from '../src/automation/jira/process';
import { renderHtml, writeReports } from '../src/automation/reporting/report';
import { calculateModules, classifyFailure, normalizeReport, stableTestId, syntheticFailure } from '../src/automation/reporting/results';
import { buildTargetArgs, parseListOutput, resolveTestCaseId } from '../src/automation/reporting/targeting';
import { FileEventStore, parseInReviewEvent, validSecret } from '../src/automation/webhook/handler';
import { MailConfig } from '../src/automation/email/mailer';
import { NormalizedTestResult, QaSummary } from '../src/automation/types';

function response(body: object | undefined, status = 200): Response { return new Response(status === 204 || body === undefined ? null : JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }); }
function result(status: 'passed' | 'failed' = 'passed'): NormalizedTestResult {
  return { id: 'pw-0123456789abcdef', title: '<script>required</script>', fullTitle: 'login.spec.ts > Login > <script>required</script>', file: 'login.spec.ts', project: 'chromium', module: 'login', status, durationMs: 25, error: status === 'failed' ? 'BROKEN FUNCTION\nExpected: saved\nReceived: error' : '', expected: status === 'failed' ? 'saved' : '', actual: status === 'failed' ? 'error' : '', classification: status === 'failed' ? 'application' : undefined, signature: status === 'failed' ? 'abc123' : undefined, attachments: [], screenshot: status === 'failed' ? 'shot.png' : '', video: status === 'failed' ? 'video.webm' : '', trace: status === 'failed' ? 'trace.zip' : '', tags: ['@login'], jiraIssue: '', jiraUrl: '', jiraAssigneeEmail: '', verificationStatus: 'not-run' };
}
function summary(status: 'passed' | 'failed' = 'passed'): QaSummary {
  const item = result(status); return { generatedAt: '2026-09-16T00:00:01.000Z', project: 'OfficeKit UAT', environment: 'beta', branch: 'main', commit: 'abc123', runUrl: 'https://github.test/run/1', reportUrl: 'https://github.test/run/1#report', summaryUrl: 'https://github.test/run/1#summary', startedAt: '2026-09-16T00:00:00.000Z', endedAt: '2026-09-16T00:00:00.025Z', durationMs: 25, totals: { total: 1, passed: status === 'passed' ? 1 : 0, failed: status === 'failed' ? 1 : 0, skipped: 0, flaky: 0 }, passPercentage: status === 'passed' ? 100 : 0, failPercentage: status === 'failed' ? 100 : 0, overallResult: status === 'passed' ? 'PASSED' : 'FAILED', modules: calculateModules([item]), tests: [item] };
}
const jiraConfig = { baseUrl: 'https://jira.test', email: 'qa@test', token: 'secret', projectKey: 'QA', defaultAssigneeAccountId: 'account-123' };
const mailConfig: MailConfig = { host: 'smtp.test', port: 587, secure: false, username: 'sender', password: 'secret', from: 'automation@test', testerEmail: 'tester@test', projectManagerEmail: 'pm@test', developerEmail: 'dev@test' };

test('parses Playwright stats, attachment metadata, calculations, modules, and expected/actual', () => {
  const parsed = normalizeReport({ stats: { startTime: '2026-09-16T00:00:00.000Z', duration: 100 }, suites: [{ title: 'login.spec.ts', file: 'login.spec.ts', specs: [{ title: 'required', tests: [{ title: 'required', projectName: 'chromium', results: [{ status: 'failed', duration: 100, error: { message: 'BROKEN FUNCTION\nExpected: yes\nReceived: no' }, attachments: [{ name: 'screenshot', contentType: 'image/png', path: 'a.png' }, { name: 'video', contentType: 'video/webm', path: 'a.webm' }, { name: 'trace', contentType: 'application/zip', path: 'a.zip' }] }] }] }] }] }, { project: 'OfficeKit UAT', environment: 'beta', branch: 'main', commit: 'deadbeef', now: new Date('2026-09-16T00:01:00Z') });
  assert.equal(parsed.startedAt, '2026-09-16T00:00:00.000Z'); assert.equal(parsed.endedAt, '2026-09-16T00:00:00.100Z'); assert.equal(parsed.durationMs, 100);
  assert.deepEqual(parsed.totals, { total: 1, passed: 0, failed: 1, skipped: 0, flaky: 0 }); assert.equal(parsed.failPercentage, 100); assert.equal(parsed.overallResult, 'FAILED'); assert.equal(parsed.modules[0].module, 'login');
  assert.equal(parsed.tests[0].expected, 'yes'); assert.equal(parsed.tests[0].actual, 'no'); assert.equal(parsed.tests[0].screenshot, 'a.png'); assert.equal(parsed.tests[0].video, 'a.webm'); assert.equal(parsed.tests[0].trace, 'a.zip'); assert.equal(parsed.tests[0].attachments[0].contentType, 'image/png');
});

test('classifies every failure category conservatively', () => {
  assert.equal(classifyFailure('BROKEN FUNCTION: save failed'), 'application'); assert.equal(classifyFailure('locator timed out'), 'automation'); assert.equal(classifyFailure('browser launch failed'), 'infrastructure'); assert.equal(classifyFailure('ECONNREFUSED environment'), 'environment'); assert.equal(classifyFailure('missing required configuration'), 'configuration'); assert.equal(classifyFailure('unknown assertion'), 'automation');
});

test('creates a synthetic report when Playwright has no result', () => {
  const value = syntheticFailure('missing required configuration', { environment: 'beta', now: new Date('2026-09-16T00:00:00Z') }); assert.equal(value.overallResult, 'FAILED'); assert.equal(value.tests[0].classification, 'configuration'); assert.equal(value.totals.failed, 1);
});

test('HTML and JSON reports contain required fields and escape untrusted text', async () => {
  const value = summary('failed'); value.tests[0].error = '<script>required</script>'; value.tests[0].jiraIssue = 'QA-1'; value.tests[0].verificationStatus = 'failed'; const html = renderHtml(value);
  for (const text of ['OfficeKit UAT', 'Environment', 'Branch / Commit', 'Started / Ended / Duration', 'Pass %', 'Test case ID', 'Jira issue', 'Verification', 'Screenshot', 'Video', 'Trace']) assert.match(html, new RegExp(text));
  assert.doesNotMatch(html, /<script>required/); assert.match(html, /&lt;script&gt;required&lt;\/script&gt;/);
  const dir = await mkdtemp(path.join(os.tmpdir(), 'qa-report-')); await writeReports(value, dir); const json = JSON.parse(await readFile(path.join(dir, 'summary.json'), 'utf8')) as QaSummary; assert.equal(json.tests[0].jiraIssue, 'QA-1'); assert.equal(json.modules[0].total, 1);
});

test('canonical configuration uses accountId/email names and supports SMTP_USER alias', () => {
  const jira = loadConfig('jira', { JIRA_BASE_URL: 'https://jira', JIRA_EMAIL: 'qa@test', JIRA_API_TOKEN: 'token', JIRA_PROJECT_KEY: 'QA', JIRA_DEFAULT_ASSIGNEE: 'account-id' }).jira!; assert.equal(jira.defaultAssigneeAccountId, 'account-id');
  const email = loadConfig('email', { SMTP_HOST: 'smtp', SMTP_USER: 'legacy', SMTP_PASSWORD: 'pass', EMAIL_FROM: 'from@test', TESTER_EMAIL: 'tester@test', PROJECT_MANAGER_EMAIL: 'pm@test' }).smtp!; assert.equal(email.username, 'legacy');
});

test('detects duplicate Jira defects, creates with accountId, updates matches, and records assignee', async () => {
  const calls: { url: string; method: string; body?: string }[] = []; let exists = false;
  const fetcher: typeof fetch = async (input, init) => { const url = String(input); const method = init?.method ?? 'GET'; const body = typeof init?.body === 'string' ? init.body : undefined; calls.push({ url, method, body }); if (url.endsWith('/search/jql')) return response({ issues: exists ? [{ key: 'QA-1' }] : [] }); if (url.endsWith('/issue') && method === 'POST') { exists = true; return response({ key: 'QA-1' }, 201); } if (url.includes('/issue/QA-1?fields=')) return response({ key: 'QA-1', fields: { assignee: { emailAddress: 'owner@test' } } }); if (url.endsWith('/comment')) return response({}, 201); throw new Error(`${method} ${url}`); };
  const client = new JiraClient(jiraConfig, fetcher); const first = summary('failed'); assert.deepEqual(await processDefects(first, client, 'QA', 100), { created: ['QA-1'], updated: [] }); assert.equal(first.tests[0].jiraIssue, 'QA-1'); assert.equal(first.tests[0].jiraUrl, 'https://jira.test/browse/QA-1'); assert.equal(first.tests[0].jiraAssigneeEmail, 'owner@test');
  const createBody = JSON.parse(calls.find((call) => call.url.endsWith('/issue'))!.body!); assert.equal(createBody.fields.assignee.accountId, 'account-123'); assert.equal(createBody.fields.summary, '[Automation] login - pw-0123456789abcdef - <script>required</script>'); assert.match(JSON.stringify(createBody.fields.description), /Environment: beta/);
  const second = summary('failed'); assert.deepEqual(await processDefects(second, client, 'QA', 100), { created: [], updated: ['QA-1'] }); assert.equal(second.tests[0].jiraAction, 'matched'); assert.equal(calls.filter((call) => call.url.endsWith('/issue')).length, 1);
});

test('attaches only screenshots below the configured limit', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'jira-evidence-')); const small = path.join(dir, 'small.png'); const large = path.join(dir, 'large.png'); await writeFile(small, 'x'); await writeFile(large, 'xxxxxxxxxx'); const value = summary('failed'); value.tests[0].attachments = [{ name: 'small', contentType: 'image/png', path: small }, { name: 'large', contentType: 'image/png', path: large }, { name: 'trace', contentType: 'application/zip', path: small }]; let attachments = 0;
  const fetcher: typeof fetch = async (input, init) => { const url = String(input); if (url.endsWith('/search/jql')) return response({ issues: [{ key: 'QA-1' }] }); if (url.includes('?fields=')) return response({ key: 'QA-1' }); if (url.endsWith('/comment')) return response({}, 201); if (url.endsWith('/attachments')) { attachments++; return response({}, 200); } throw new Error(String(init?.method)); };
  await processDefects(value, new JiraClient(jiraConfig, fetcher), 'QA', 5); assert.equal(attachments, 1);
});

test('Jira verification queries issue status and transitions and updates the same report row', async () => {
  const calls: string[] = []; const fetcher: typeof fetch = async (input, init) => { const url = String(input); calls.push(`${init?.method ?? 'GET'} ${url}`); if (url.includes('?fields=')) return response({ key: 'QA-7', fields: { status: { name: 'In Review' }, assignee: { emailAddress: 'owner@test' } } }); if (url.endsWith('/transitions') && init?.method !== 'POST') return response({ transitions: [{ id: '42', name: 'Done' }] }); return response(undefined, 204); };
  const item = result('passed'); await updateVerification(new JiraClient(jiraConfig, fetcher), 'QA-7', item, 'Done'); assert.equal(item.jiraIssue, 'QA-7'); assert.equal(item.verificationStatus, 'passed'); assert.equal(item.jiraAssigneeEmail, 'owner@test'); assert.ok(calls.some((call) => call.startsWith('GET') && call.endsWith('/transitions'))); assert.ok(calls.some((call) => call.startsWith('POST') && call.endsWith('/transitions')));
});

test('fresh Playwright list mapping resolves IDs and all target modes', () => {
  const output = '[chromium] › login.spec.ts:28:9 › OfficeKit HR login flows @login › displays required controls'; const targets = parseListOutput(output); assert.equal(targets.length, 1); assert.equal(targets[0].id, stableTestId('chromium', 'login.spec.ts', 'login.spec.ts > OfficeKit HR login flows @login > displays required controls')); assert.equal(resolveTestCaseId(targets[0].id, targets).file, 'login.spec.ts');
  assert.ok(buildTargetArgs({ mode: 'test', testCaseId: targets[0].id, targets }).includes('displays required controls$')); assert.ok(buildTargetArgs({ mode: 'module', module: 'login' }).includes('@login\\b')); assert.ok(buildTargetArgs({ mode: 'suite', testCaseId: targets[0].id, targets }).includes('login.spec.ts')); assert.equal(buildTargetArgs({ mode: 'full' }).includes('--grep'), false); assert.throws(() => resolveTestCaseId('missing', targets));
});

test('JSON report IDs and fresh list IDs are identical for the same test', () => {
  const report = normalizeReport({ stats: { startTime: '2026-09-16T00:00:00.000Z', duration: 100 }, suites: [{ title: 'login.spec.ts', file: 'login.spec.ts', specs: [{ title: 'OfficeKit HR login flows @login', tests: [{ title: 'displays required controls', projectName: 'chromium', results: [{ status: 'failed', duration: 100, error: { message: 'BROKEN FUNCTION' } }] }] }] }] }, { project: 'chromium', now: new Date('2026-09-16T00:00:00Z') });
  const jsonId = report.tests[0].id; const listTargets = parseListOutput('[chromium] › login.spec.ts:28:9 › OfficeKit HR login flows @login › displays required controls');
  const listId = listTargets[0].id; assert.equal(jsonId, listId);
});

test('GitHub dispatch sends the exact Jira workflow input names', async () => {
  let sent = ''; const input = { jira_issue: 'QA-9', test_case_id: 'pw-0123456789abcdef', module: 'login', target_mode: 'test' as const, test_environment: 'beta' }; await dispatchWorkflow({ owner: 'acme', repo: 'qa', token: 'token', workflow: 'jira-reverification.yml', ref: 'main' }, input, async (_url, init) => { sent = String(init?.body); return response(undefined, 204); }); assert.deepEqual(JSON.parse(sent).inputs, input); assert.deepEqual(Object.keys(JSON.parse(sent).inputs).sort(), ['jira_issue', 'module', 'target_mode', 'test_case_id', 'test_environment']);
});

test('all email templates use exact subjects, details, recipients, and mocked SMTP', async () => {
  const passed = summary('passed'); const failed = summary('failed'); failed.tests[0].jiraIssue = 'QA-1'; failed.tests[0].jiraAssigneeEmail = 'owner@test'; failed.tests[0].jiraAction = 'created'; failed.tests[0].verificationStatus = 'failed';
  assert.equal(renderExecutionEmail(passed).subject, '[Automation] OfficeKit UAT - Test Execution PASSED'); assert.equal(renderExecutionEmail(failed).subject, '[Automation] OfficeKit UAT - Test Execution FAILED'); assert.match(renderExecutionEmail(failed).html, /Failed test/); assert.equal(renderDefectEmail(failed, failed.tests[0]).subject, '[Automation] New Defect Created - QA-1'); assert.match(renderDefectEmail(failed, failed.tests[0]).html, /Environment: beta/); assert.equal(renderVerificationEmail(failed, failed.tests[0]).subject, '[Automation] Bug Verification FAILED - QA-1'); assert.match(renderVerificationEmail(failed, failed.tests[0]).html, /Screenshot: shot\.png/); failed.tests[0].verificationStatus = 'passed'; assert.equal(renderVerificationEmail(failed, failed.tests[0]).subject, '[Automation] Bug Verification PASSED - QA-1');
  assert.deepEqual(recipients(mailConfig, 'owner@test'), ['tester@test', 'pm@test', 'owner@test']); assert.deepEqual(recipients(mailConfig), ['tester@test', 'pm@test', 'dev@test']); let sent: unknown; await sendMail(renderExecutionEmail(passed), mailConfig, undefined, { sendMail: async (message: unknown) => { sent = message; } } as never); assert.match(JSON.stringify(sent), /tester@test,pm@test,dev@test/);
});

test('webhook validates secret, project, issue key, event, status, test ID, and dispatch values', () => {
  const target = { ...result(), title: 'required' }; const record = { id: target.id, file: target.file, title: target.title, fullTitle: target.fullTitle, module: target.module, project: target.project }; const body = { webhookEvent: 'jira:issue_updated', timestamp: 1, issue: { key: 'QA-9', fields: { project: { key: 'QA' }, status: { name: 'In Review' }, labels: [record.id] } }, changelog: { id: 'change-1', items: [{ field: 'status', toString: 'In Review' }] } };
  const event = parseInReviewEvent(body, 'QA', [record]); assert.deepEqual(event.inputs, { jira_issue: 'QA-9', test_case_id: record.id, module: 'login', target_mode: 'test', test_environment: 'beta' }); assert.equal(validSecret('same', 'same'), true); assert.equal(validSecret('bad', 'same'), false); assert.throws(() => parseInReviewEvent({ ...body, webhookEvent: 'jira:issue_created' }, 'QA', [record])); assert.throws(() => parseInReviewEvent({ ...body, issue: { ...body.issue, key: 'OTHER-1' } }, 'QA', [record])); assert.throws(() => parseInReviewEvent({ ...body, issue: { ...body.issue, fields: { ...body.issue.fields, status: { name: 'Done' } } } }, 'QA', [record])); assert.throws(() => parseInReviewEvent({ ...body, issue: { ...body.issue, fields: { ...body.issue.fields, labels: [] } } }, 'QA', [record]));
});

test('file-backed webhook idempotency survives store recreation and expires by TTL', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'webhook-events-')); const file = path.join(dir, 'events.json'); let now = 1000; const first = new FileEventStore(file, 100, () => now); assert.equal(await first.claim('event-1'), true); const restarted = new FileEventStore(file, 100, () => now); assert.equal(await restarted.claim('event-1'), false); now = 1101; assert.equal(await restarted.claim('event-1'), true); await restarted.release('event-1'); assert.equal(await restarted.claim('event-1'), true);
});

test('config validates SMTP_SECURE boolean and port bounds', () => {
  assert.throws(() => loadConfig('email', { SMTP_HOST: 'smtp', SMTP_SECURE: 'yes', SMTP_USER: 'x', SMTP_PASSWORD: 'p', EMAIL_FROM: 'from@test', TESTER_EMAIL: 't@test', PROJECT_MANAGER_EMAIL: 'pm@test' }));
  assert.throws(() => loadConfig('email', { SMTP_HOST: 'smtp', SMTP_SECURE: 'true', SMTP_PORT: '70000', SMTP_USER: 'x', SMTP_PASSWORD: 'p', EMAIL_FROM: 'from@test', TESTER_EMAIL: 't@test', PROJECT_MANAGER_EMAIL: 'pm@test' }));
  const email = loadConfig('email', { SMTP_HOST: 'smtp', SMTP_SECURE: 'false', SMTP_PORT: '1', SMTP_USER: 'x', SMTP_PASSWORD: 'p', EMAIL_FROM: 'from@test', TESTER_EMAIL: 't@test', PROJECT_MANAGER_EMAIL: 'pm@test' }).smtp!; assert.equal(email.port, 1); assert.equal(email.secure, false);
});

test('workflow validates config, preserves Playwright outcome, and uses canonical rerun inputs', async () => {
  const main = await readFile(path.join(process.cwd(), '.github/workflows/playwright.yml'), 'utf8'); const verify = await readFile(path.join(process.cwd(), '.github/workflows/jira-reverification.yml'), 'utf8'); assert.match(main, /Validate automation configuration[\s\S]*npm run validate:config -- runtime/); assert.match(main, /id: playwright[\s\S]*continue-on-error: true/); assert.match(main, /steps\.playwright\.outcome == 'failure'[\s\S]*run: exit 1/); for (const input of ['jira_issue:', 'test_case_id:', 'module:']) assert.match(verify, new RegExp(input)); assert.match(verify, /JIRA_REVIEW_RERUN_MODE/); assert.doesNotMatch(verify, /test_file:|test_title:/); assert.match(main, /npm run test:unit/); assert.match(verify, /npm run test:unit/);
});
