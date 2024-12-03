import { Locator, Page } from '@playwright/test';

export class Helpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setSliderValue(
    sliderElement: Locator,
    percentage: number,
    maxPercentage?: number
  ) {
    // Get the width of the slider element
    const sliderOffsetWidth = await sliderElement.evaluate((element) => {
      return element.getBoundingClientRect().width;
    });

    // Calculate the target width based on the percentage
    const sliderGoalWidth = (sliderOffsetWidth * percentage) / 100;

    // Hover over the start of the slider
    await sliderElement.hover({ force: true, position: { x: 0, y: 0 } });

    // Press the mouse down
    await this.page.mouse.down();

    // Hover to the target position
    await sliderElement.hover({
      force: true,
      position: { x: sliderGoalWidth, y: 0 },
    });

    // Release the mouse
    await this.page.mouse.up();

    // If maxPercentage is provided, set the slider to the max value
    if (maxPercentage) {
      const sliderMaxGoalWidth = (sliderOffsetWidth * maxPercentage) / 100;

      await sliderElement.hover({
        force: true,
        position: { x: sliderOffsetWidth - 100, y: 0 },
      });

      await this.page.mouse.down();

      await sliderElement.hover({
        force: true,
        position: { x: sliderMaxGoalWidth, y: 0 },
      });

      await this.page.mouse.up();
    }
  }
}