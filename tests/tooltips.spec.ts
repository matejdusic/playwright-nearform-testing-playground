import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Tooltips"
  await mainPage.searchPlayground("Tooltips");

  // Click on the "Tooltips" block
  await page.getByRole("link", { name: "Tooltips A set of tooltips" }).click();
});

test("verify tooltip for delete button", async ({ page }) => {
  // Hover over the delete button
  await page.getByTestId("delete-button").hover();

  // Verify the tooltip text
  const tooltipText = await page
    .getByText("You don't have permission to")
    .textContent();
  expect(tooltipText).toBe("You don't have permission to do this");
});

test("verify tooltip for more info button", async ({ page }) => {
  // Hover over the more info button
  await page.getByTestId("more-info-button").hover();

  // Verify the tooltip text
  const tooltipText = await page
    .getByText("For more information, click")
    .textContent();
  expect(tooltipText).toBe(
    "For more information, click here: Testing Playground"
  );
});

test("verify tooltip for long text", async ({ page }) => {
  // Hover over the long text element
  await page.getByTestId("text").hover();

  // Verify the tooltip text
  const tooltipText = await page
    .getByRole("tooltip", { name: "A really really long text" })
    .locator("div")
    .textContent();
  expect(tooltipText).toBe("A really really long text example");
});
