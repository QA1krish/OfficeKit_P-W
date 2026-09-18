import { expect, test } from '../fixtures/auth.fixture';
import { MyProfilePage } from '../pages/MyProfilePage';
import { monitorApplicationFailures } from '../utils/applicationFailures';
import { captureScreen } from '../utils/screenshots';

test.describe('My Profile Personal Info dry-run @my-profile @dry-run', () => {
  test('[P0] displays the employee identity read model', async ({ employeeSession }) => {
    const { page } = employeeSession;
    const profile = new MyProfilePage(page);
    const assertNoFailures = monitorApplicationFailures(page, 'Personal Info identity');

    await test.step('Open Personal Info without changing data', async () => {
      await profile.open('personalInfo');
      await expect(page).toHaveURL(/\/my-profile\/personal-info(?:\/|$)/);
    });

    await test.step('Verify the identity and employment read model', async () => {
      await expect(page.getByText('Profile Completion', { exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Basic Identity', exact: true })).toBeVisible();
      await expect(page.getByText('Employee code', { exact: true })).toBeVisible();
      await expect(page.getByText(/^EMP\//).first()).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Employment Details', exact: true })).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Employment Dates & Policies', exact: true }),
      ).toBeVisible();
    });

    await captureScreen(page, 'my-profile-dry-run', 'personal-info-identity');
    await assertNoFailures();
  });

  test('[P0] opens and cancels a Personal Info editor without persistence', async ({
    employeeSession,
  }) => {
    const { page } = employeeSession;
    const profile = new MyProfilePage(page);
    const assertNoFailures = monitorApplicationFailures(page, 'Personal Info editor');
    await profile.open('personalInfo');

    await test.step('Verify the discovered profile sections', async () => {
      for (const section of [
        'Overview',
        'Personal',
        'Professional',
        'Asset Details',
        'Audit Information',
        'Bank Details',
        'Certifications',
        'Dependent',
        'Languages',
        'Letters',
        'Qualification',
      ]) {
        await expect(page.getByRole('button', { name: section, exact: true })).toBeAttached();
      }
    });

    await test.step('Open Personal and cancel its editor', async () => {
      await page.getByRole('button', { name: 'Personal', exact: true }).click();
      const edit = page.getByRole('button', { name: 'Edit personal information', exact: true });
      await expect(edit, 'BROKEN FUNCTION: Personal Info Edit control is unavailable').toBeVisible();
      await edit.click();
      const cancel = page.getByRole('button', { name: 'Cancel', exact: true }).last();
      await expect(cancel, 'BROKEN FUNCTION: Personal Info editor cannot be cancelled').toBeVisible();
      await captureScreen(page, 'my-profile-dry-run', 'personal-info-editor-open');
      await cancel.click();
      await expect(cancel).toBeHidden();
    });

    await assertNoFailures();
  });
});
