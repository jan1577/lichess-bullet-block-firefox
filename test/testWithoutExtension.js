const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const firefox = require("selenium-webdriver/firefox");

let firefoxOptions = new firefox.Options();
firefoxOptions.addArguments('--headless');

if (process.env.FIREFOX_PATH) {
    firefoxOptions.setBinary(process.env.FIREFOX_PATH);
}

let driver = new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(firefoxOptions)
    .build();

async function doesElementExist(selector, expected) {
    let elementExists = await driver.executeScript(`return document.querySelector('${selector}') !== null`);
    expect(elementExists).to.equal(expected);
}

describe('Test Quick Pair Removal without extension', function() {
    this.timeout(0); // Disable Mocha's timeout

    before(async function() {
        await driver.get('https://lichess.org');
    });

    it('should check all elements exist without extension', async function() {
        let selectorArray = ['[data-id="1+0"]', '[data-id="2+1"]', '[data-id="3+0"]', '[data-id="5+0"]', '[data-id="3+2"]', '[data-id="5+3"]'];
        for (let selector of selectorArray) {
            await doesElementExist(selector, true);
        }
    });

    after(async function() {
        await driver.quit();
    });
});