import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Drag and Drop Tests @medium', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);

    // Open the main page
    await mainPage.open();

    // Search for "Drag and Drop"
    await mainPage.searchPlayground("Drag and Drop");

    // Click on the "Drag and Drop - Medium" block
    await page.getByRole("link", { name: "Drag and Drop Drag elements" }).click();
  });

  test("verify drag and drop functionality", async ({ page }) => {
    const dropCounter = page.getByTestId("total-drops");

    for (let i = 0; i < 5; i++) {
      // Re-query the box element to drag in each iteration
      const boxElement = page.getByTestId("draggable-box");

      // Re-query the target box element in each iteration
      const targetBoxElement =
        i === 0
          ? page.getByTestId("drop-target")
          : page.locator("div").filter({ hasText: "Box" }).nth(3);

      // Drag and drop the box element into the target box
      await boxElement.dragTo(targetBoxElement);

      // Verify the drop counter
      const dropCount = await dropCounter.textContent();
      expect(dropCount).toContain(`Total Drops: ${i + 1}`);

      // Wait for a short period to ensure the elements are updated
      await page.waitForTimeout(500);
    }
  });
});
