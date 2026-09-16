import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { EvidenceAttachment, FailureClassification, ModuleSummary, NormalizedTestResult, QaSummary, TargetRecord, TestStatus } from '../types';

interface PwError { message?: string; stack?: string; value?: string }
interface PwAttachment { name?: string; contentType?: string; path?: string }
interface PwResult { status?: string; duration?: number; error?: PwError; errors?: PwError[]; attachments?: PwAttachment[] }
interface PwTest { title?: string; projectName?: string; tags?: string[]; results?: PwResult[] }
interface PwSuite { title?: string; file?: string; specs?: { title?: string; tests?: PwTest[] }[]; suites?: PwSuite[] }
interface PwReport { suites?: PwSuite[]; stats?: { startTime?: string; duration?: number } }
export interface SummaryMetadata { project?: string; environment?: string; branch?: string; commit?: string; runUrl?: string; reportUrl?: string; summaryUrl?: string; now?: Date }

const APP_MARKER = /BROKEN FUNCTION\b/i;
const CONFIG_MARKERS = /configuration|config error|missing required|unknown project|no tests found/i;
const ENV_MARKERS = /ECONNREFUSED|ENOTFOUND|certificate|baseURL|environment|401 Unauthorized|403 Forbidden/i;
const INFRA_MARKERS = /browser.*(?:closed|launch|install)|timeout.*(?:navigation|setup)|worker process|disk full|runner|result unavailable/i;
const AUTOMATION_MARKERS = /locator|strict mode|element.*(?:not found|detached)|selector|expect\(.+\).*timed out/i;

export function stableTestId(project: string, file: string, fullTitle: string): string {
  return `pw-${createHash('sha256').update(`${project}|${file.replace(/\\/g, '/')}|${fullTitle}`.toLowerCase()).digest('hex').slice(0, 16)}`;
}
export function failureSignature(error: string): string { return createHash('sha256').update(error.replace(/https?:\/\/\S+/g, '<url>').replace(/\b\d+\b/g, '#').replace(/\s+/g, ' ').trim().toLowerCase()).digest('hex').slice(0, 16); }
export function classifyFailure(error: string): FailureClassification {
  if (APP_MARKER.test(error)) return 'application';
  if (CONFIG_MARKERS.test(error)) return 'configuration';
  if (ENV_MARKERS.test(error)) return 'environment';
  if (INFRA_MARKERS.test(error)) return 'infrastructure';
  if (AUTOMATION_MARKERS.test(error)) return 'automation';
  return 'automation';
}
function percentage(value: number, total: number): number { return total ? Number(((value / total) * 100).toFixed(2)) : 0; }
function moduleFrom(file: string, titles: string[]): string { return titles.join(' ').match(/@([a-z][\w-]+)/i)?.[1] ?? path.basename(file, path.extname(file)).replace(/\.spec$/, ''); }
function evidence(attachment: PwAttachment): EvidenceAttachment { return { name: attachment.name ?? path.basename(attachment.path ?? 'attachment'), contentType: attachment.contentType ?? 'application/octet-stream', path: attachment.path }; }
function evidencePath(attachments: EvidenceAttachment[], type: 'screenshot' | 'video' | 'trace'): string | undefined {
  const matcher = type === 'screenshot' ? /^image\// : type === 'video' ? /^video\// : /zip|trace/i;
  return attachments.find((item) => matcher.test(item.contentType) || matcher.test(item.name))?.path;
}
function expectedActual(error: string): { expected?: string; actual?: string } {
  return { expected: error.match(/Expected:\s*([^\n]+)/i)?.[1]?.trim(), actual: error.match(/(?:Received|Actual):\s*([^\n]+)/i)?.[1]?.trim() };
}
function collect(suite: PwSuite, parents: string[], output: NormalizedTestResult[]): void {
  const nextParents = suite.title ? [...parents, suite.title] : parents;
  for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
    const title = test.title ?? spec.title ?? 'Unnamed test';
    const fullTitle = [...nextParents, spec.title && spec.title !== title ? spec.title : undefined, title].filter(Boolean).join(' > ');
    const file = suite.file ?? '';
    const project = test.projectName ?? 'unknown';
    const attempts = test.results ?? [];
    const final = attempts.at(-1) ?? {};
    const rawStatus = final.status ?? 'skipped';
    const status: TestStatus = rawStatus === 'passed' && attempts.some((item) => item.status === 'failed') ? 'flaky' : rawStatus === 'passed' ? 'passed' : rawStatus === 'skipped' ? 'skipped' : 'failed';
    const error = [final.error?.message, final.error?.stack, final.error?.value, ...(final.errors ?? []).flatMap((item) => [item.message, item.stack, item.value])].filter(Boolean).join('\n');
    const attachments = attempts.flatMap((item) => item.attachments ?? []).map(evidence);
    output.push({
      id: stableTestId(project, file, fullTitle), title, fullTitle, file, project, module: moduleFrom(file, [...nextParents, title, ...(test.tags ?? [])]), status,
      durationMs: Math.round(attempts.reduce((sum, item) => sum + (item.duration ?? 0), 0)), error, expected: expectedActual(error).expected ?? '', actual: expectedActual(error).actual ?? '',
      classification: status === 'failed' ? classifyFailure(error) : undefined, signature: status === 'failed' ? failureSignature(error) : undefined,
      attachments, screenshot: evidencePath(attachments, 'screenshot') ?? '', video: evidencePath(attachments, 'video') ?? '', trace: evidencePath(attachments, 'trace') ?? '',
      tags: test.tags ?? [], jiraIssue: '', jiraUrl: '', jiraAssigneeEmail: '', verificationStatus: 'not-run',
    });
  }
  for (const child of suite.suites ?? []) collect(child, nextParents, output);
}
export function calculateModules(tests: NormalizedTestResult[]): ModuleSummary[] {
  return [...new Set(tests.map((test) => test.module))].sort().map((module) => {
    const items = tests.filter((test) => test.module === module); const count = (status: TestStatus) => items.filter((item) => item.status === status).length;
    return { module, total: items.length, passed: count('passed'), failed: count('failed'), skipped: count('skipped'), flaky: count('flaky'), passPercentage: percentage(count('passed') + count('flaky'), items.length), failPercentage: percentage(count('failed'), items.length) };
  });
}
export function normalizeReport(report: PwReport, metadata: SummaryMetadata = {}): QaSummary {
  const tests: NormalizedTestResult[] = []; for (const suite of report.suites ?? []) collect(suite, [], tests);
  const count = (status: TestStatus) => tests.filter((test) => test.status === status).length;
  const start = report.stats?.startTime ? new Date(report.stats.startTime) : metadata.now ?? new Date();
  const durationMs = Math.round(report.stats?.duration ?? tests.reduce((sum, test) => sum + test.durationMs, 0)); const end = new Date(start.getTime() + durationMs);
  const failed = count('failed'); const passed = count('passed'); const flaky = count('flaky');
  return {
    generatedAt: (metadata.now ?? new Date()).toISOString(), project: metadata.project ?? 'OfficeKit UAT', environment: metadata.environment ?? 'unknown', branch: metadata.branch ?? 'unknown', commit: metadata.commit ?? 'unknown',
    runUrl: metadata.runUrl ?? 'unavailable', reportUrl: metadata.reportUrl ?? 'unavailable', summaryUrl: metadata.summaryUrl ?? 'unavailable', startedAt: start.toISOString(), endedAt: end.toISOString(), durationMs,
    totals: { total: tests.length, passed, failed, skipped: count('skipped'), flaky }, passPercentage: percentage(passed + flaky, tests.length), failPercentage: percentage(failed, tests.length),
    overallResult: failed ? 'FAILED' : 'PASSED', modules: calculateModules(tests), tests,
  };
}
export function syntheticFailure(error: string, metadata: SummaryMetadata = {}): QaSummary {
  const now = metadata.now ?? new Date(); const classification = classifyFailure(error); const id = stableTestId('system', 'pre-result', 'Playwright pre-result failure');
  return normalizeReport({ stats: { startTime: now.toISOString(), duration: 0 }, suites: [{ title: 'Pre-result', file: 'pre-result', specs: [{ title: 'Playwright pre-result failure', tests: [{ title: 'Playwright pre-result failure', projectName: 'system', results: [{ status: 'failed', duration: 0, error: { message: error } }] }] }] }] }, metadata);
}
export async function parsePlaywrightReport(file: string, metadata: SummaryMetadata = {}): Promise<QaSummary> { return normalizeReport(JSON.parse(await readFile(file, 'utf8')) as PwReport, metadata); }
export function targetsFrom(summary: QaSummary): TargetRecord[] { return summary.tests.map(({ id, file, title, fullTitle, module, project }) => ({ id, file, title, fullTitle, module, project })); }
