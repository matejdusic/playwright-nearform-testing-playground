import { Page } from '@playwright/test';

export class MainPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('https://nearform.github.io/testing-playground/', {
      waitUntil: 'domcontentloaded',
    });
  }

  async searchPlayground(name: string) {
    await this.page.fill('[placeholder="Search..."]', name);
    await this.page.press('[placeholder="Search..."]', 'Enter');
  }

  async selectPlayground(name: string) {
    await this.page.getByRole('link', { name: name }).first().click();
  }
}