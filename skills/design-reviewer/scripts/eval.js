#!/usr/bin/env node
const puppeteer = require('puppeteer-core');

async function evaluate() {
  const expression = process.argv[2];

  if (!expression) {
    console.log('Usage: node eval.js "<JavaScript expression>"');
    console.log('Example: node eval.js "document.title"');
    process.exit(1);
  }

  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222'
  });

  const pages = await browser.pages();
  const page = pages[0];

  const result = await page.evaluate((expr) => {
    return eval(expr);
  }, expression);

  console.log(JSON.stringify(result, null, 2));

  await browser.disconnect();
}

evaluate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
