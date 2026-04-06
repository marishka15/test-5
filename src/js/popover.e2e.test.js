const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("Popover Widget", () => {
  let browser;
  let page;
  
  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    page = await browser.newPage();
    await page.goto("http://localhost:3000");
    });

    test("Popover should render and appear on button click", async () => {
    const button = await page.$(".btn");
    await button.click();

    await page.waitForSelector(".popover", { visible: true });

    const title = await page.$eval(".popover-header", (el) => el.textContent);
    const content = await page.$eval(".popover-body", (el) => el.textContent);

    expect(title).toBe("Popover title");
    expect(content).toBe(
      "And here's some amazing content. It's very engaging. Right?",
    );
    });

    test("Popover should be positioned above the button", async () => {
    const button = await page.$(".btn");
    await button.click();

    await page.waitForSelector(".popover", { visible: true });

    const buttonRect = await page.evaluate(() => {
    const btn = document.querySelector(".btn");
    const { top, left, bottom, right, width, height } = btn.getBoundingClientRect();
    return { top, left, bottom, right, width, height };
    });

    const popoverRect = await page.evaluate(() => {
    const popover = document.querySelector(".popover");
    const { top, left, bottom, right, width, height } = popover.getBoundingClientRect();
    return { top, left, bottom, right, width, height };
    });

    expect(popoverRect.bottom).toBeLessThanOrEqual(buttonRect.top);

    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const popoverCenter = popoverRect.left + popoverRect.width / 2;
    const diff = Math.abs(buttonCenter - popoverCenter);

    expect(diff).toBeLessThanOrEqual(5);
    });

  afterEach(async () => {
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.warn("Не удалось закрыть браузер:", err.message);
      } finally {
        browser = null;
      }
    }
  });
});
