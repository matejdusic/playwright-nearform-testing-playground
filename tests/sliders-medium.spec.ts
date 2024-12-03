import { test, expect, devices } from "@playwright/test";
import { MainPage } from "../pages/MainPage";
import { Helpers } from "../pages/Helpers";

let mainPage: MainPage;

test.beforeEach(async ({ page }) => {
  mainPage = new MainPage(page);

  // Open the main page
  await mainPage.open();

  // Search for "Sliders"
  await mainPage.searchPlayground("Sliders");

  // Click on the "Sliders" block
  await page.getByRole("link", { name: "Sliders" }).click();
});

test("verify basic slider functionality", async ({ page }) => {
  //skipping this due to issues with sliders on mobile resolutions
  test.skip(test.info().project.name === "Mobile WebKit");
  test.skip(test.info().project.name === "Mobile Chromium");

  const helpers = new Helpers(page);
  const basicSliderElement = await page.getByTestId("basic-slider");

  // Set the slider value to 10%
  await helpers.setSliderValue(basicSliderElement, 9);

  // Verify the slider value is set to 10
  expect(
    await basicSliderElement.getByRole("slider").getAttribute("value")
  ).toEqual("10");
});

// skipping due to issues with range slider on firefox
// test.skip('verify range slider functionality', async ({ page }) => {
//   const helpers = new Helpers(page);
//   const rangeSliderElement = await page.getByTestId('range-slider');

//   // Set the slider range values to 20% and 90%
//   await helpers.setSliderValue(rangeSliderElement, 19, 90);

//   // Verify the slider range values
//   expect(
//     await rangeSliderElement.getByRole('slider').first().getAttribute('value')
//   ).toEqual('20');

//   expect(
//     await rangeSliderElement.getByRole('slider').last().getAttribute('value')
//   ).toEqual('90');
// });

test("verify slider with input functionality", async ({ page }) => {
  // Set the input value to 90
  await page.getByLabel("Value").fill("90", { force: true });

  // Verify the slider value is set to 90
  expect(
    await page
      .getByTestId("input-slider")
      .getByRole("slider")
      .last()
      .getAttribute("value")
  ).toEqual("90");
});
