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
  await page.getByTestId("button-success").click();
  await expect(page.getByTestId("message-success")).toContainText("SUCCESS");
});

test("verify info notification functionality", async ({ page }) => {
  await page.getByTestId("button-info").click();
  await expect(page.getByTestId("message-info")).toContainText("INFO");
});

test("verify warning notification functionality", async ({ page }) => {
  await page.getByTestId("button-warning").click();
  await expect(page.getByTestId("message-warning")).toContainText("WARNING");
});

test("verify error notification functionality", async ({ page }) => {
  await page.getByTestId("button-error").click();
  await expect(page.getByTestId("message-error")).toContainText("ERROR");
});
