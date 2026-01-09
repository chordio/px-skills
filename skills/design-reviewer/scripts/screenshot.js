#!/usr/bin/env node
const puppeteer = require('puppeteer-core');

async function capture() {
  const [,, width, height, filename] = process.argv;

  if (!width || !height || !filename) {
    console.log('Usage: node screenshot.js <width> <height> <filename>');
    console.log('Example: node screenshot.js 375 667 mobile.png');
    process.exit(1);
  }

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222'
  });

  const pages = await browser.pages();
  const page = pages[0];

  await page.setViewport({
    width: parseInt(width),
    height: parseInt(height)
  });

  await page.screenshot({ path: filename, fullPage: false });
  console.log(`Screenshot saved: ${filename}`);

  await browser.disconnect();
}

capture().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
