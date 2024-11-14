const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async () => {
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(
      new chrome.Options().addArguments("--headless=new", "--headless")
    )
    .build();
  await driver.get("http://localhost:8080/");

  await driver.quit();
})();
