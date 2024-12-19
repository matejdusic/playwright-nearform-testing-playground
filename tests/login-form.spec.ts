import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Login Form Tests @easy', () => {
  const validCredentials = {
    username: 'admin',
    password: 'Passw0rd!'
  };

  const selectors = {
    username: 'Username',
    password: 'Password',
    loginButton: 'login-button',
    logoutButton: 'logout-button',
    successMessage: '.MuiAlert-message',
    errorMessage: 'error-invalid-credentials'
  };

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Login Form");
    await page.getByRole("link", { name: "Login Form A typical login" }).click();
  });

  async function performLogin(page, username: string, password: string) {
    await page.getByLabel(selectors.username).fill(username);
    await page.getByLabel(selectors.password).fill(password);
    await page.getByTestId(selectors.loginButton).click();
  }

  test("verify successful login", async ({ page }) => {
    await performLogin(page, validCredentials.username, validCredentials.password);
    
    // Wait for and verify the success message
    await expect(page.locator(selectors.successMessage))
      .toHaveText("You are currently logged in!");
  });

  test("verify login with invalid credentials", async ({ page }) => {
    await performLogin(page, 'wronguser', 'wrongpass');
    
    // Wait for and verify the error message
    await expect(page.getByTestId(selectors.errorMessage))
      .toBeVisible();
  });

  test("verify complete login-logout cycle", async ({ page }) => {
    // Login
    await performLogin(page, validCredentials.username, validCredentials.password);
    await expect(page.locator(selectors.successMessage))
      .toHaveText("You are currently logged in!");

    // Logout
    await page.getByTestId(selectors.logoutButton).click();

    // Verify return to login form
    const formElements = [
      page.getByLabel(selectors.username),
      page.getByLabel(selectors.password),
      page.getByTestId(selectors.loginButton)
    ];

    for (const element of formElements) {
      await expect(element).toBeVisible();
    }

    // After logout, form should be empty and ready for new login
    await expect(page.getByLabel(selectors.username)).toHaveValue('');
    await expect(page.getByLabel(selectors.password)).toHaveValue('');
  });
});
