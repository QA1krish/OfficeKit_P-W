import { BrowserContext, Page, test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { credentialsFor, UserRole } from '../config/users';
import {
  AttendancePage,
  EmployeeManagementPage,
  LeaveManagementPage,
  PayrollPage,
  PerformancePage,
  RecruitmentPage,
  ReportsPage,
  RolesAndPermissionsPage,
  SettingsPage,
  ShiftManagementPage,
} from '../pages/modules';

export type AuthenticatedSession = {
  context: BrowserContext;
  page: Page;
};

export type ModulePages = ReturnType<typeof createModulePages>;

function createModulePages(page: Page) {
  return {
    employeeManagement: new EmployeeManagementPage(page),
    attendance: new AttendancePage(page),
    leaveManagement: new LeaveManagementPage(page),
    shiftManagement: new ShiftManagementPage(page),
    payroll: new PayrollPage(page),
    recruitment: new RecruitmentPage(page),
    performance: new PerformancePage(page),
    reports: new ReportsPage(page),
    settings: new SettingsPage(page),
    rolesAndPermissions: new RolesAndPermissionsPage(page),
  };
}

type AuthFixtures = {
  loginAs: (role: UserRole) => Promise<AuthenticatedSession>;
  adminSession: AuthenticatedSession;
  employeeSession: AuthenticatedSession;
  modulesFor: (page: Page) => ModulePages;
};

export const test = base.extend<AuthFixtures>({
  loginAs: async ({ browser }, use) => {
    const sessions: AuthenticatedSession[] = [];
    await use(async (role) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await new LoginPage(page).login(credentialsFor(role));
      await page.waitForURL((url) => !url.pathname.endsWith('/login'), { timeout: 30000 });
      const session = { context, page };
      sessions.push(session);
      return session;
    });
    await Promise.all(sessions.map(({ context }) => context.close()));
  },
  adminSession: async ({ loginAs }, use) => {
    await use(await loginAs('admin'));
  },
  employeeSession: async ({ loginAs }, use) => {
    await use(await loginAs('employee'));
  },
  modulesFor: async ({}, use) => {
    await use(createModulePages);
  },
});

export { expect } from '@playwright/test';
