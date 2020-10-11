const { chromium } = require('playwright');
const { PlaywrightChunks } = require('./lib');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 800 });

  const chunks = new PlaywrightChunks(page);

  chunks.start({
    resourceTypes: ['script'],
    sameOrigin: true
  });

  await page.goto('https://skuap.com/');

  await page.waitForSelector('.container > .row > .col-md-2:nth-child(3) > .nav > .nav-item:nth-child(1)')
  await page.click('.container > .row > .col-md-2:nth-child(3) > .nav > .nav-item:nth-child(1)')

  const resources = await chunks.stop(); 
  console.log(resources);
  console.log(resources.length);

  await browser.close();
})()