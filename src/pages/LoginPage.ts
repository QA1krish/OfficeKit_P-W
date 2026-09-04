import { Locator, Page } from '@playwright/test';

export type LoginCredentials = {
  companyCode: string;
  username: string;
  password: string;
};

export class LoginPage {
  readonly companyCodeInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly passwordToggleButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboardHeading: Locator;

  constructor(
    readonly page: Page,
    private readonly sleepTime = 0,
  ) {
    this.companyCodeInput = page.locator('#login-company-code');
    this.usernameInput = page.locator('#login-username');
    this.passwordInput = page.locator('#login-password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.passwordToggleButton = page.locator('#login-toggle-password');
    this.errorMessage = page.getByText(
      /Invalid username or password|Invalid or inactive company code/,
    ).first();
    this.dashboardHeading = page.getByText('Dashboard', { exact: true }).first();
  }

  private async pause(): Promise<void> {
    if (this.sleepTime > 0) {
      await this.page.waitForTimeout(this.sleepTime);
    }
  }

  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.companyCodeInput.waitFor({ state: 'visible' });
    await this.pause();
  }

  async setCompanyCode(code: string): Promise<void> {
    await this.companyCodeInput.fill(code);
    await this.pause();
  }

  async setUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.pause();
  }

  async setPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.pause();
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
    await this.pause();
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggleButton.click();
    await this.pause();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.navigate();
    await this.setCompanyCode(credentials.companyCode);
    await this.setUsername(credentials.username);
    await this.setPassword(credentials.password);
    await this.clickSignIn();
  }
}
