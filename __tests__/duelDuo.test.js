const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("ONE: page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("TWO: Draw button displays choices", async () => {
    await driver.get("http://localhost:8000");
// Check that the choices div is initially empty
    const choicesElement = await driver.findElement(By.id("choices"));
    const initialChoicesText = await choicesElement.getText();
    expect(initialChoicesText.trim()).toBe(""); 
// Click "Draw"
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    const updatedChoicesElement = await driver.wait(
      until.elementLocated(By.id("choices")),
      5000
    );
// Check that choices" div is no longer empty
    const updatedChoicesText = await updatedChoicesElement.getText();
    expect(updatedChoicesText.trim()).not.toBe(""); // Ensure it's not empty after clicking
  });
  test("THREE: USer can only select 2 bots", async () => {
    await driver.get("http://localhost:8000");
// Click "Draw" and find choices
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    const choicesElement = await driver.findElement(By.id("choices"));
// CLick the first three bots
    for (let i = 1; i <= 3; i++) {
      const botButton = await choicesElement.findElement(By.className("bot-btn"));
      await botButton.click();
      try {
        const alert = await driver.switchTo().alert();
        await alert.accept(); 
        break; 
      } catch (error) {
      }
    }
    await driver.switchTo().defaultContent();
// Count the bots actually added
    const botCards = await driver.findElements(By.css("#player-duo .bot-card.outline"));
    expect(botCards.length).toBe(2);
  });
});
