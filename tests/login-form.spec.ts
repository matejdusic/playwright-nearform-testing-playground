import { test, expect } from '../fixtures/common';
import { credentials } from "../test-data/credentials";
import { loginSelectors } from "../test-data/selectors";

test.describe('Login Form Tests @easy', () => {
  test("verify successful login", async ({ mainPage, playgroundPage, page }) => {
    // Navigate to login page
    await playgroundPage("Login Form");
    
    // Perform login
    await page.getByLabel(loginSelectors.username).fill(credentials.valid.username);
    await page.getByLabel(loginSelectors.password).fill(credentials.valid.password);
    await page.getByTestId(loginSelectors.loginButton).click();
    
    // Verify success message
    await expect(page.locator(loginSelectors.successMessage))
      .toHaveText("You are currently logged in!");
  });

  test("verify login with invalid credentials", async ({ mainPage, playgroundPage, page }) => {
    // Navigate to login page
    await playgroundPage("Login Form");
    
    // Try to login with invalid credentials
    await page.getByLabel(loginSelectors.username).fill(credentials.invalid.username);
    await page.getByLabel(loginSelectors.password).fill(credentials.invalid.password);
    await page.getByTestId(loginSelectors.loginButton).click();
    
    // Verify error message
    await expect(page.getByTestId(loginSelectors.errorMessage))
      .toBeVisible();
  });

  test("verify complete login-logout cycle", async ({ loggedInPage }) => {
    // The loggedInPage fixture handles the login for us
    await expect(loggedInPage.locator(loginSelectors.successMessage))
      .toHaveText("You are currently logged in!");
    
    // Click logout
    await loggedInPage.getByTestId(loginSelectors.logoutButton).click();
    
    // Verify login button is visible (meaning we're logged out)
    await expect(loggedInPage.getByTestId(loginSelectors.loginButton))
      .toBeVisible();
  });
});
