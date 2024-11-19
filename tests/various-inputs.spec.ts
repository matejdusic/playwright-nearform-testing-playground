import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Various Inputs"
  await mainPage.searchPlayground('Various Inputs');

  // Click on the "Various Inputs" block
  await page.getByRole('link', { name: 'Various Inputs There are all' }).click();
});

test('verify text input functionality', async ({ page }) => {
  const inputText = 'Random text';

  // Input text into the text input field
  await page.getByTestId('text-input').fill(inputText);

  // Verify that the inputted text is displayed in the output field
  const outputText = await page.locator('input[type="text"]').nth(1).inputValue();
  expect(outputText).toBe(inputText);
});

test('verify password input functionality', async ({ page }) => {
  const inputPassword = 'SecretPassword';

  // Input password into the password input field
  await page.getByTestId('password-input').fill(inputPassword);

  // Verify that the inputted password is displayed in the output field
  const outputPassword = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'PasswordInput:Output:' })
    .locator('input[type="text"]')
    .inputValue();
  expect(outputPassword).toBe(inputPassword);
});

test('verify number input functionality', async ({ page }) => {
  const inputNumber = '12345';

  // Input number into the number input field
  await page.getByTestId('number-input').fill(inputNumber);

  // Verify that the inputted number is displayed in the output field
  const outputNumber = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'NumberInput:Output:' })
    .getByRole('textbox')
    .inputValue();
  expect(outputNumber).toBe(inputNumber);
});

test('verify date input functionality', async ({ page }) => {
  const inputDate = '2023-12-25'; // Correct format for date input type

  // Input date into the date input field
  await page.getByTestId('date-input').fill(inputDate);

  // Verify that the inputted date is displayed in the output field in yyyy-mm-dd format
  const outputDate = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'DateInput:Output:' })
    .locator('input[type="text"]')
    .inputValue();
  expect(outputDate).toBe('2023-12-25');
});

test('verify textarea input functionality', async ({ page }) => {
  const inputTextArea = 'This is a test for TextArea input.';

  // Input text into the textarea input field
  await page.getByTestId('textarea-input').fill(inputTextArea);

  // Verify that the inputted text is displayed in the output field
  const outputTextArea = await page.locator('textarea').nth(2).inputValue();
  expect(outputTextArea).toBe(inputTextArea);
});

test('verify clear all functionality', async ({ page }) => {
  // Input values into all fields
  await page.getByTestId('text-input').fill('Random text');
  await page.getByTestId('password-input').fill('SecretPassword');
  await page.getByTestId('number-input').fill('12345');
  await page.getByTestId('date-input').fill('2023-12-25');
  await page.getByTestId('textarea-input').fill('This is a test for TextArea input.');

  // Click the "Clear All" button
  await page.getByRole('button', { name: 'Clear All' }).click();

  // Verify that all input and output fields are empty
  const textInput = await page.getByTestId('text-input').inputValue();
  const textOutput = await page.locator('input[type="text"]').nth(1).inputValue();
  const passwordInput = await page.getByTestId('password-input').inputValue();
  const passwordOutput = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'PasswordInput:Output:' })
    .locator('input[type="text"]')
    .inputValue();
  const numberInput = await page.getByTestId('number-input').inputValue();
  const numberOutput = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'NumberInput:Output:' })
    .getByRole('textbox')
    .inputValue();
  const dateInput = await page.getByTestId('date-input').inputValue();
  const dateOutput = await page
    .getByRole('main')
    .locator('div')
    .filter({ hasText: 'DateInput:Output:' })
    .locator('input[type="text"]')
    .inputValue();
  const textAreaInput = await page.getByTestId('textarea-input').inputValue();
  const textAreaOutput = await page.locator('textarea').nth(2).inputValue();

  expect(textInput).toBe('');
  expect(textOutput).toBe('');
  expect(passwordInput).toBe('');
  expect(passwordOutput).toBe('');
  expect(numberInput).toBe('');
  expect(numberOutput).toBe('');
  expect(dateInput).toBe('');
  expect(dateOutput).toBe('');
  expect(textAreaInput).toBe('');
  expect(textAreaOutput).toBe('');
});