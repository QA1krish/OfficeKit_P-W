import { Locator, Page } from '@playwright/test';

export type FinancialModule = 'Loans' | 'Advance' | 'Claims';
export type FinancialWorkspace = 'Request' | 'Approval';

const moduleRoutes: Record<FinancialModule, string> = {
  Loans: 'loan',
  Advance: 'advance',
  Claims: 'claims',
};

export class FinancialRequestsPage {
  readonly heading: Locator;
  readonly addRequestButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly exportButton: Locator;
  readonly requestRows: Locator;
  readonly noRequestsMessage: Locator;
  readonly viewButtons: Locator;
  readonly approversHeading: Locator;
  readonly requestFormPanel: Locator;
  readonly approvalWorkflowHeading: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(
    readonly page: Page,
    private readonly sleepTime = 0,
  ) {
    this.heading = page.getByRole('heading', { name: 'Request & Approvals', exact: true });
    this.addRequestButton = page.getByRole('button', { name: /Add Request$/ }).first();
    this.searchInput = page.getByRole('searchbox', {
      name: 'Search employee requests',
      exact: true,
    });
    this.statusFilter = page.getByRole('combobox').first();
    this.exportButton = page.getByRole('button', { name: 'Export', exact: true });
    this.requestRows = page.locator('tbody tr');
    this.noRequestsMessage = page.getByText(
      /^(?:No Request Available!|No claim requests found\.|No approval claims found\.)$/,
    );
    this.viewButtons = page.getByRole('button', { name: 'View', exact: true });
    this.approversHeading = page.getByRole('heading', { name: 'Approvers', exact: true });
    this.requestFormPanel = page.locator('div.fixed.inset-0').last();
    this.approvalWorkflowHeading = this.requestFormPanel.getByRole('heading', {
      name: 'Approval Workflow',
      exact: true,
    });
    this.cancelButton = this.requestFormPanel.getByRole('button', {
      name: 'Cancel',
      exact: true,
    });
    this.submitButton = this.requestFormPanel.getByRole('button', {
      name: 'Submit Request',
      exact: true,
    });
  }

  private async pause(): Promise<void> {
    if (this.sleepTime > 0) {
      await this.page.waitForTimeout(this.sleepTime);
    }
  }

  moduleButton(module: FinancialModule): Locator {
    return this.page.getByRole('button', { name: module, exact: true });
  }

  workspaceTab(workspace: FinancialWorkspace): Locator {
    return this.page.getByRole('button', { name: workspace, exact: true });
  }

  routeFor(module: FinancialModule, workspace: FinancialWorkspace): RegExp {
    return new RegExp(
      `/my-profile/request-approvals/${moduleRoutes[module]}/${workspace.toLowerCase()}$`,
    );
  }

  requestFormHeading(module: FinancialModule): Locator {
    const singular = module === 'Loans' ? 'Loan' : module;
    return this.requestFormPanel.getByRole('heading', {
      name: `New ${singular} Request`,
      exact: true,
    });
  }

  async openFromProfile(): Promise<void> {
    await this.page.getByRole('button', { name: 'My Profile', exact: true }).click();
    await this.page.getByRole('link', { name: 'Requests & Approvals', exact: true }).click();
    await this.heading.waitFor({ state: 'visible' });
    await this.pause();
  }

  async openModule(module: FinancialModule): Promise<void> {
    await this.moduleButton(module).click();
    await this.page.waitForURL(this.routeFor(module, 'Request'));
    await this.searchInput.waitFor({ state: 'visible' });
    await this.pause();
  }

  async openWorkspace(module: FinancialModule, workspace: FinancialWorkspace): Promise<void> {
    if (!this.routeFor(module, 'Request').test(this.page.url())) {
      await this.openModule(module);
    }
    if (workspace !== 'Request') {
      await this.workspaceTab(workspace).click();
      await this.page.waitForURL(this.routeFor(module, workspace));
      await this.searchInput.waitFor({ state: 'visible' });
      await this.pause();
    }
  }

  async openStatusFilter(): Promise<void> {
    await this.statusFilter.click();
    await this.pause();
  }

  async selectStatus(status: string): Promise<void> {
    await this.openStatusFilter();
    await this.page.getByRole('option', { name: status, exact: true }).click();
    await this.pause();
  }

  async openRequestForm(): Promise<void> {
    await this.addRequestButton.click();
    await this.requestFormPanel.waitFor({ state: 'visible' });
    await this.pause();
  }

  async closeRequestForm(): Promise<void> {
    await this.cancelButton.click();
    await this.requestFormPanel.waitFor({ state: 'hidden' });
  }

  async openFirstApprovers(): Promise<void> {
    await this.viewButtons.first().click();
    await this.approversHeading.waitFor({ state: 'visible' });
    await this.pause();
  }

  async openExportMenu(): Promise<void> {
    await this.exportButton.click();
    await this.page.getByRole('menuitem', { name: 'Export as Excel', exact: true }).waitFor();
    await this.pause();
  }
}
