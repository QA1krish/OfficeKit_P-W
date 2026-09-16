export interface DispatchInput { jira_issue: string; test_case_id: string; module: string; target_mode: 'test' | 'module' | 'suite' | 'full'; test_environment: string }
export async function dispatchWorkflow(config: { owner: string; repo: string; token: string; workflow: string; ref: string }, inputs: DispatchInput, fetcher: typeof fetch = fetch): Promise<void> {
  const response = await fetcher(`https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/actions/workflows/${encodeURIComponent(config.workflow)}/dispatches`, { method: 'POST', headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${config.token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: config.ref, inputs }) });
  if (!response.ok) throw new Error(`GitHub workflow dispatch failed: ${response.status} ${await response.text()}`);
}
