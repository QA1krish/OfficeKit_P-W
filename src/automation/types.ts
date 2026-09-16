export type FailureClassification = 'application' | 'automation' | 'infrastructure' | 'environment' | 'configuration';
export type TestStatus = 'passed' | 'failed' | 'skipped' | 'flaky';
export type VerificationStatus = 'not-run' | 'passed' | 'failed';

export interface EvidenceAttachment { name: string; contentType: string; path?: string }

export interface NormalizedTestResult {
  id: string;
  title: string;
  fullTitle: string;
  file: string;
  project: string;
  module: string;
  status: TestStatus;
  durationMs: number;
  error: string;
  expected: string;
  actual: string;
  classification?: FailureClassification;
  signature?: string;
  attachments: EvidenceAttachment[];
  screenshot: string;
  video: string;
  trace: string;
  tags: string[];
  jiraIssue: string;
  jiraUrl: string;
  jiraAction?: 'created' | 'matched';
  jiraAssigneeEmail: string;
  verificationStatus: VerificationStatus;
}

export interface ModuleSummary { module: string; total: number; passed: number; failed: number; skipped: number; flaky: number; passPercentage: number; failPercentage: number }

export interface QaSummary {
  generatedAt: string;
  project: string;
  environment: string;
  branch: string;
  commit: string;
  runUrl: string;
  reportUrl: string;
  summaryUrl: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  totals: { total: number; passed: number; failed: number; skipped: number; flaky: number };
  passPercentage: number;
  failPercentage: number;
  overallResult: 'PASSED' | 'FAILED';
  modules: ModuleSummary[];
  tests: NormalizedTestResult[];
}

export interface TargetRecord { id: string; file: string; title: string; fullTitle: string; module: string; project: string }
