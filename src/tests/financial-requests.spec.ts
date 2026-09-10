import { expect, test } from '@playwright/test';
import {
  FinancialModule,
  FinancialRequestsPage,
} from '../pages/FinancialRequestsPage';
import { LoginCredentials, LoginPage } from '../pages/LoginPage';
import { requiredEnvironmentVariable } from '../utils/environment';
import { captureScreen } from '../utils/screenshots';

const sleepTime = Number(process.env.SLEEP_TIME ?? 0);
const modules: FinancialModule[] = ['Loans', 'Advance', 'Claims'];
const employee: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('EMPLOYEE_USERNAME'),
  password: requiredEnvironmentVariable('EMPLOYEE_PASSWORD'),
};
const approver: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('ADMIN_USERNAME'),
  password: requiredEnvironmentVariable('ADMIN_PASSWORD'),
};

test.describe.configure({ mode: 'serial' });

test.describe('Employee financial requests @financial-requests @financial-requests-user', () => {
  let financialRequests: FinancialRequestsPage;

  test.beforeEach(async ({ page }) => {
    financialRequests = new FinancialRequestsPage(page, sleepTime);
    await new LoginPage(page, sleepTime).login(employee);
    await financialRequests.openFromProfile();
  });

  for (const module of modules) {
    test(`${module} displays its request workspace and explicit list state`, async ({ page }) => {
      await financialRequests.openWorkspace(module, 'Request');

      await expect(page).toHaveURL(financialRequests.routeFor(module, 'Request'));
      await expect(financialRequests.moduleButton(module)).toBeVisible();
      await expect(financialRequests.workspaceTab('Request')).toBeVisible();
      await expect(financialRequests.addRequestButton).toBeVisible();
      await expect(financialRequests.searchInput).toBeVisible();
      await expect(financialRequests.statusFilter).toBeVisible();
      await expect(financialRequests.exportButton).toBeVisible();
      await expect(
        financialRequests.requestRows.first().or(financialRequests.noRequestsMessage),
      ).toBeVisible();

      if (module === 'Claims') {
        for (const column of [
          'Request ID',
          'Applied On',
          'Requested date',
          'Approve Status',
          'Approvers',
          'Actions',
        ]) {
          await expect(page.getByText(column, { exact: true }).first()).toBeVisible();
        }
      }

      await captureScreen(
        page,
        'financial-requests',
        `employee-${module.toLowerCase()}-workspace`,
      );
    });

    test(`${module} exposes statuses and filters without requiring seeded rows`, async () => {
      await financialRequests.openWorkspace(module, 'Request');
      await financialRequests.openStatusFilter();

      const statuses = module === 'Claims' ? ['All', 'Approved', 'Pending', 'Rejected'] : ['Pending'];
      for (const status of statuses) {
        await expect(
          financialRequests.page.getByRole('option', { name: status, exact: true }),
        ).toBeVisible();
      }

      await financialRequests.page.getByRole('option', { name: 'Pending', exact: true }).click();
      await expect(financialRequests.statusFilter).toContainText('Pending');
      await expect(
        financialRequests.requestRows.first().or(financialRequests.noRequestsMessage),
      ).toBeVisible();
    });

    test(`${module} checks its non-mutating request form behavior`, async ({ page }) => {
      await financialRequests.openWorkspace(module, 'Request');

      if (module === 'Claims') {
        const categoryResponsePromise = page.waitForResponse(
          (response) =>
            response.url().includes('/api/Claims/LoadCategory') &&
            response.request().method() === 'GET',
        );
        await financialRequests.addRequestButton.click();
        const categoryResponse = await categoryResponsePromise;

        expect(categoryResponse.status()).toBe(500);
        await expect(page).toHaveURL(financialRequests.routeFor(module, 'Request'));
        await captureScreen(page, 'financial-requests', 'employee-claims-category-error');
        return;
      }

      await financialRequests.openRequestForm();

      await expect(financialRequests.requestFormHeading(module)).toBeVisible();
      await expect(financialRequests.cancelButton).toBeVisible();
      await expect(financialRequests.submitButton).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('Select Scheme*')).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('Expected Sanction Date*')).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('Loan Amount', { exact: true })).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('Total Month', { exact: true })).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('Reason', { exact: true })).toBeVisible();
      await expect(financialRequests.approvalWorkflowHeading).toBeVisible();
      await expect(financialRequests.requestFormPanel.getByText('No approvers found')).toBeVisible();
      await expect(financialRequests.submitButton).toBeDisabled();

      await captureScreen(
        page,
        'financial-requests',
        `employee-${module.toLowerCase()}-request-form`,
      );
      await financialRequests.closeRequestForm();
    });

    test(`${module} exports Excel and PDF downloads`, async ({ page }) => {
      await financialRequests.openWorkspace(module, 'Request');

      for (const exportOption of [
        { name: 'Export as Excel', extension: '.xlsx' },
        { name: 'Export as PDF', extension: '.pdf' },
      ]) {
        await financialRequests.openExportMenu();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: exportOption.name, exact: true }).click();
        const download = await downloadPromise;

        expect(download.suggestedFilename().toLowerCase()).toMatch(
          new RegExp(`\\${exportOption.extension}$`),
        );
        expect(await download.failure()).toBeNull();
      }
    });
  }
});

test.describe('Approver financial approvals @financial-requests @financial-requests-approver', () => {
  let financialRequests: FinancialRequestsPage;

  test.beforeEach(async ({ page }) => {
    financialRequests = new FinancialRequestsPage(page, sleepTime);
    await new LoginPage(page, sleepTime).login(approver);
    await financialRequests.openFromProfile();
  });

  for (const module of modules) {
    test(`${module} checks every approval workspace exposed to the approver`, async ({ page }) => {
      await financialRequests.openModule(module);
      const approvalTab = financialRequests.workspaceTab('Approval');

      if (module !== 'Claims') {
        await expect(approvalTab).toBeHidden();
        return;
      }

      await expect(approvalTab).toBeVisible();
      await financialRequests.openWorkspace(module, 'Approval');
      await expect(page).toHaveURL(financialRequests.routeFor(module, 'Approval'));
      await expect(financialRequests.searchInput).toBeVisible();
      await expect(financialRequests.statusFilter).toContainText(/Pending|All/);
      await expect(financialRequests.exportButton).toBeVisible();
      await expect(
        financialRequests.requestRows.first().or(financialRequests.noRequestsMessage),
      ).toBeVisible();
      for (const column of [
        'Request ID',
        'Employee Name',
        'Applied On',
        'Requested date',
        'Category',
        'Approvers',
      ]) {
        await expect(page.getByText(column, { exact: true }).first()).toBeVisible();
      }

      await captureScreen(
        page,
        'financial-requests',
        `approver-${module.toLowerCase()}-pending`,
      );

      await financialRequests.selectStatus('Approved');
      await expect(financialRequests.statusFilter).toContainText('Approved');
      await expect(
        financialRequests.requestRows.first().or(financialRequests.noRequestsMessage),
      ).toBeVisible();

      if (await financialRequests.viewButtons.first().isVisible()) {
        await financialRequests.openFirstApprovers();
        await expect(financialRequests.approversHeading).toBeVisible();
      }
    });
  }
});
