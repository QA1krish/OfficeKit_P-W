import { access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { parsePlaywrightReport, SummaryMetadata, syntheticFailure } from '../src/automation/reporting/results';
import { writeReports } from '../src/automation/reporting/report';

async function main(): Promise<void> {
  const input = process.argv[2] ?? 'test-results/results.json'; const output = process.argv[3] ?? 'reports';
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : undefined;
  const git = (...arguments_: string[]) => { try { return execFileSync('git', ['rev-parse', ...arguments_], { encoding: 'utf8' }).trim(); } catch { return 'unknown'; } };
  const metadata: SummaryMetadata = { project: process.env.AUTOMATION_PROJECT ?? 'OfficeKit UAT', environment: process.env.TEST_ENV ?? 'beta', branch: process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || git('--abbrev-ref', 'HEAD'), commit: process.env.GITHUB_SHA || git('HEAD'), runUrl, reportUrl: runUrl ? `${runUrl}#artifacts` : undefined, summaryUrl: runUrl ? `${runUrl}#artifacts` : undefined };
  let summary; let hadError = false; try { await access(input); summary = await parsePlaywrightReport(input, metadata); } catch (error) { hadError = true; const reason = process.env.PLAYWRIGHT_PRE_RESULT_ERROR || `Playwright result unavailable: ${error instanceof Error ? error.message : error}`; summary = syntheticFailure(reason, metadata); }
  await writeReports(summary, output);
  if (hadError || summary.overallResult === 'FAILED') process.exitCode = 1;
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
