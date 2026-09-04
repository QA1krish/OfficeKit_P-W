import { Locator, Page } from '@playwright/test';

export class CalendarPage {
  readonly headerCalendarButton: Locator;
  readonly selectEmployeeButton: Locator;
  readonly employeeSearchInput: Locator;
  readonly employeeDialog: Locator;
  readonly yearButton: Locator;
  readonly monthButton: Locator;
  readonly todayButton: Locator;
  readonly previousMonthButton: Locator;
  readonly nextMonthButton: Locator;
  readonly calendarDensityButton: Locator;
  readonly dayActionButtons: Locator;
  readonly actionsDialog: Locator;

  constructor(
    readonly page: Page,
    private readonly sleepTime = 0,
  ) {
    this.headerCalendarButton = page
      .locator('svg path[d^="M9.16406 11.667"]')
      .locator('xpath=ancestor::div[contains(@class,"cursor-pointer")][1]');
    this.selectEmployeeButton = page.getByRole('button', {
      name: 'Select employee',
      exact: true,
    });
    this.employeeSearchInput = page.getByPlaceholder('Search employee');
    this.employeeDialog = page.locator('[role="dialog"]').filter({
      has: this.employeeSearchInput,
    });
    this.yearButton = page.getByRole('combobox', { name: 'Select year' });
    this.monthButton = page.getByRole('combobox', { name: 'Select month' });
    this.todayButton = page.getByRole('button', { name: 'Today', exact: true });
    this.previousMonthButton = page.getByRole('button', { name: 'Previous month' });
    this.nextMonthButton = page.getByRole('button', { name: 'Next month' });
    this.calendarDensityButton = page.getByRole('combobox', { name: 'Calendar density' });
    this.dayActionButtons = page.getByRole('button', { name: 'Open day actions' });
    this.actionsDialog = page.locator('[role="dialog"]').filter({
      hasText: 'RAISE A REQUEST',
    });
  }

  private async pause(): Promise<void> {
    if (this.sleepTime > 0) {
      await this.page.waitForTimeout(this.sleepTime);
    }
  }

  filterButton(name: 'ALL' | 'ACTIVE' | 'NOT ACTIVE'): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  applicationButton(name: string): Locator {
    return this.actionsDialog.getByRole('button', {
      name: new RegExp(`^${name}`, 'i'),
    });
  }

  applicationHeading(name: string): Locator {
    return this.page.getByText(name, { exact: true }).first();
  }

  async openFromDashboard(): Promise<void> {
    await this.page
      .getByRole('heading', { name: /Good (Morning|Afternoon|Evening), Athul/ })
      .waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(2000);
    await this.headerCalendarButton.evaluate((element: HTMLElement) => element.click());
    await this.page.waitForURL(/\/my-profile\/calendar/, { timeout: 30000 });
    await this.selectEmployeeButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.pause();
  }

  async selectFilter(name: 'ALL' | 'ACTIVE' | 'NOT ACTIVE'): Promise<void> {
    await this.filterButton(name).click();
    await this.filterButton(name).waitFor({ state: 'visible' });
    await this.pause();
  }

  async openEmployeeList(): Promise<void> {
    await this.selectEmployeeButton.click();
    await this.employeeSearchInput.waitFor({ state: 'visible' });
    await this.pause();
  }

  async closeEmployeeList(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.employeeSearchInput.waitFor({ state: 'hidden' });
  }

  async selectFirstEmployee(): Promise<string> {
    const firstEmployee = this.employeeDialog.locator('button').first();
    await firstEmployee.waitFor({ state: 'visible' });
    const employeeName = (await firstEmployee.innerText()).split('\n')[0].trim();
    await firstEmployee.click();
    await this.pause();
    return employeeName;
  }

  async openFirstDayActions(): Promise<void> {
    await this.dayActionButtons.first().click();
    await this.actionsDialog.waitFor({ state: 'visible' });
    await this.pause();
  }

  async openApplication(name: string): Promise<void> {
    await this.applicationButton(name).click();
    await this.pause();
  }
}
