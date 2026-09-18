import { Locator, Page } from '@playwright/test';

export class ApplicationModulePage {
  readonly navigation: Locator;

  constructor(
    readonly page: Page,
    readonly moduleName: string,
  ) {
    this.navigation = page
      .getByRole('link', { name: moduleName, exact: true })
      .or(page.getByRole('button', { name: moduleName, exact: true }))
      .first();
  }

  async open(): Promise<void> {
    await this.navigation.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  heading(name: string | RegExp = this.moduleName): Locator {
    return this.page.getByRole('heading', { name }).first();
  }
}
