import { readFile } from 'node:fs/promises';
import { loadConfig } from '../src/automation/config';
import { createTransport, renderDefectEmail, renderExecutionEmail, renderVerificationEmail, sendMail } from '../src/automation/email/mailer';
import { QaSummary } from '../src/automation/types';

async function main(): Promise<void> {
  const summary = JSON.parse(await readFile(process.argv[2] ?? 'reports/summary.json', 'utf8')) as QaSummary; const config = loadConfig('email').smtp!; const transport = createTransport(config);
  if (process.env.JIRA_ISSUE) { const test = summary.tests.find((item) => item.jiraIssue === process.env.JIRA_ISSUE || item.id === process.env.TEST_CASE_ID); if (!test) throw new Error('Verification test result not found'); if (!test.jiraIssue) test.jiraIssue = process.env.JIRA_ISSUE; test.verificationStatus = test.status === 'passed' || test.status === 'flaky' ? 'passed' : 'failed'; await sendMail(renderVerificationEmail(summary, test), config, test.jiraAssigneeEmail, transport); return; }
  const messages = [renderExecutionEmail(summary), ...summary.tests.filter((item) => item.jiraAction === 'created').map((test) => renderDefectEmail(summary, test))];
  for (const template of messages) { try { await sendMail(template, config); } catch (error) { console.error(error instanceof Error ? error.message : error); } }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
