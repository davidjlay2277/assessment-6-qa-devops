const { Builder, By, until } = require("selenium-webdriver");
const webdriver = require("selenium-webdriver");

describe("Jest tests", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("THREE", async () => {
    // Navigate to your web page
    await driver.get("http://localhost:8000");

    // Click the "Draw" button
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();

    // Find the "choices" div
    const choicesElement = await driver.findElement(By.id("choices"));

        //click the bot button
    const botButton = await choicesElement.findElement(By.className("bot-btn"));
    await botButton.click();
    await botButton.click();
    await botButton.click();


    // Find all div tags with class "bot-card outline" inside the "player-duo" div
    const botCards = await driver.findElements(
      By.css("#player-duo .bot-card.outline")
    );
    expect(botCards.length).toBe(2);
  });
});
