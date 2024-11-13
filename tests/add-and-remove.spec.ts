import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Add/Remove"
  await mainPage.searchPlayground("Add/Remove");

  // Click on the "Add/Remove" block
  await page.getByRole("link", { name: "Add/Remove Dynamically add" }).click();
});

test("verify the page is loaded correctly", async ({ page }) => {
  // Verify that the correct page is loaded by checking for specific content
  const content = await page.textContent("body");
  expect(content).toContain(
    "Dynamically add and remove elements from the page"
  );
});

test("verify add element functionality", async ({ page }) => {
  // Click on ADD ELEMENT a random number of times between 2 and 10
  const addElementButton = page.getByTestId("add-element");
  const numberOfClicks = Math.floor(Math.random() * 9) + 2;
  for (let i = 0; i < numberOfClicks; i++) {
    await addElementButton.click();
  }

  // Verify that the correct number of REMOVE ELEMENT buttons are added
  for (let i = 1; i <= numberOfClicks; i++) {
    const removeElementButton = page.getByTestId(`remove-element-${i}`);
    await expect(removeElementButton).toBeVisible();
  }
});

test("verify CLEAR STORAGE functionality", async ({ page }) => {
  // Click on ADD ELEMENT a random number of times between 2 and 10
  const addElementButton = page.getByTestId("add-element");
  const numberOfClicks = Math.floor(Math.random() * 9) + 2;
  for (let i = 0; i < numberOfClicks; i++) {
    await addElementButton.click();
  }

  // Verify that the correct number of REMOVE ELEMENT buttons are added
  for (let i = 1; i <= numberOfClicks; i++) {
    const removeElementButton = page.getByTestId(`remove-element-${i}`);
    await expect(removeElementButton).toBeVisible();
  }

  // Click on CLEAR STORAGE
  const clearStorageButton = page.getByTestId("clear-storage");
  await clearStorageButton.click();

  // Verify that all REMOVE ELEMENT buttons are removed
  for (let i = 1; i <= numberOfClicks; i++) {
    const removeElementButton = page.getByTestId(`remove-element-${i}`);
    await expect(removeElementButton).not.toBeVisible();
  }
});
