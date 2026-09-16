import path from 'node:path';
import { stableTestId } from './results';
import { TargetRecord } from '../types';

export interface TargetOptions { mode: string; testCaseId?: string; module?: string; targets?: TargetRecord[] }
function escapeRegex(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

export function parseListOutput(output: string): TargetRecord[] {
  const targets: TargetRecord[] = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.trim().match(/^\[([^\]]+)]\s+›\s+(.+?):\d+:\d+\s+›\s+(.+)$/);
    if (!match) continue;
    const project = match[1]; const file = match[2].replace(/\\/g, '/'); const titles = match[3].split(/\s+›\s+/); const title = titles.at(-1)!;
    const fullTitle = [path.basename(file), ...titles].join(' > '); const module = match[3].match(/@([a-z][\w-]+)/i)?.[1] ?? path.basename(file).replace(/\.spec\.ts$/, '');
    targets.push({ id: stableTestId(project, file, fullTitle), file, title, fullTitle, module, project });
  }
  return targets;
}

export function resolveTestCaseId(id: string, targets: TargetRecord[]): TargetRecord {
  const matches = targets.filter((target) => target.id === id);
  if (matches.length !== 1) throw new Error(`Test case ID must resolve exactly once: ${id}`);
  return matches[0];
}

export function buildTargetArgs(options: TargetOptions): string[] {
  const args = ['test', '--project=chromium', '--grep-invert', '@mutating'];
  if (options.mode === 'test') {
    if (!options.testCaseId || !options.targets) throw new Error('test targeting requires TEST_CASE_ID and fresh collection targets');
    const target = resolveTestCaseId(options.testCaseId, options.targets); args.push(target.file, '--grep', `${escapeRegex(target.title)}$`);
  } else if (options.mode === 'module') {
    if (!options.module) throw new Error('module targeting requires MODULE');
    if (options.targets) { const moduleTargets = options.targets.filter((t) => t.module === options.module); if (!moduleTargets || moduleTargets.length === 0) throw new Error(`No tests found for module: ${options.module}`); }
    args.push('--grep', `@${escapeRegex(options.module)}\\b`);
  } else if (options.mode === 'suite') {
    if (!options.testCaseId || !options.targets) throw new Error('suite targeting requires TEST_CASE_ID and fresh collection targets'); args.push(resolveTestCaseId(options.testCaseId, options.targets).file);
  } else if (options.mode !== 'full') throw new Error(`Unsupported target mode: ${options.mode}`);
  return args;
}
