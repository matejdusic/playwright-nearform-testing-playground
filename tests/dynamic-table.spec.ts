import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Dynamic Table Tests @easy', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);

    // Open the main page
    await mainPage.open();

    // Search for "Dynamic Table"
    await mainPage.searchPlayground("Dynamic Table");

    // Click on the specific Dynamic Table challenge
    await page.getByRole('link', { name: 'Dynamic Table' }).click();
  });

  test("verify data within green bar matches table data", async ({ page, browserName }) => {
    // Wait for table and target scenario to be visible
    await Promise.all([
      page.waitForSelector('table'),
      page.waitForSelector('[data-testid="target-scenario"]')
    ]);
    
    // Get the target scenario text first
    const targetScenario = page.getByTestId("target-scenario");
    const targetText = await targetScenario.textContent();
    
    // Parse the expected values
    const matches = targetText?.match(/(\w+)\s+CPU:\s+([\d.]+)/);
    if (!matches) {
      throw new Error('Could not parse target scenario text');
    }
    
    const expectedName = matches[1];
    const expectedCpu = parseFloat(matches[2]);
    
    // Wait specifically for the table row containing our expected name
    await page.waitForSelector(`tr:has(td:text("${expectedName}"))`, { timeout: 5000 });
    
    // Get table headers
    const headers = await page.locator('th').allInnerTexts();
    const nameIndex = headers.findIndex(header => header === 'Name');
    const cpuIndex = headers.findIndex(header => header === 'CPU');
    
    // Get the specific row with our expected name
    const targetRow = page.locator(`tr:has(td:text("${expectedName}"))`);
    const cells = await targetRow.locator('td').all();
    
    // Get the CPU value from the correct column
    const cpuText = await cells[cpuIndex].textContent();
    const tableCpu = parseFloat(cpuText?.replace('%', '') || '0');
    
    // Adjust tolerance based on browser
    const tolerance = browserName === 'webkit' ? 0.2 : 0.1;
    
    // Compare the values
    const difference = Math.abs(tableCpu - expectedCpu);
    expect(difference, 
      `CPU values don't match. Table: ${tableCpu}%, Expected: ${expectedCpu}%. Difference: ${difference}`
    ).toBeLessThan(tolerance);
  });
});
