import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "File Download"
  await mainPage.searchPlayground('File Download');

  // Click on the "File Download - Medium" block
  await page.getByRole('link', { name: 'File Download Using common' }).click();
});

test('verify file download functionality', async ({ page }) => {
  // Wait for the download event to be triggered
  const downloadPromise = page.waitForEvent('download');

  // Click the "Download File" button to start the download
  await page.getByRole('button', { name: 'Download File' }).click();

  // Wait for the download to complete and get the download object
  const download = await downloadPromise;

  // Verify that the suggested filename is "file.txt"
  expect(download.suggestedFilename()).toEqual('file.txt');
});