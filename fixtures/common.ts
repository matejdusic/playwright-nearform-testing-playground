import { test as base } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { credentials } from '../test-data/credentials';
import { loginSelectors } from '../test-data/selectors';

// Extend the base test type with our custom fixtures
export const test = base.extend({
    // Fixture to provide a MainPage instance
    mainPage: async ({ page }, use) => {
        const mainPage = new MainPage(page);
        await mainPage.open();
        await use(mainPage);
    },

    // Fixture that navigates to a specific playground section
    playgroundPage: async ({ mainPage, page }, use) => {
        await use(async (section: string) => {
            await mainPage.searchPlayground(section);
            await page.getByRole("link", { name: new RegExp(section) }).click();
            return page;
        });
    },

    // Fixture that provides a logged-in page
    loggedInPage: async ({ page, mainPage }, use) => {
        // Navigate to login page
        await mainPage.searchPlayground("Login Form");
        await page.getByRole("link", { name: "Login Form A typical login" }).click();

        // Perform login
        await page.getByLabel(loginSelectors.username).fill(credentials.valid.username);
        await page.getByLabel(loginSelectors.password).fill(credentials.valid.password);
        await page.getByTestId(loginSelectors.loginButton).click();

        // Use the logged-in page
        await use(page);

        // Optional: Logout after test if needed
        const logoutButton = page.getByTestId(loginSelectors.logoutButton);
        if (await logoutButton.isVisible())
            await logoutButton.click();
    }
});

// Export expect from the base test
export { expect } from '@playwright/test';
