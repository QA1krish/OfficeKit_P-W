import { stat } from 'node:fs/promises';
import { NormalizedTestResult, QaSummary } from '../types';
import { JiraClient, JiraIssue } from './client';

export interface DefectResult { created: string[]; updated: string[] }
export function jiraLabels(test: NormalizedTestResult): string[] { return [`qa-test-${test.id}`, `qa-module-${safeLabel(test.module)}`, `qa-signature-${test.signature}`]; }
function safeLabel(value: string | undefined): string { return (value ?? 'unknown').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').slice(0, 200); }
function quoteJql(value: string): string { return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }
export async function findMatchingIssue(client: JiraClient, projectKey: string, test: NormalizedTestResult): Promise<JiraIssue | undefined> { const labels = jiraLabels(test); return (await client.search(`project = "${quoteJql(projectKey)}" AND issuetype = Bug AND labels = "${labels[0]}" AND labels = "${labels[1]}" AND labels = "${labels[2]}" ORDER BY updated DESC`))[0]; }
function details(summary: QaSummary, test: NormalizedTestResult): string {
  return [`Automated application failure`, `Test ID: ${test.id}`, `Test name: ${test.title}`, `Module: ${test.module}`, `Environment: ${summary.environment}`, `Branch: ${summary.branch}`, `Commit: ${summary.commit}`, `Run: ${summary.runUrl ?? 'unavailable'}`, `Report: ${summary.reportUrl ?? 'unavailable'}`, `Summary: ${summary.summaryUrl ?? 'unavailable'}`, `Trace/video/large evidence: ${summary.reportUrl ?? summary.runUrl ?? 'unavailable'}`, `Expected: ${test.expected ?? 'See automated test expectation'}`, `Actual: ${test.actual ?? test.error ?? 'No actual value captured'}`, `Error: ${test.error ?? 'No error text'}`, `Execution time: ${test.durationMs} ms`].join('\n');
}
async function attachSmallScreenshots(client: JiraClient, issueKey: string, test: NormalizedTestResult, maxBytes: number): Promise<void> {
  for (const attachment of test.attachments.filter((item) => item.path && item.contentType.startsWith('image/'))) {
    try { if ((await stat(attachment.path!)).size <= maxBytes) await client.attach(issueKey, attachment.path!); } catch (error) { console.error(error instanceof Error ? error.message : 'Attachment failed'); }
  }
}
export async function processDefects(summary: QaSummary, client: JiraClient, projectKey: string, evidenceMaxBytes: number): Promise<DefectResult> {
  const result: DefectResult = { created: [], updated: [] };
  for (const test of summary.tests.filter((item) => item.status === 'failed' && item.classification === 'application')) {
    try {
      const existing = await findMatchingIssue(client, projectKey, test);
      const issue = existing ?? await client.createBug(`[Automation] ${test.module} - ${test.id} - ${test.title}`, details(summary, test), jiraLabels(test));
      if (existing) { await client.comment(issue.key, details(summary, test)); result.updated.push(issue.key); test.jiraAction = 'matched'; } else { result.created.push(issue.key); test.jiraAction = 'created'; }
      test.jiraIssue = issue.key; test.jiraUrl = client.issueUrl(issue.key);
      const current = await client.getIssue(issue.key); test.jiraAssigneeEmail = current.fields?.assignee?.emailAddress ?? '';
      await attachSmallScreenshots(client, issue.key, test, evidenceMaxBytes);
    } catch (error) { console.error(error instanceof Error ? error.message : 'Jira processing failed'); }
  }
  return result;
}
export async function updateVerification(client: JiraClient, issueKey: string, test: NormalizedTestResult, passTransition = ''): Promise<void> {
  test.jiraIssue = issueKey; test.jiraUrl = client.issueUrl(issueKey); test.verificationStatus = test.status === 'passed' || test.status === 'flaky' ? 'passed' : 'failed';
  await client.comment(issueKey, `Automated re-verification ${test.verificationStatus.toUpperCase()}\nTest ID: ${test.id}\nError: ${test.error ?? 'none'}`);
  const issue = await client.getIssue(issueKey); test.jiraAssigneeEmail = issue.fields?.assignee?.emailAddress ?? '';
  if (test.verificationStatus === 'passed' && passTransition) { const transitioned = await client.transitionByName(issueKey, passTransition); if (!transitioned) throw new Error(`Pass transition '${passTransition}' was unavailable for issue ${issueKey}`); }
}
