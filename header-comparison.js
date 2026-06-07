import { chromium } from 'playwright';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const tag = `header_comparison_${timestamp}`;

async function compareHeaders() {
  const browser = await chromium.launch();

  const sites = [
    { name: 'reference', url: 'https://whole-interaction-310969.framer.app/' },
    { name: 'rebuild', url: 'https://sandy-zippy.github.io/riarh-group/' }
  ];

  try {
    for (const site of sites) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 120 } });
      console.log(`Capturing ${site.name} header (top of page)...`);
      
      try {
        if (site.name === 'reference') {
          await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(3500);
        } else {
          await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
        }
        
        // Header at top
        const headerFilename = `/tmp/${tag}_${site.name}_header_top.png`;
        await page.screenshot({ path: headerFilename });
        console.log(`✓ ${headerFilename}`);
        
        // Scroll slightly to see scrolled state
        await page.evaluate(() => window.scrollBy(0, 100));
        await page.waitForTimeout(300);
        const headerScrolledFilename = `/tmp/${tag}_${site.name}_header_scrolled.png`;
        await page.screenshot({ path: headerScrolledFilename });
        console.log(`✓ ${headerScrolledFilename}`);
        
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
      
      await page.close();
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\nHeader comparisons saved with tag: ${tag}`);
}

compareHeaders().catch(console.error);
