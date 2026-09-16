import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadConfig } from '../src/automation/config';
import { JiraClient } from '../src/automation/jira/client';
import { processDefects, updateVerification } from '../src/automation/jira/process';
import { writeReports } from '../src/automation/reporting/report';
import { NormalizedTestResult, QaSummary } from '../src/automation/types';

async function main(): Promise<void> {
  const file = process.argv[2] ?? 'reports/summary.json'; const summary = JSON.parse(await readFile(file, 'utf8')) as QaSummary; const jira = loadConfig('jira').jira!; const client = new JiraClient(jira);
  try {
    const issueKey = process.env.JIRA_ISSUE; if (issueKey) { const requestedId = process.env.TEST_CASE_ID; let test = summary.tests.find((item) => !requestedId || item.id === requestedId); if (!test) { const synthetic: NormalizedTestResult = { id: requestedId ?? 'unknown', title: 'Target run failed before producing results', fullTitle: 'Target run failed', file: 'unknown', project: 'system', module: 'system', status: 'failed', durationMs: 0, error: 'Targeted verification run failed before producing test results', expected: '', actual: '', classification: 'automation', signature: '', attachments: [], screenshot: '', video: '', trace: '', tags: [], jiraIssue: '', jiraUrl: '', jiraAssigneeEmail: '', verificationStatus: 'not-run' }; test = synthetic; } test.jiraUrl = `${jira.baseUrl}/browse/${issueKey}`; await updateVerification(client, issueKey, test, process.env.JIRA_PASS_TRANSITION ?? ''); }
    else { await processDefects(summary, client, jira.projectKey, jira.evidenceMaxBytes); for (const test of summary.tests.filter((item) => item.jiraIssue)) test.jiraUrl = `${jira.baseUrl}/browse/${test.jiraIssue}`; }
  } finally { await writeReports(summary, path.dirname(file)); }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
