import { Locator, Page } from '@playwright/test';

export class UserDashboardPage {
  readonly dashboardLink: Locator;
  readonly pmsLink: Locator;
  readonly taskLink: Locator;
  readonly greeting: Locator;
  readonly userProfileButton: Locator;
  readonly totalHours: Locator;
  readonly requestsAndApprovals: Locator;
  readonly reports: Locator;
  readonly myTeam: Locator;
  readonly feeds: Locator;

  constructor(
    readonly page: Page,
    private readonly sleepTime = 0,
  ) {
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
    this.pmsLink = page.getByRole('link', { name: 'PMS', exact: true });
    this.taskLink = page.getByRole('link', { name: 'Task', exact: true });
    this.greeting = page.getByRole('heading', { name: /Good (Morning|Afternoon|Evening), Athul/ });
    this.userProfileButton = page.getByRole('button', { name: /Athul Krishn/ });
    this.totalHours = page.getByText('Total Hours', { exact: true });
    this.requestsAndApprovals = page.getByText('Request and Approvals', { exact: true });
    this.reports = page.getByText('Reports', { exact: true }).first();
    this.myTeam = page.getByText('My Team', { exact: true }).first();
    this.feeds = page.getByText('Feeds', { exact: true }).first();
  }

  private async pause(): Promise<void> {
    if (this.sleepTime > 0) {
      await this.page.waitForTimeout(this.sleepTime);
    }
  }

  sidebarButton(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  quickAccessHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  quickAccessCard(name: string): Locator {
    return this.quickAccessHeading(name).locator(
      'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " carousel-item ")]',
    );
  }

  async clickPms(): Promise<void> {
    await this.pmsLink.click();
    await this.pause();
  }

  async clickTask(): Promise<void> {
    await this.taskLink.click();
    await this.pause();
  }

  async clickQuickAccessCard(name: string): Promise<void> {
    await this.quickAccessCard(name).click();
    await this.pause();
  }
}
