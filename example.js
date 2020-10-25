const { chromium } = require('playwright');
const { Diff } = require('./lib');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser'
  });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 800 });
  
  const diff = new Diff({
    page,
    initialUrl: 'https://maxigimenez.xyz',
    toUrl: 'https://personal.maxigimenez.now.sh'
  });
  
  const result = await diff.compare();
  
  console.log(result);

  // const chunks = new PlaywrightChunks(page);

  // chunks.start({
  //   resourceTypes: ['script'],
  //   sameOrigin: true
  // });

  // await page.goto('https://skuap.com/');

  // const resources = await chunks.stop(); 
  // console.log(resources);
  // console.log(resources.length);

  await browser.close();
})()