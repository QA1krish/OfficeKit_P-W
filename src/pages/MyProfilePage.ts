import { Locator, Page } from '@playwright/test';

export type MyProfileArea =
  | 'personalInfo'
  | 'requestsApprovals'
  | 'formsPolicies'
  | 'holidays'
  | 'newsFeeds'
  | 'surveysFeedbacks'
  | 'organisation'
  | 'letter'
  | 'salarySlip';

const routes: Record<MyProfileArea, string> = {
  personalInfo: '/my-profile/personal-info',
  requestsApprovals: '/my-profile/request-approvals/separations/request',
  formsPolicies: '/my-profile/forms-policy',
  holidays: '/my-profile/my-holidays',
  newsFeeds: '/my-profile/news-feed/released',
  surveysFeedbacks: '/my-profile/surveys-feedbacks/general',
  organisation: '/my-profile/organisation',
  letter: '/my-profile/request-approvals/letter',
  salarySlip: '/my-profile/finance/salary%20slip',
};

export class MyProfilePage {
  constructor(readonly page: Page) {}

  async open(area: MyProfileArea): Promise<void> {
    await this.page.goto(routes[area]);
    await this.page.waitForLoadState('domcontentloaded');
  }

  tab(name: string): Locator {
    return this.page
      .getByRole('button', { name, exact: true })
      .or(this.page.getByText(name, { exact: true }))
      .first();
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }
}
