import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;

test.describe('Checkbox Tests @easy', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Checkbox");
    await page.getByRole("link", { name: "Checkbox A set of checkbox" }).click();
  });

  test("verify initial checkbox states", async ({ page }) => {
    // Verify content and initial checkbox states
    await expect(page.getByText("A set of checkbox scenarios to test against.")).toBeVisible();

    const checkboxes = {
      checked: page.getByTestId("checked"),
      disabled: page.getByTestId("disabled"),
      required: page.getByTestId("required"),
      requiredMessage: page.getByTestId("required-message")
    };

    await expect(checkboxes.checked).toBeChecked();
    await expect(checkboxes.disabled).toBeDisabled();
    await expect(checkboxes.required).not.toBeChecked();
    await expect(checkboxes.requiredMessage).toBeVisible();
  });

  test("verify toggle functionality of checked checkbox", async ({ page }) => {
    const checkedBox = page.getByTestId("checked");
    
    await checkedBox.uncheck();
    await expect(checkedBox).not.toBeChecked();
    
    await checkedBox.check();
    await expect(checkedBox).toBeChecked();
  });

  test("verify required checkbox error message", async ({ page }) => {
    const requiredBox = page.getByTestId("required");
    const errorMessage = page.getByTestId("required-message");

    await expect(errorMessage).toBeVisible();
    await requiredBox.check();
    await expect(errorMessage).not.toBeVisible();
  });

  test("verify favorite and bookmark checkboxes", async ({ page }) => {
    const checkboxes = {
      favorite: page.getByTestId("favorite").getByRole("checkbox"),
      bookmark: page.getByTestId("bookmark").getByRole("checkbox")
    };

    // Verify initial state
    for (const checkbox of Object.values(checkboxes)) {
      await expect(checkbox).not.toBeChecked();
    }

    // Test check/uncheck cycle
    for (const checkbox of Object.values(checkboxes)) {
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test("verify parent-child checkbox relationship", async ({ page }) => {
    const elements = {
      parent: page.getByTestId("parent"),
      parentLabel: page.getByLabel("Parent"),
      children: [
        page.getByTestId("child").first(),
        page.getByTestId("child").nth(1)
      ]
    };

    // Check parent affects children
    await elements.parent.check();
    await expect(elements.parent).toBeChecked();
    for (const child of elements.children) {
      await expect(child).toBeChecked();
    }
    await expect(elements.parentLabel).toHaveAttribute("data-indeterminate", "false");

    // Uncheck parent affects children
    await elements.parent.uncheck();
    await expect(elements.parent).not.toBeChecked();
    for (const child of elements.children) {
      await expect(child).not.toBeChecked();
    }
    await expect(elements.parentLabel).toHaveAttribute("data-indeterminate", "false");

    // Check one child affects parent state
    await elements.children[0].check();
    await expect(elements.parentLabel).toHaveAttribute("data-indeterminate", "true");
    
    // Check all children affects parent state
    await elements.children[1].check();
    await expect(elements.parent).toBeChecked();
    await expect(elements.parentLabel).toHaveAttribute("data-indeterminate", "false");
  });
});
