import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginCredentials, LoginPage } from '../pages/LoginPage';
import { requiredEnvironmentVariable } from '../utils/environment';
import { captureScreen } from '../utils/screenshots';

const sleepTime = Number(process.env.SLEEP_TIME ?? 0);
const admin: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('ADMIN_USERNAME'),
  password: requiredEnvironmentVariable('ADMIN_PASSWORD'),
};

test.describe('OfficeKit HR Admin dashboard flows @dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page, sleepTime);
    dashboardPage = new DashboardPage(page, sleepTime);

    await test.step('Precondition - log in as Admin', async () => {
      await loginPage.login(admin);
      await expect(page).toHaveURL(/\/hr-dashboard(?:\/|$)/);
      await expect(dashboardPage.dashboardLink).toBeVisible();
    });
  });

  test.describe('Flow 1 - Dashboard shell @dashboard-smoke', () => {
    test('displays the authenticated user header and primary navigation', async () => {
      await test.step('Verify the user greeting and profile', async () => {
        await expect(dashboardPage.greeting).toBeVisible();
        await expect(dashboardPage.userProfileButton).toBeVisible();
      });

      await test.step('Verify direct navigation links', async () => {
        await expect(dashboardPage.dashboardLink).toBeVisible();
        await expect(dashboardPage.pmsLink).toBeVisible();
        await expect(dashboardPage.taskLink).toBeVisible();
      });

      await test.step('Verify expandable sidebar modules', async () => {
        const modules = [
          'My Profile',
          'Company',
          'Attendance',
          'Leave',
          'Payroll',
          'Resolve',
          'TalentHub',
          'Settings',
          'AI Insight',
        ];

        for (const module of modules) {
          await expect(dashboardPage.sidebarButton(module)).toBeVisible();
        }
      });

      await captureScreen(dashboardPage.page, 'admin-dashboard', 'shell-and-navigation');
    });
  });

  test.describe('Flow 2 - Dashboard widgets @dashboard-widgets', () => {
    test('displays all summary metrics', async () => {
      const metrics = [
        'Total Hours',
        'Total Employee',
        'On Leave',
        'New Joiners',
        'Employee Exit',
      ];

      for (const metric of metrics) {
        await test.step(`Verify summary metric: ${metric}`, async () => {
          await expect(dashboardPage.summaryMetric(metric)).toBeVisible();
        });
      }

      await captureScreen(dashboardPage.page, 'admin-dashboard', 'summary-metrics');
    });

    test('displays the main dashboard sections', async () => {
      await test.step('Verify Attendance Summary', async () => {
        await expect(dashboardPage.attendanceSummary).toBeVisible();
      });

      await test.step('Verify Request & Approvals', async () => {
        await expect(dashboardPage.requestsAndApprovals).toBeVisible();
      });

      await test.step('Verify My Team', async () => {
        await expect(dashboardPage.myTeam).toBeVisible();
      });

      await test.step('Verify Feeds', async () => {
        await expect(dashboardPage.feeds).toBeVisible();
      });

      await captureScreen(dashboardPage.page, 'admin-dashboard', 'main-sections');
    });

    test('loads all quick-access functions and shows the active cards', async () => {
      const allFunctions = [
        'Leave',
        'Attendance',
        'Payroll',
        'Forms & Policies',
        'My Holidays',
        'Organization',
      ];

      await test.step('Verify all six carousel functions are loaded', async () => {
        for (const functionName of allFunctions) {
          await expect(dashboardPage.quickAccessHeading(functionName)).toBeAttached();
        }
      });

      await test.step('Verify the three initially active cards are visible', async () => {
        for (const functionName of ['Leave', 'Attendance', 'Organization']) {
          await expect(dashboardPage.quickAccessCard(functionName)).toBeVisible();
        }
      });

      await captureScreen(dashboardPage.page, 'admin-dashboard', 'quick-access-cards');
    });
  });

  test.describe('Flow 3 - Sidebar navigation @dashboard-navigation', () => {
    test('PMS opens the Performance Management page', async ({ page }) => {
      await test.step('Click PMS', async () => {
        await dashboardPage.clickPms();
      });
      await expect(page).toHaveURL(/\/pms(?:\/|$)/);
      await captureScreen(page, 'pms', 'admin-pms-page');
    });

    test('Task opens the task timesheet page', async ({ page }) => {
      await test.step('Click Task', async () => {
        await dashboardPage.clickTask();
      });
      await expect(page).toHaveURL(/\/task-timesheet(?:\/|$)/);
      await captureScreen(page, 'task', 'admin-task-timesheet');
    });
  });

  test.describe('Flow 4 - Quick-access navigation @dashboard-navigation', () => {
    const navigationCases = [
      {
        card: 'Leave',
        expectedUrl: /\/leave\/request-approvals\/leave-application(?:\/|$)/,
      },
      {
        card: 'Attendance',
        expectedUrl: /\/attendance\/request-approvals\/on-duty(?:\/|$)/,
      },
      {
        card: 'Organization',
        expectedUrl: /\/my-profile\/organisation(?:\/|$)/,
      },
    ];

    for (const navigationCase of navigationCases) {
      test(`${navigationCase.card} card opens its destination page`, async ({ page }) => {
        await test.step(`Click ${navigationCase.card} quick-access card`, async () => {
          await dashboardPage.clickQuickAccessCard(navigationCase.card);
        });
        await test.step('Verify destination URL', async () => {
          await expect(page).toHaveURL(navigationCase.expectedUrl);
        });
        await captureScreen(
          page,
          navigationCase.card.toLowerCase(),
          `admin-${navigationCase.card.toLowerCase()}-page`,
        );
      });
    }
  });
});
