import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly dashboardLink: Locator;
  readonly profileButton: Locator;
  readonly userProfileButton: Locator;
  readonly greeting: Locator;
  readonly pmsLink: Locator;
  readonly taskLink: Locator;
  readonly attendanceSummary: Locator;
  readonly requestsAndApprovals: Locator;
  readonly myTeam: Locator;
  readonly feeds: Locator;

  constructor(
    readonly page: Page,
    private readonly sleepTime = 0,
  ) {
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
    this.profileButton = page.getByRole('button', { name: 'My Profile', exact: true });
    this.userProfileButton = page.getByRole('button', { name: /Faizan Lanka/ });
    this.greeting = page.getByRole('heading', { name: /Good (Morning|Afternoon|Evening), Faizan/ });
    this.pmsLink = page.getByRole('link', { name: 'PMS', exact: true });
    this.taskLink = page.getByRole('link', { name: 'Task', exact: true });
    this.attendanceSummary = page.getByText('Attendance Summary', { exact: true });
    this.requestsAndApprovals = page.getByText('Request & Approvals', { exact: true }).first();
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

  summaryMetric(name: string): Locator {
    return this.page.getByText(name, { exact: true }).first();
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
