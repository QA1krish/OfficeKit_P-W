import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Page } from '@playwright/test';

export async function captureScreen(
  page: Page,
  moduleName: string,
  screenName: string,
): Promise<void> {
  const directory = path.join(process.cwd(), 'screenshots', moduleName);
  await mkdir(directory, { recursive: true });
  await page.screenshot({
    path: path.join(directory, `${screenName}.png`),
    fullPage: true,
  });
}
