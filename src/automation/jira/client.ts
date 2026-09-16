import { readFile } from 'node:fs/promises';

export interface JiraIssue { key: string; fields?: { status?: { name?: string }; assignee?: { accountId?: string; emailAddress?: string; displayName?: string } } }
export interface JiraTransition { id: string; name: string; to?: { name?: string } }
export class JiraClient {
  constructor(private readonly config: { baseUrl: string; email: string; token: string; projectKey: string; defaultAssigneeAccountId: string }, private readonly fetcher: typeof fetch = fetch) {}
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await this.fetcher(`${this.config.baseUrl}/rest/api/3${path}`, { ...init, headers: { Authorization: `Basic ${Buffer.from(`${this.config.email}:${this.config.token}`).toString('base64')}`, Accept: 'application/json', ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init.headers } });
    if (!response.ok) throw new Error(`Jira ${init.method ?? 'GET'} ${path} failed: ${response.status} ${await response.text()}`);
    return response.status === 204 ? undefined as T : await response.json() as T;
  }
  async search(jql: string): Promise<JiraIssue[]> { return (await this.request<{ issues: JiraIssue[] }>('/search/jql', { method: 'POST', body: JSON.stringify({ jql, fields: ['status', 'assignee'], maxResults: 20 }) })).issues; }
  issueUrl(key: string): string { return `${this.config.baseUrl}/browse/${encodeURIComponent(key)}`; }
  async getIssue(key: string): Promise<JiraIssue> { return this.request(`/issue/${encodeURIComponent(key)}?fields=status,assignee`); }
  async createBug(summary: string, description: string, labels: string[]): Promise<JiraIssue> {
    return this.request('/issue', { method: 'POST', body: JSON.stringify({ fields: { project: { key: this.config.projectKey }, issuetype: { name: 'Bug' }, assignee: { accountId: this.config.defaultAssigneeAccountId }, summary, description: adf(description), labels } }) });
  }
  async comment(key: string, body: string): Promise<void> { await this.request(`/issue/${encodeURIComponent(key)}/comment`, { method: 'POST', body: JSON.stringify({ body: adf(body) }) }); }
  async attach(key: string, file: string): Promise<void> { const form = new FormData(); form.append('file', new Blob([await readFile(file)]), file.split(/[\\/]/).at(-1)); await this.request(`/issue/${encodeURIComponent(key)}/attachments`, { method: 'POST', headers: { 'X-Atlassian-Token': 'no-check' }, body: form }); }
  async transitions(key: string): Promise<JiraTransition[]> { return (await this.request<{ transitions: JiraTransition[] }>(`/issue/${encodeURIComponent(key)}/transitions`)).transitions; }
  async transitionByName(key: string, desired: string): Promise<boolean> { const match = (await this.transitions(key)).find((item) => item.name.toLowerCase() === desired.toLowerCase() || item.to?.name?.toLowerCase() === desired.toLowerCase()); if (!match) return false; await this.request(`/issue/${encodeURIComponent(key)}/transitions`, { method: 'POST', body: JSON.stringify({ transition: { id: match.id } }) }); return true; }
}
function adf(text: string): object { return { version: 1, type: 'doc', content: text.split('\n').map((line) => ({ type: 'paragraph', content: line ? [{ type: 'text', text: line }] : [] })) }; }
