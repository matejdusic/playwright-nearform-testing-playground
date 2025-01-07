import { test, expect } from '../fixtures/common';
import { checkboxSelectors } from "../test-data/selectors";

test.describe('Checkbox Tests @easy', () => {
  test("verify initial checkbox states", async ({ playgroundPage, page }) => {
    await playgroundPage("Checkbox");

    // Verify content and initial checkbox states
    await expect(page.getByText("A set of checkbox scenarios to test against.")).toBeVisible();

    const checkboxes = {
      checked: page.getByTestId(checkboxSelectors.checked),
      disabled: page.getByTestId(checkboxSelectors.disabled),
      required: page.getByTestId(checkboxSelectors.required),
      requiredMessage: page.getByTestId(checkboxSelectors.requiredMessage)
    };

    await expect(checkboxes.checked).toBeChecked();
    await expect(checkboxes.disabled).toBeDisabled();
    await expect(checkboxes.required).not.toBeChecked();
    await expect(checkboxes.requiredMessage).toBeVisible();
  });

  test("verify toggle functionality of checked checkbox", async ({ playgroundPage, page }) => {
    await playgroundPage("Checkbox");
    
    const checkedBox = page.getByTestId(checkboxSelectors.checked);
    
    await checkedBox.uncheck();
    await expect(checkedBox).not.toBeChecked();
    
    await checkedBox.check();
    await expect(checkedBox).toBeChecked();
  });

  test("verify required checkbox error message", async ({ playgroundPage, page }) => {
    await playgroundPage("Checkbox");
    
    const requiredBox = page.getByTestId(checkboxSelectors.required);
    const errorMessage = page.getByTestId(checkboxSelectors.requiredMessage);

    await expect(errorMessage).toBeVisible();
    await requiredBox.check();
    await expect(errorMessage).not.toBeVisible();
  });

  test("verify favorite and bookmark checkboxes", async ({ playgroundPage, page }) => {
    await playgroundPage("Checkbox");
    
    const checkboxes = {
      favorite: page.getByTestId(checkboxSelectors.favorite).getByRole("checkbox"),
      bookmark: page.getByTestId(checkboxSelectors.bookmark).getByRole("checkbox")
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

  test("verify parent-child checkbox relationship", async ({ playgroundPage, page }) => {
    await playgroundPage("Checkbox");
    
    const elements = {
      parent: page.getByTestId(checkboxSelectors.parent),
      parentLabel: page.getByLabel("Parent"),
      children: [
        page.getByTestId(checkboxSelectors.child).first(),
        page.getByTestId(checkboxSelectors.child).nth(1)
      ]
    };

    // Initial state - all unchecked
    await expect(elements.parent).not.toBeChecked();
    for (const child of elements.children) {
      await expect(child).not.toBeChecked();
    }

    // Check parent - should check all children
    await elements.parentLabel.check();
    await expect(elements.parent).toBeChecked();
    for (const child of elements.children) {
      await expect(child).toBeChecked();
    }

    // Uncheck parent - should uncheck all children
    await elements.parentLabel.uncheck();
    await expect(elements.parent).not.toBeChecked();
    for (const child of elements.children) {
      await expect(child).not.toBeChecked();
    }
  });
});
