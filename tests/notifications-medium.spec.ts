import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Notification"
  await mainPage.searchPlayground("Notification");

  // Click on the "Notification" block
  await page.getByRole("link", { name: "Notification" }).click();
});

test("verify success notification functionality", async ({ page }) => {
  // Click the "Success" button to trigger the success notification
  await page.getByTestId("button-success").click();

  // Verify that the success notification contains the text "SUCCESS"
  await expect(page.getByTestId("message-success")).toContainText("SUCCESS");
});

test("verify info notification functionality", async ({ page }) => {
  // Click the "Info" button to trigger the info notification
  await page.getByTestId("button-info").click();

  // Verify that the info notification contains the text "INFO"
  await expect(page.getByTestId("message-info")).toContainText("INFO");
});

test("verify warning notification functionality", async ({ page }) => {
  // Click the "Warning" button to trigger the warning notification
  await page.getByTestId("button-warning").click();

  // Verify that the warning notification contains the text "WARNING"
  await expect(page.getByTestId("message-warning")).toContainText("WARNING");
});

test("verify error notification functionality", async ({ page }) => {
  // Click the "Error" button to trigger the error notification
  await page.getByTestId("button-error").click();

  // Verify that the error notification contains the text "ERROR"
  await expect(page.getByTestId("message-error")).toContainText("ERROR");
});
