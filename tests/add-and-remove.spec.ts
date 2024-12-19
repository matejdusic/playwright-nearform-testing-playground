import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Add/Remove Elements Tests @easy', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Add/Remove");
    await page.getByRole("link", { name: "Add/Remove Dynamically add" }).click();
  });

  test("verify page content", async ({ page }) => {
    // Use a more specific selector with class to ensure uniqueness
    await expect(page.locator('p.mb-4.text-sm.text-foreground-muted'))
      .toHaveText("Dynamically add and remove elements from the page");
  });

  test("verify add element functionality", async ({ page }) => {
    const addElementButton = page.getByTestId("add-element");
    const numberOfElements = Math.floor(Math.random() * 9) + 2; // 2 to 10 elements
    
    // Add elements
    await Promise.all(
      Array.from({ length: numberOfElements }, () => addElementButton.click())
    );

    // Verify all elements are added
    const removeButtons = await page.getByTestId(/^remove-element-\d+$/).all();
    expect(removeButtons).toHaveLength(numberOfElements);
    
    // Verify each button is visible
    for (const button of removeButtons) {
      await expect(button).toBeVisible();
    }
  });

  test("verify clear storage functionality", async ({ page }) => {
    const addElementButton = page.getByTestId("add-element");
    const numberOfElements = Math.floor(Math.random() * 9) + 2;
    
    // Add elements
    await Promise.all(
      Array.from({ length: numberOfElements }, () => addElementButton.click())
    );

    // Verify elements are added
    const removeButtonsLocator = page.getByTestId(/^remove-element-\d+$/);
    await expect(removeButtonsLocator).toHaveCount(numberOfElements);

    // Clear storage
    await page.getByTestId("clear-storage").click();

    // Verify all elements are removed
    await expect(removeButtonsLocator).toHaveCount(0);
  });
});
