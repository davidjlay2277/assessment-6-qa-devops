const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  test("Draw button displays choices", async () => {
    await driver.get("http://localhost:8000");
//Check choices for content, should be empty
    const choicesBeforeDraw = await driver.findElement(By.id("choices"));
    const initialChoicesContent = await choicesBeforeDraw.getText();
    expect(initialChoicesContent.trim()).toBe("");
// Click draw
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
//Check choices for content, should not be empty
    const choicesAfterDraw = await driver.wait(
      until.elementLocated(By.id("choices")),
      2000
    );
    const afterDrawChoices = await choicesAfterDraw.getText();
    expect(afterDrawChoices.trim()).not.toBe(""); // Ensure it's not empty after clicking
  });
});
