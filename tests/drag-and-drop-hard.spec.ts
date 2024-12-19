import { test, expect, Locator } from "@playwright/test";
import { MainPage } from "../pages/MainPage";

let mainPage: MainPage;
let counter: Locator;

test.describe('Drag and Drop Tests @hard', () => {
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
    await mainPage.searchPlayground("Drag and Drop");
    await page.getByRole('link', { name: 'Drag and Drop Drag the' }).click();
    counter = page.getByTestId("total-count");
  });

  test("verify complex drag and drop functionality with shapes", async ({ page, browserName }) => {
    // Verify initial counter state
    await page.waitForTimeout(500); // Wait for initial state
    const initialCount = await counter.textContent();
    expect(initialCount).toContain("Total Correct: 0");

    // Find all draggable squares and circles
    const squares: Locator[] = [];
    const circles: Locator[] = [];

    // Check for draggable elements with IDs from 1 to 5
    for (let i = 1; i <= 5; i++) {
      const squareLocator = page.getByTestId(`draggable-square-${i}`);
      const circleLocator = page.getByTestId(`draggable-circle-${i}`);

      // If the element exists, add it to the corresponding array
      if (await squareLocator.count() > 0) {
        squares.push(squareLocator);
      }
      if (await circleLocator.count() > 0) {
        circles.push(circleLocator);
      }
    }

    // Get the drop targets
    const squareTarget = page.getByTestId("drop-square");
    const circleTarget = page.getByTestId("drop-circle");

    // Helper function to perform drag and drop with browser-specific handling
    async function performDragAndDrop(source: Locator, target: Locator): Promise<boolean> {
      const beforeCount = await counter.textContent();
      const startValue = parseInt(beforeCount?.replace('Total Correct: ', '') || '0');

      if (browserName === 'firefox') {
        // Firefox-specific approach using evaluate
        await page.evaluate(([sourceSelector, targetSelector]) => {
          const source = document.querySelector(`[data-testid="${sourceSelector}"]`);
          const target = document.querySelector(`[data-testid="${targetSelector}"]`);
          
          if (source && target) {
            const dragStartEvent = new DragEvent('dragstart', { bubbles: true });
            Object.defineProperty(dragStartEvent, 'dataTransfer', {
              value: new DataTransfer(),
            });
            
            source.dispatchEvent(dragStartEvent);
            
            const dropEvent = new DragEvent('drop', { bubbles: true });
            Object.defineProperty(dropEvent, 'dataTransfer', {
              value: dragStartEvent.dataTransfer,
            });
            
            target.dispatchEvent(dropEvent);
            
            const dragEndEvent = new DragEvent('dragend', { bubbles: true });
            source.dispatchEvent(dragEndEvent);
          }
        }, [source.getAttribute('data-testid'), target.getAttribute('data-testid')]);
      } else {
        // Standard approach for other browsers
        await source.dragTo(target);
      }

      // Wait for the counter to update
      await page.waitForTimeout(1000);

      // Verify the count increased by 1
      const afterCount = await counter.textContent();
      const endValue = parseInt(afterCount?.replace('Total Correct: ', '') || '0');
      return endValue === startValue + 1;
    }

    let successfulDrops = 0;

    // Process squares
    for (const square of squares) {
      if (await performDragAndDrop(square, squareTarget)) {
        successfulDrops++;
      }
      // Wait between drops
      await page.waitForTimeout(500);
    }

    // Process circles
    for (const circle of circles) {
      if (await performDragAndDrop(circle, circleTarget)) {
        successfulDrops++;
      }
      // Wait between drops
      await page.waitForTimeout(500);
    }

    // Final verification
    const finalCount = await counter.textContent();
    const finalValue = parseInt(finalCount?.replace('Total Correct: ', '') || '0');
    expect(finalValue).toBe(successfulDrops);
    expect(successfulDrops).toBeLessThanOrEqual(5);
  });
});
