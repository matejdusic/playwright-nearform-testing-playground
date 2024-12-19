import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

let mainPage: MainPage;

test.describe('Various Inputs Tests @easy', () => {
  const testData = {
    text: {
      id: 'text-input',
      value: 'Random text',
      getOutput: (page) => page.locator('input[type="text"]').nth(1)
    },
    password: {
      id: 'password-input',
      value: 'SecretPassword',
      getOutput: (page) => page.getByRole('main')
        .locator('div')
        .filter({ hasText: 'PasswordInput:Output:' })
        .locator('input[type="text"]')
    },
    number: {
      id: 'number-input',
      value: '12345',
      getOutput: (page) => page.getByRole('main')
        .locator('div')
        .filter({ hasText: 'NumberInput:Output:' })
        .getByRole('textbox')
    },
    date: {
      id: 'date-input',
      value: '2023-12-25',
      getOutput: (page) => page.getByRole('main')
        .locator('div')
        .filter({ hasText: 'DateInput:Output:' })
        .locator('input[type="text"]')
    },
    textarea: {
      id: 'textarea-input',
      value: 'This is a test for TextArea input.',
      getOutput: (page) => page.locator('textarea').nth(2)
    }
  };

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground('Various Inputs');
    await page.getByRole('link', { name: 'Various Inputs There are all' }).click();
  });

  // Test each input type
  for (const [type, data] of Object.entries(testData)) {
    test(`verify ${type} input functionality`, async ({ page }) => {
      // Input value
      await page.getByTestId(data.id).fill(data.value);

      // Verify output
      const outputValue = await data.getOutput(page).inputValue();
      expect(outputValue).toBe(data.value);
    });
  }

  test('verify clear all functionality', async ({ page }) => {
    // Fill all inputs
    for (const data of Object.values(testData)) {
      await page.getByTestId(data.id).fill(data.value);
    }

    // Clear all inputs
    await page.getByRole('button', { name: 'Clear All' }).click();

    // Verify all inputs and outputs are cleared
    for (const data of Object.values(testData)) {
      const input = page.getByTestId(data.id);
      const output = data.getOutput(page);

      await expect(input).toHaveValue('');
      await expect(output).toHaveValue('');
    }
  });
});