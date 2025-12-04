import puppeteer from "puppeteer";

describe("Popover Widget", () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });

    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  test("Popover should render and appear on button click", async () => {
  console.log("1. Ищем кнопку...");
  const button = await page.$('btn btn-primary"]');
  if (!button) {
    throw new Error("Кнопка не найдена!");
  }

  console.log("2. Кликаем по кнопке...");
  await button.click();

  console.log("3. Ждём появления popover...");
  await page.waitForSelector(".popover", { visible: true, timeout: 10000 });

  console.log("4. Читаем заголовок и содержимое...");
  const title = await page.$eval(".popover-header", (el) => el.textContent);
  const content = await page.$eval(".popover-body", (el) => el.textContent);

  console.log("Заголовок:", title);
  console.log("Содержимое:", content);

  expect(title).toBe("Popover title");
  expect(content).toBe(
    "And here's some amazing content. It's very engaging. Right?",
  );
});

  test("Popover should render and appear on button click", async () => {
    const button = await page.$('btn btn-primary');
    await button.click();

    await page.waitFor(".popover", { visible: true });

    const title = await page.$eval(".popover-header", (el) => el.textContent);
    const content = await page.$eval(".popover-body", (el) => el.textContent);

    expect(title).toBe("Popover title");
    expect(content).toBe(
      "And here's some amazing content. It's very engaging. Right?",
    );
  });

  test("Popover should be positioned above the button", async () => {
    const button = await page.$('btn btn-primary');
    await button.click();

    await page.waitFor(".popover", { visible: true });

    const buttonRect = await page.evaluate(() => {
      const btn = document.querySelector('btn btn-primary"]');
      return btn.getBoundingClientRect();
    });

    const popoverRect = await page.evaluate(() => {
      const pop = document.querySelector(".popover");
      return pop.getBoundingClientRect();
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
