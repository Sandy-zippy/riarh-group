import { chromium } from 'playwright';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const tag = `design_parity_${timestamp}`;

async function captureScreenshots() {
  const browser = await chromium.launch();

  const sites = [
    { name: 'reference', url: 'https://whole-interaction-310969.framer.app/' },
    { name: 'rebuild', url: 'https://sandy-zippy.github.io/riarh-group/' }
  ];

  const viewports = [
    { width: 1440, height: 900, label: 'desktop' },
    { width: 390, height: 844, label: 'mobile' }
  ];

  try {
    for (const site of sites) {
      for (const viewport of viewports) {
        const page = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
        });
        
        console.log(`Capturing ${site.name} (${viewport.label})...`);
        
        try {
          // Reference site: use domcontentloaded, then wait
          if (site.name === 'reference') {
            await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForTimeout(3500);
          } else {
            // Rebuild: full network idle
            await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
          }
          
          // Full page screenshot
          const filename = `/tmp/${tag}_${site.name}_${viewport.label}_fullpage.png`;
          await page.screenshot({ path: filename, fullPage: true });
          console.log(`✓ ${filename}`);
          
          // Scroll to middle
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await page.waitForTimeout(500);
          const scrollFilename = `/tmp/${tag}_${site.name}_${viewport.label}_scroll1.png`;
          await page.screenshot({ path: scrollFilename });
          console.log(`✓ ${scrollFilename}`);
          
          // Scroll to bottom
          await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
          await page.waitForTimeout(500);
          const scrollFilename2 = `/tmp/${tag}_${site.name}_${viewport.label}_scroll2.png`;
          await page.screenshot({ path: scrollFilename2 });
          console.log(`✓ ${scrollFilename2}`);
          
        } catch (e) {
          console.error(`Error loading ${site.name}: ${e.message}`);
        }
        
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\nAll screenshots captured with tag: ${tag}`);
  console.log(`Screenshots saved to /tmp/${tag}_*.png`);
}

captureScreenshots().catch(console.error);
