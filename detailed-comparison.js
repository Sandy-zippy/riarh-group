import { chromium } from 'playwright';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const tag = `detailed_comparison_${timestamp}`;

async function compareRegions() {
  const browser = await chromium.launch();

  const sites = [
    { name: 'reference', url: 'https://whole-interaction-310969.framer.app/' },
    { name: 'rebuild', url: 'https://sandy-zippy.github.io/riarh-group/' }
  ];

  try {
    for (const site of sites) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      console.log(`Capturing ${site.name} sections...`);
      
      try {
        if (site.name === 'reference') {
          await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(3500);
        } else {
          await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 });
        }
        
        // Hero section (top viewport)
        const heroFilename = `/tmp/${tag}_${site.name}_hero.png`;
        await page.screenshot({ path: heroFilename });
        console.log(`✓ ${heroFilename}`);
        
        // Scroll to featured projects
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
        await page.waitForTimeout(500);
        const featuredFilename = `/tmp/${tag}_${site.name}_featured.png`;
        await page.screenshot({ path: featuredFilename });
        console.log(`✓ ${featuredFilename}`);
        
        // Scroll to portfolio
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 3));
        await page.waitForTimeout(500);
        const portfolioFilename = `/tmp/${tag}_${site.name}_portfolio.png`;
        await page.screenshot({ path: portfolioFilename });
        console.log(`✓ ${portfolioFilename}`);
        
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
      
      await page.close();
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\nComparison screenshots saved with tag: ${tag}`);
}

compareRegions().catch(console.error);
