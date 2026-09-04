import { expect, test } from '@playwright/test';
import { CalendarPage } from '../pages/CalendarPage';
import { LoginCredentials, LoginPage } from '../pages/LoginPage';
import { requiredEnvironmentVariable } from '../utils/environment';
import { captureScreen } from '../utils/screenshots';

const sleepTime = Number(process.env.SLEEP_TIME ?? 0);
const employee: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('EMPLOYEE_USERNAME'),
  password: requiredEnvironmentVariable('EMPLOYEE_PASSWORD'),
};

test.describe('Employee Calendar and application journey @calendar', () => {
  let calendarPage: CalendarPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page, sleepTime);
    calendarPage = new CalendarPage(page, sleepTime);

    await test.step('Log in as Employee', async () => {
      await loginPage.login(employee);
      await expect(page).toHaveURL(/officekithr\.net\/$/);
    });

    await test.step('Open Calendar from the dashboard header', async () => {
      await calendarPage.openFromDashboard();
      await expect(page).toHaveURL(/\/my-profile\/calendar/);
    });
  });

  test.describe('Flow 1 - Calendar validation @calendar-smoke', () => {
    test('displays calendar controls, payroll period, legend, and month grid', async ({ page }) => {
      await test.step('Verify employee and status controls', async () => {
        await expect(calendarPage.selectEmployeeButton).toBeVisible();
        await expect(calendarPage.filterButton('ALL')).toBeVisible();
        await expect(calendarPage.filterButton('ACTIVE')).toBeVisible();
        await expect(calendarPage.filterButton('NOT ACTIVE')).toBeVisible();
      });

      await test.step('Verify calendar navigation', async () => {
        await expect(calendarPage.previousMonthButton).toBeVisible();
        await expect(calendarPage.yearButton).toBeVisible();
        await expect(calendarPage.monthButton).toBeVisible();
        await expect(calendarPage.todayButton).toBeVisible();
        await expect(calendarPage.nextMonthButton).toBeVisible();
        await expect(calendarPage.calendarDensityButton).toBeVisible();
      });

      await test.step('Verify payroll period and attendance legend', async () => {
        await expect(page.getByText('Payroll Period', { exact: true })).toBeVisible();
        for (const label of [
          'Present',
          'Absent',
          'Absent First Half',
          'Absent Second Half',
          'Leave First Half',
          'Leave Second Half',
          'Holiday',
          'Weekend',
        ]) {
          await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
        }
      });

      await test.step('Verify month grid and available day actions', async () => {
        for (const weekday of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) {
          await expect(page.getByText(weekday, { exact: true }).first()).toBeVisible();
        }
        await expect(calendarPage.dayActionButtons.first()).toBeVisible();
      });

      await captureScreen(page, 'calendar', 'employee-calendar-overview');
    });
  });

  test.describe('Flow 2 - Employee filters and list @calendar-employees', () => {
    for (const status of ['ALL', 'ACTIVE', 'NOT ACTIVE'] as const) {
      test(`${status} filter opens its employee list`, async ({ page }) => {
        await test.step(`Select ${status}`, async () => {
          await calendarPage.selectFilter(status);
          await expect(calendarPage.filterButton(status)).toHaveClass(/text-primaryButton/);
        });

        await test.step('Open and validate employee list', async () => {
          await calendarPage.openEmployeeList();
          await expect(calendarPage.employeeSearchInput).toBeVisible();
          await expect(calendarPage.employeeDialog.locator('button').first()).toBeVisible();
        });

        await captureScreen(page, 'calendar-employees', `${status.toLowerCase().replace(' ', '-')}-list`);
      });
    }

    test('selects an employee from the ALL list', async ({ page }) => {
      await calendarPage.selectFilter('ALL');
      await calendarPage.openEmployeeList();
      const employeeName = await calendarPage.selectFirstEmployee();

      await test.step('Verify selected employee is displayed', async () => {
        await expect(page.getByRole('button', { name: employeeName, exact: true })).toBeVisible();
      });

      await captureScreen(page, 'calendar-employees', 'employee-selected');
    });
  });

  test.describe('Flow 3 - Application journey menu @application-journey', () => {
    test('calendar day shows all available request journeys', async ({ page }) => {
      await calendarPage.openFirstDayActions();

      const actions = [
        'Leave request',
        'Attendance regularization',
        'Late in / early out',
        'On duty',
        'Break permission',
      ];

      for (const action of actions) {
        await test.step(`Verify action: ${action}`, async () => {
          await expect(calendarPage.applicationButton(action)).toBeVisible();
        });
      }

      await expect(calendarPage.actionsDialog).toContainText(
        'Requests open in the module that owns them, pre-filled with this employee and date.',
      );
      await captureScreen(page, 'application-journey', 'available-actions');
    });
  });

  test.describe('Flow 4 - Application forms @application-forms', () => {
    const applications = [
      {
        action: 'Leave request',
        heading: 'Leave Application',
        section: 'Leave Duration',
        folder: 'leave',
        screenshot: 'employee-leave-request-form',
      },
      {
        action: 'Attendance regularization',
        heading: 'Attendance Regularization',
        section: 'Attendance Regularisation Information',
        folder: 'attendance',
        screenshot: 'employee-attendance-regularization-form',
      },
      {
        action: 'Late in / early out',
        heading: 'Late In/Early Out',
        section: 'Late In/Early Out Information',
        folder: 'late-in-early-out',
        screenshot: 'employee-late-in-early-out-form',
      },
      {
        action: 'On duty',
        heading: 'On Duty',
        section: 'OD Information',
        folder: 'on-duty',
        screenshot: 'employee-on-duty-form',
      },
      {
        action: 'Break permission',
        heading: 'Break Permission',
        section: 'Break Permission Information',
        folder: 'break-permission',
        screenshot: 'employee-break-permission-form',
      },
    ];

    for (const application of applications) {
      test(`opens the ${application.action} form`, async ({ page }) => {
        await calendarPage.openFirstDayActions();

        await test.step(`Open ${application.action}`, async () => {
          await calendarPage.openApplication(application.action);
        });

        await test.step('Verify employee, form section, and controls', async () => {
          await expect(calendarPage.applicationHeading(application.heading)).toBeVisible();
          await expect(
            page.getByText(`EMP/M2H/${employee.username}`, { exact: true }),
          ).toBeVisible();
          await expect(page.getByText(application.section, { exact: true })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
        });

        await captureScreen(page, application.folder, application.screenshot);
      });
    }
  });
});
