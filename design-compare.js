const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const REFERENCE_URL = 'https://whole-interaction-310969.framer.app/';
const REBUILD_URL = 'https://sandy-zippy.github.io/riarh-group/#/';

async function captureFullPage(page, url, filename) {
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  
  // Wait for page to settle
  await page.waitForTimeout(3500);
  
  // Get full page height
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height: ${fullHeight}px`);
  
  // Set viewport to 1440 for desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Take full page screenshot
  const screenshotPath = `/tmp/${filename}`;
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  
  console.log(`Screenshot saved to ${screenshotPath}`);
  return screenshotPath;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Capture reference
    console.log('\n=== CAPTURING REFERENCE ===');
    await captureFullPage(page, REFERENCE_URL, 'riarh_reference_1440.png');
    
    // Capture rebuild
    console.log('\n=== CAPTURING REBUILD ===');
    await captureFullPage(page, REBUILD_URL, 'riarh_rebuild_1440.png');
    
    // Also capture mobile view
    console.log('\n=== CAPTURING MOBILE REFERENCE ===');
    await page.setViewportSize({ width: 390, height: 844 });
    await captureFullPage(page, REFERENCE_URL, 'riarh_reference_390.png');
    
    console.log('\n=== CAPTURING MOBILE REBUILD ===');
    await captureFullPage(page, REBUILD_URL, 'riarh_rebuild_390.png');
    
    console.log('\nDone!');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
