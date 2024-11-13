import { test, expect, beforeEach } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Checkbox"
  await mainPage.searchPlayground("Checkbox");

  // Click on the "Checkbox" block
  await page.getByRole("link", { name: "Checkbox A set of checkbox" }).click();
});

test("verify initial checkbox statuses", async ({ page }) => {
  // Verify that the correct page is loaded by checking for specific content
  const content = await page.textContent("body");
  expect(content).toContain("A set of checkbox scenarios to test against.");

  // Verify the initial status of each checkbox
  const checkedCheckbox = page.getByTestId("checked");
  const disabledCheckbox = page.getByTestId("disabled");
  const requiredCheckbox = page.getByTestId("required");
  const requiredMessage = page.getByTestId("required-message");

  await expect(checkedCheckbox).toBeChecked();
  await expect(disabledCheckbox).toBeDisabled();
  await expect(requiredCheckbox).not.toBeChecked();
  await expect(requiredMessage).toBeVisible();
});

test("verify you can uncheck and check the first checkbox", async ({
  page,
}) => {
  // Verify you can uncheck and check the first checkbox
  const checkedCheckbox = page.getByTestId("checked");
  await checkedCheckbox.uncheck();
  await expect(checkedCheckbox).not.toBeChecked();
  await checkedCheckbox.check();
  await expect(checkedCheckbox).toBeChecked();
});

test("verify the error message is displayed for the third checkbox", async ({
  page,
}) => {
  // Verify the error message is displayed for the third checkbox
  const requiredCheckbox = page.getByTestId("required");
  const requiredMessage = page.getByTestId("required-message");
  await expect(requiredMessage).toBeVisible();

  // Check the third checkbox and verify the error message is not displayed
  await requiredCheckbox.check();
  await expect(requiredMessage).not.toBeVisible();
});

test("verify the favorite and bookmark checkboxes functionality", async ({
  page,
}) => {
  // Verify the favorite and bookmark checkboxes are not checked
  const favoriteCheckbox = page.getByTestId("favorite").getByRole("checkbox");
  const bookmarkCheckbox = page.getByTestId("bookmark").getByRole("checkbox");

  await expect(favoriteCheckbox).not.toBeChecked();
  await expect(bookmarkCheckbox).not.toBeChecked();

  // Verify you can check and uncheck the favorite and bookmark checkboxes
  await favoriteCheckbox.check();
  await expect(favoriteCheckbox).toBeChecked();
  await bookmarkCheckbox.check();
  await expect(bookmarkCheckbox).toBeChecked();
  await favoriteCheckbox.uncheck();
  await expect(favoriteCheckbox).not.toBeChecked();
  await bookmarkCheckbox.uncheck();
  await expect(bookmarkCheckbox).not.toBeChecked();
});

test("verify the parent and child checkboxes functionality", async ({
  page,
}) => {
  // Verify the parent and child checkboxes functionality
  const parentCheckbox = page.getByTestId("parent");
  const parentCheckboxLabel = page.getByLabel("Parent");
  const childFirstCheckbox = page.getByTestId("child").first();
  const childSecondCheckbox = page.getByTestId("child").nth(1);

  // Check the parent checkbox and verify both child checkboxes are checked
  await parentCheckbox.check();
  await expect(parentCheckbox).toBeChecked();
  await expect(childFirstCheckbox).toBeChecked();
  await expect(childSecondCheckbox).toBeChecked();
  await expect(parentCheckboxLabel).toHaveAttribute(
    "data-indeterminate",
    "false"
  );

  // Uncheck the parent checkbox and verify both child checkboxes are unchecked
  await parentCheckbox.uncheck();
  await expect(parentCheckbox).not.toBeChecked();
  await expect(childFirstCheckbox).not.toBeChecked();
  await expect(childSecondCheckbox).not.toBeChecked();
  await expect(parentCheckboxLabel).toHaveAttribute(
    "data-indeterminate",
    "false"
  );

  // Check the first child checkbox and verify the parent checkbox is partially checked
  await childFirstCheckbox.check();
  await expect(childFirstCheckbox).toBeChecked();
  await expect(childSecondCheckbox).not.toBeChecked();
  await expect(parentCheckboxLabel).toHaveAttribute(
    "data-indeterminate",
    "true"
  );

  // Check the parent checkbox and verify both child checkboxes are checked
  await parentCheckbox.check();
  await expect(childFirstCheckbox).toBeChecked();
  await expect(childSecondCheckbox).toBeChecked();
  await expect(parentCheckboxLabel).toHaveAttribute(
    "data-indeterminate",
    "false"
  );

  // Uncheck the second child checkbox and verify the parent checkbox is partially checked
  await childSecondCheckbox.uncheck();
  await expect(childSecondCheckbox).not.toBeChecked();
  await expect(parentCheckboxLabel).toHaveAttribute(
    "data-indeterminate",
    "true"
  );
});
