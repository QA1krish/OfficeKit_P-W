import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

async function main(): Promise<void> {
  for (const file of ['.github/workflows/playwright.yml', '.github/workflows/jira-reverification.yml']) {
    const parsed = parse(await readFile(file, 'utf8')) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object' || !parsed.jobs) throw new Error(`${file} is not a valid GitHub Actions workflow`);
  }
  console.log('Workflow YAML valid');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
