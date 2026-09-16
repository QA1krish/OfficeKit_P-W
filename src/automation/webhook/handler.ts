import { createHash, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DispatchInput } from '../github/dispatch';
import { TargetRecord } from '../types';

interface JiraWebhook { webhookEvent?: string; timestamp?: number; issue?: { key?: string; fields?: { project?: { key?: string }; status?: { name?: string }; labels?: string[]; description?: unknown } }; changelog?: { id?: string; items?: { field?: string; toString?: string }[] } }
export class FileEventStore {
  private pending = Promise.resolve();
  constructor(private readonly file: string, private readonly ttlMs: number, private readonly now = () => Date.now()) {}
  claim(id: string): Promise<boolean> { return this.serial(async () => { const events = await this.load(); const now = this.now(); for (const [key, expiry] of Object.entries(events)) if (expiry <= now) delete events[key]; if (events[id]) return false; events[id] = now + this.ttlMs; await this.save(events); return true; }); }
  release(id: string): Promise<void> { return this.serial(async () => { const events = await this.load(); delete events[id]; await this.save(events); }); }
  private serial<T>(operation: () => Promise<T>): Promise<T> { const next = this.pending.then(operation, operation); this.pending = next.then(() => undefined, () => undefined); return next; }
  private async load(): Promise<Record<string, number>> { try { const parsed = JSON.parse(await readFile(this.file, 'utf8')); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {}; throw error; } }
  private async save(events: Record<string, number>): Promise<void> { await mkdir(path.dirname(this.file), { recursive: true }); const temporary = `${this.file}.${process.pid}.tmp`; await writeFile(temporary, `${JSON.stringify(events, null, 2)}\n`); await rename(temporary, this.file); }
}
export function validSecret(received: string | undefined, expected: string): boolean { if (!received) return false; const left = Buffer.from(received); const right = Buffer.from(expected); return left.length === right.length && timingSafeEqual(left, right); }
function descriptionText(value: unknown): string { return typeof value === 'string' ? value : JSON.stringify(value ?? ''); }
export function parseInReviewEvent(body: JiraWebhook, projectKey: string, targets: TargetRecord[], rerunMode: DispatchInput['target_mode'] = 'test', environment = 'beta'): { eventId: string; inputs: DispatchInput } {
  if (body.webhookEvent !== 'jira:issue_updated') throw new Error('Unsupported Jira event');
  const issueKey = body.issue?.key ?? ''; if (body.issue?.fields?.project?.key !== projectKey || !new RegExp(`^${projectKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+$`).test(issueKey)) throw new Error('Unexpected Jira project or issue key');
  const changedToReview = body.changelog?.items?.some((item) => item.field === 'status' && item.toString?.toLowerCase() === 'in review');
  if (!changedToReview || body.issue.fields.status?.name?.toLowerCase() !== 'in review') throw new Error('Issue is not entering In Review');
  const ids = [...new Set([...(body.issue.fields.labels ?? []), descriptionText(body.issue.fields.description)].join(' ').match(/pw-[a-f0-9]{16}/gi) ?? [])];
  if (ids.length !== 1) throw new Error('Issue must contain one deterministic test ID'); const matches = targets.filter((target) => target.id.toLowerCase() === ids[0].toLowerCase()); if (matches.length !== 1) throw new Error('Test ID did not resolve uniquely');
  const target = matches[0]; const eventId = body.changelog?.id ?? createHash('sha256').update(`${issueKey}|${body.timestamp ?? ''}|${ids[0]}|in-review`).digest('hex');
  return { eventId, inputs: { jira_issue: issueKey, test_case_id: target.id, module: target.module, target_mode: rerunMode, test_environment: environment } };
}
export async function loadTargets(file: string): Promise<TargetRecord[]> { const parsed: unknown = JSON.parse(await readFile(file, 'utf8')); if (!Array.isArray(parsed)) throw new Error('Target registry must be an array'); return parsed as TargetRecord[]; }
