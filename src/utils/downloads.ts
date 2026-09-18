import { expect, Locator, Page } from '@playwright/test';

export async function expectSuccessfulDownload(page: Page, button: Locator): Promise<void> {
  const downloadPromise = page.waitForEvent('download').catch((error: Error) => {
    throw new Error(`BROKEN FUNCTION: download action did not start. ${error.message}`);
  });
  const [download] = await Promise.all([downloadPromise, button.click()]);
  expect(download.suggestedFilename(), 'BROKEN FUNCTION: download has no filename').not.toBe('');
  expect(await download.failure(), 'BROKEN FUNCTION: download did not complete').toBeNull();
}
