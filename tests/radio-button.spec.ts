import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Radio button"
  await mainPage.searchPlayground("Radio button");

  // Click on the "Radio button" block
  await page
    .getByRole("link", { name: "Radio button A set of radio buttons" })
    .click();
});

test("verify initial state of primary colours", async ({ page }) => {
  // Verify the initial state of the primary colours
  await expect(page.getByLabel("Red")).toBeVisible();
  await expect(page.getByLabel("Blue")).toBeVisible();
  await expect(page.getByLabel("Yellow")).toBeVisible();
  await expect(page.getByLabel("White")).toBeDisabled();
});

test("verify secondary colours when Red is selected", async ({ page }) => {
  // Click on Red and verify secondary colours
  await page.getByLabel("Red").click();
  await expect(page.getByLabel("Purple")).toBeVisible();
  await expect(page.getByLabel("Orange")).toBeVisible();
});

test("verify secondary colours when Blue is selected", async ({ page }) => {
  // Click on Blue and verify secondary colours
  await page.getByLabel("Blue").click();
  await expect(page.getByLabel("Purple")).toBeVisible();
  await expect(page.getByLabel("Green")).toBeVisible();
});

test("verify secondary colours when Yellow is selected", async ({ page }) => {
  // Click on Yellow and verify secondary colours
  await page.getByLabel("Yellow").click();
  await expect(page.getByLabel("Orange")).toBeVisible();
  await expect(page.getByLabel("Green")).toBeVisible();
});

test("verify Purple remains selected when switching from Blue to Red", async ({
  page,
}) => {
  // Click on Purple while Blue is selected,
  // then click on Red and verify Purple is still selected
  await page.getByLabel("Blue").click();
  await page.getByLabel("Purple").click();
  await page.getByLabel("Red").click();
  await expect(page.getByLabel("Purple")).toBeChecked();
});

test("verify Orange remains selected when switching from Red to Yellow", async ({
  page,
}) => {
  // Click on Orange while Red is selected,
  // then click on Yellow and verify Orange is still selected
  await page.getByLabel("Red").click();
  await page.getByLabel("Orange").click();
  await page.getByLabel("Yellow").click();
  await expect(page.getByLabel("Orange")).toBeChecked();
});

test("verify Green remains selected when switching from Yellow to Blue", async ({
  page,
}) => {
  // Click on Green while Yellow is selected,
  // then click on Blue and verify Green is still selected
  await page.getByLabel("Yellow").click();
  await page.getByLabel("Green").click();
  await page.getByLabel("Blue").click();
  await expect(page.getByLabel("Green")).toBeChecked();
});
