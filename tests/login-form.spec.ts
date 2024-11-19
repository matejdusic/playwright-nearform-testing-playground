import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Login Form"
  await mainPage.searchPlayground("Login Form");

  // Click on the "Login Form" block
  await page.getByRole("link", { name: "Login Form A typical login" }).click();
});

test("verify successful login", async ({ page }) => {
  // Input username
  await page.getByLabel("Username").fill("admin");

  // Input password
  await page.getByLabel("Password").fill("Passw0rd!");

  // Click the login button
  await page.getByTestId("login-button").click();

  // Verify successful login by checking for a specific element or message
  const successMessage = await page.textContent("body");
  expect(successMessage).toContain("You are currently logged in!");
});

test("verify logout functionality", async ({ page }) => {
  // Input username
  await page.getByLabel("Username").fill("admin");

  // Input password
  await page.getByLabel("Password").fill("Passw0rd!");

  // Click the login button
  await page.getByTestId("login-button").click();

  // Verify successful login by checking for a specific element or message
  const successMessage = await page.textContent("body");
  expect(successMessage).toContain("You are currently logged in!");

  // Click the logout button
  await page.getByTestId("logout-button").click();

  // Verify that we are back on the login form by
  // checking for the visibility of Username and Password input fields
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  // Attempt incorrect login
  await page.getByLabel("Username").fill("wronguser");
  await page.getByLabel("Password").fill("wrongpass");
  await page.getByTestId("login-button").click();

  // Verify that the login failed by checking for an error message
  const errorMessage = await page.textContent("body");
  expect(errorMessage).toContain(
    "The credentials you have provided are invalid"
  );
});
