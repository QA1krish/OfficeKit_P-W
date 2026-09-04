import { expect, test } from '@playwright/test';
import { LoginCredentials, LoginPage } from '../pages/LoginPage';
import { requiredEnvironmentVariable } from '../utils/environment';
import { captureScreen } from '../utils/screenshots';

const sleepTime = Number(process.env.SLEEP_TIME ?? 0);

const admin: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('ADMIN_USERNAME'),
  password: requiredEnvironmentVariable('ADMIN_PASSWORD'),
};

const employee: LoginCredentials = {
  companyCode: requiredEnvironmentVariable('COMPANY_CODE'),
  username: requiredEnvironmentVariable('EMPLOYEE_USERNAME'),
  password: requiredEnvironmentVariable('EMPLOYEE_PASSWORD'),
};

test.describe('OfficeKit HR login flows @login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page, sleepTime);
  });

  test.describe('Flow 1 - Login page UI @smoke', () => {
    test('login page displays all required controls', async ({ page }) => {
      await test.step('Open the login page', async () => {
        await loginPage.navigate();
        await expect(page).toHaveURL(/\/login$/);
      });

      await test.step('Verify the three credential fields', async () => {
        await expect(loginPage.companyCodeInput).toBeVisible();
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
      });

      await test.step('Verify Sign in and password toggle buttons', async () => {
        await expect(loginPage.signInButton).toBeVisible();
        await expect(loginPage.passwordToggleButton).toBeVisible();
      });

      await captureScreen(page, 'login', 'login-page');
    });

    test('login fields have correct placeholders and are required', async () => {
      await loginPage.navigate();

      await test.step('Verify placeholders', async () => {
        await expect(loginPage.companyCodeInput).toHaveAttribute('placeholder', 'Company Code');
        await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
        await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
      });

      await test.step('Verify required attributes', async () => {
        await expect(loginPage.companyCodeInput).toHaveAttribute('required', '');
        await expect(loginPage.usernameInput).toHaveAttribute('required', '');
        await expect(loginPage.passwordInput).toHaveAttribute('required', '');
      });
    });

    test('password visibility button shows and hides the password', async () => {
      await loginPage.navigate();
      await loginPage.setPassword('123');
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

      await test.step('Show the password', async () => {
        await loginPage.togglePasswordVisibility();
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
      });

      await test.step('Hide the password again', async () => {
        await loginPage.togglePasswordVisibility();
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
        await captureScreen(loginPage.page, 'login', 'password-toggle-verified');
      });
    });
  });

  test.describe('Flow 2 - Valid credentials @positive', () => {
    test('Admin logs in and reaches the HR dashboard', async ({ page }) => {
      await test.step('Log in with Admin credentials', async () => {
        await loginPage.login(admin);
      });

      await test.step('Verify authenticated dashboard', async () => {
        await expect(page).toHaveURL(/\/hr-dashboard(?:\/|$)/);
        await expect(loginPage.dashboardHeading).toBeVisible();
        await captureScreen(page, 'admin-dashboard', 'login-success');
      });
    });

    test('Employee supplied credentials should log in', async ({ page }) => {
      await test.step('Log in with supplied Employee credentials', async () => {
        await loginPage.login(employee);
      });

      await test.step('Verify Employee dashboard', async () => {
        await expect(page).toHaveURL(/officekithr\.net\/$/);
        await expect(page.getByRole('heading', { name: /Good (Morning|Afternoon|Evening), Athul/ })).toBeVisible();
        await captureScreen(page, 'employee-dashboard', 'login-success');
      });
    });
  });

  test.describe('Flow 3 - Invalid credentials @negative', () => {
    const invalidCases: Array<{
      name: string;
      credentials: LoginCredentials;
      expectedError: string;
    }> = [
      {
        name: 'invalid password',
        credentials: { ...admin, password: 'wrongpassword' },
        expectedError: 'Invalid username or password',
      },
      {
        name: 'invalid username',
        credentials: { ...admin, username: 'invaliduser' },
        expectedError: 'Invalid username or password',
      },
      {
        name: 'invalid company code',
        credentials: { ...admin, companyCode: '999' },
        expectedError: 'Invalid or inactive company code',
      },
    ];

    for (const invalidCase of invalidCases) {
      test(`shows the correct error for ${invalidCase.name}`, async ({ page }) => {
        await test.step(`Submit ${invalidCase.name}`, async () => {
          await loginPage.login(invalidCase.credentials);
        });

        await test.step(`Verify error: ${invalidCase.expectedError}`, async () => {
          await expect(page).toHaveURL(/\/login$/);
          await expect(loginPage.errorMessage).toHaveText(invalidCase.expectedError);
          await captureScreen(page, 'login', invalidCase.name.replaceAll(' ', '-'));
        });
      });
    }
  });

  test.describe('Flow 4 - Required field validation @validation', () => {
    const requiredCases: Array<{
      name: string;
      credentials: LoginCredentials;
      invalidField: 'companyCode' | 'username' | 'password';
    }> = [
      {
        name: 'all credentials are empty',
        credentials: { companyCode: '', username: '', password: '' },
        invalidField: 'companyCode',
      },
      {
        name: 'company code is empty',
        credentials: { ...admin, companyCode: '' },
        invalidField: 'companyCode',
      },
      {
        name: 'username is empty',
        credentials: { ...admin, username: '' },
        invalidField: 'username',
      },
      {
        name: 'password is empty',
        credentials: { ...admin, password: '' },
        invalidField: 'password',
      },
    ];

    for (const requiredCase of requiredCases) {
      test(`blocks submission when ${requiredCase.name}`, async ({ page }) => {
        await loginPage.navigate();
        await loginPage.setCompanyCode(requiredCase.credentials.companyCode);
        await loginPage.setUsername(requiredCase.credentials.username);
        await loginPage.setPassword(requiredCase.credentials.password);

        await test.step('Click Sign in using normal browser validation', async () => {
          await loginPage.clickSignIn();
        });

        await test.step(`Verify ${requiredCase.invalidField} is invalid`, async () => {
          const field = {
            companyCode: loginPage.companyCodeInput,
            username: loginPage.usernameInput,
            password: loginPage.passwordInput,
          }[requiredCase.invalidField];

          await expect(page).toHaveURL(/\/login$/);
          const validity = await field.evaluate((element: HTMLInputElement) => ({
            isValid: element.validity.valid,
            message: element.validationMessage,
          }));
          expect(validity.isValid).toBe(false);
          expect(validity.message).not.toBe('');
          await captureScreen(page, 'login', requiredCase.name.replaceAll(' ', '-'));
        });
      });
    }
  });
});
