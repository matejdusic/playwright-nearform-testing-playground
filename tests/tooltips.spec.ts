import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Tooltip Tests @easy', () => {
  const tooltips = {
    delete: {
      buttonId: 'delete-button',
      expectedText: "You don't have permission to do this"
    },
    moreInfo: {
      buttonId: 'more-info-button',
      expectedText: "For more information, click here: Testing Playground"
    },
    longText: {
      elementId: 'text',
      expectedText: "A really really long text example"
    }
  };

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Tooltips");
    await page.getByRole("link", { name: "Tooltips A set of tooltips" }).click();
  });

  async function verifyTooltip(page, elementId: string, expectedText: string, options = {}) {
    const element = page.getByTestId(elementId);
    await element.hover();
    
    if (elementId === 'text') {
      const tooltip = page.getByRole("tooltip", { name: "A really really long text" }).locator("div");
      await expect(tooltip).toHaveText(expectedText);
    } else {
      await expect(page.getByText(expectedText, { exact: true })).toBeVisible();
    }
  }

  for (const [name, data] of Object.entries(tooltips)) {
    test(`verify tooltip for ${name}`, async ({ page }) => {
      await verifyTooltip(
        page,
        data.buttonId || data.elementId,
        data.expectedText
      );
    });
  }
});
