import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";
import path from "path";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "File Upload"
  await mainPage.searchPlayground("File Upload");

  // Click on the "File Upload - Medium" block
  await page.getByRole("link", { name: "File Upload Using common" }).click();
});

test("verify file upload functionality", async ({ page }) => {
  // Define the path to the file to be uploaded
  const filePath = path.join(__dirname, '/dependencies/samplefile.txt');

  // Set the file to be uploaded using the file input element
  await page.getByTestId('select-file').setInputFiles(filePath);

  // Verify that the file has been selected by checking the file name
  await expect(page.getByTestId('selected-file-name')).toContainText(
    'samplefile.txt'
  );

  // Click the "Upload" button to upload the file
  await page.getByTestId('upload-button').click();

  // Verify that the upload was successful by checking the upload message
  await expect(page.getByTestId('upload-message')).toContainText(
    /uploaded successfully/,
    {timeout: 10000}
  );
});
