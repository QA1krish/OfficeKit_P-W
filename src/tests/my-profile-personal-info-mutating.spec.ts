import { expect, test } from '../fixtures/auth.fixture';
import { MyProfilePage } from '../pages/MyProfilePage';
import { monitorApplicationFailures } from '../utils/applicationFailures';
import { captureScreen } from '../utils/screenshots';

test.describe('My Profile Personal Info updates @my-profile @mutating', () => {
  test('[P1] updates Personal Email, verifies persistence, and restores the baseline', async ({
    employeeSession,
  }) => {
    test.slow();
    const { page } = employeeSession;
    const profile = new MyProfilePage(page);
    const assertNoFailures = monitorApplicationFailures(page, 'Personal Email update');
    const personalTab = page.getByRole('button', { name: 'Personal', exact: true });
    const edit = page.getByRole('button', { name: 'Edit personal information', exact: true });
    const personalEmail = page.getByRole('textbox', { name: 'Enter personal email', exact: true });
    const save = page.getByRole('button', { name: 'Save', exact: true });
    const cancel = page.getByRole('button', { name: 'Cancel', exact: true }).last();

    await profile.open('personalInfo');
    await personalTab.click();
    await edit.click();
    await expect(personalEmail).toBeVisible();
    const originalEmail = await personalEmail.inputValue();
    const updatedEmail = `officekit.pw+${Date.now()}@example.com`;

    try {
      await personalEmail.fill(updatedEmail);
      await save.click();
      await expect(personalEmail).toBeHidden();

      await page.reload();
      await personalTab.click();
      await edit.click();
      await expect(personalEmail).toHaveValue(updatedEmail);
      await captureScreen(page, 'my-profile-updates', 'personal-email-persisted');
    } finally {
      try {
        await page.reload();
        await personalTab.click();
        await edit.click();
        await personalEmail.fill(originalEmail);
        await save.click();
        await expect(personalEmail).toBeHidden();

        await page.reload();
        await personalTab.click();
        await edit.click();
        await expect(personalEmail).toHaveValue(originalEmail);
        await captureScreen(page, 'my-profile-updates', 'personal-email-restored');
        await cancel.click();
      } finally {
        await assertNoFailures();
      }
    }
  });

});
