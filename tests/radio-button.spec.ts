import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Radio Button Tests @easy', () => {
  const colors = {
    primary: ['Red', 'Blue', 'Yellow', 'White'],
    secondary: {
      Red: ['Purple', 'Orange'],
      Blue: ['Purple', 'Green'],
      Yellow: ['Orange', 'Green']
    }
  };

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Radio button");
    await page
      .getByRole("link", { name: "Radio button A set of radio buttons" })
      .click();
  });

  test("verify initial state of primary colors", async ({ page }) => {
    // Check visibility of enabled colors
    for (const color of colors.primary.slice(0, -1)) {
      await expect(page.getByLabel(color)).toBeVisible();
    }
    // Check disabled state of White
    await expect(page.getByLabel('White')).toBeDisabled();
  });

  // Test secondary colors for each primary color
  for (const [primary, secondaries] of Object.entries(colors.secondary)) {
    test(`verify secondary colors when ${primary} is selected`, async ({ page }) => {
      await page.getByLabel(primary).click();
      
      for (const secondary of secondaries) {
        await expect(page.getByLabel(secondary)).toBeVisible();
      }
    });
  }

  // Test secondary color persistence scenarios
  const persistenceTests = [
    { from: 'Blue', to: 'Red', persistent: 'Purple' },
    { from: 'Red', to: 'Yellow', persistent: 'Orange' },
    { from: 'Yellow', to: 'Blue', persistent: 'Green' }
  ];

  for (const { from, to, persistent } of persistenceTests) {
    test(`verify ${persistent} remains selected when switching from ${from} to ${to}`, async ({ page }) => {
      // Select initial primary color
      await page.getByLabel(from).click();
      
      // Select secondary color
      await page.getByLabel(persistent).click();
      
      // Switch primary color
      await page.getByLabel(to).click();
      
      // Verify persistence
      await expect(page.getByLabel(persistent)).toBeChecked();
    });
  }
});
