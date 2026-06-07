const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
];

const BASE_URL = 'http://localhost:5173/riarh-group/#/services';
const SCREENSHOT_DIR = '/tmp/services_sweep_screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runBugSweep() {
  let browser;
  const results = {
    viewports: {},
    programmaticIssues: {},
  };

  try {
    browser = await chromium.launch({ headless: true });

    for (const viewport of VIEWPORTS) {
      console.log(`\n========== Inspecting ${viewport.name} (${viewport.width}x${viewport.height}) ==========`);
      
      const context = await browser.createContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      // Capture console messages and errors
      const consoleLogs = [];
      page.on('console', (msg) => {
        if (msg.type() !== 'log') { // Skip debug logs
          consoleLogs.push({
            type: msg.type(),
            text: msg.text(),
          });
        }
      });

      // Navigate to Services page
      console.log(`Navigating to ${BASE_URL}...`);
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => {
        console.log('Navigation warning (may have timed out on network idle):', e.message);
      });

      // Wait for page to settle
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      await new Promise((r) => setTimeout(r, 1500));

      // Full page scroll and screenshot in sections
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const clientHeight = viewport.height;
      const numScreens = Math.ceil(scrollHeight / clientHeight);

      console.log(`  Page scroll height: ${scrollHeight}px, client height: ${clientHeight}px, screens: ${numScreens}`);

      for (let i = 0; i < numScreens; i++) {
        const scrollPosition = i * clientHeight;
        await page.evaluate((y) => window.scrollTo(0, y), scrollPosition);
        await new Promise((r) => setTimeout(r, 400)); // Wait for scroll/animations

        const screenshotPath = path.join(
          SCREENSHOT_DIR,
          `${viewport.name}_screen_${i + 1}.png`
        );
        await page.screenshot({ path: screenshotPath });
        console.log(`  Screenshot ${i + 1}/${numScreens}: ${screenshotPath}`);
      }

      // Programmatic checks
      const programmaticData = await page.evaluate(() => {
        const issues = [];

        // Check horizontal overflow
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        if (scrollWidth > clientWidth + 1) {
          issues.push({
            type: 'HORIZONTAL_OVERFLOW',
            detail: `scrollWidth=${scrollWidth}px > clientWidth=${clientWidth}px (overflow=${scrollWidth - clientWidth}px)`,
          });
        }

        // Check broken images
        const images = Array.from(document.querySelectorAll('img'));
        const brokenImages = images.filter((img) => {
          return img.naturalWidth === 0 || img.naturalHeight === 0;
        });
        if (brokenImages.length > 0) {
          issues.push({
            type: 'BROKEN_IMAGES',
            count: brokenImages.length,
            images: brokenImages.slice(0, 5).map((img) => ({
              src: img.src || 'no-src',
              alt: img.alt || 'no-alt',
            })),
          });
        }

        // Check for small tap targets on mobile
        if (window.innerWidth <= 480) {
          const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'));
          const smallTargets = buttons.filter((btn) => {
            const rect = btn.getBoundingClientRect();
            const minSize = 40;
            return (rect.width < minSize || rect.height < minSize) && rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight;
          });
          if (smallTargets.length > 0) {
            issues.push({
              type: 'SMALL_TAP_TARGETS',
              count: smallTargets.length,
              targets: smallTargets.slice(0, 5).map((t) => ({
                tag: t.tagName,
                text: (t.textContent || '').slice(0, 30),
                width: Math.round(t.getBoundingClientRect().width),
                height: Math.round(t.getBoundingClientRect().height),
              })),
            });
          }
        }

        return issues;
      });

      results.programmaticIssues[viewport.name] = {
        consoleErrors: consoleLogs,
        programmaticIssues: programmaticData,
      };

      await context.close();
    }

    console.log('\n========== Bug Sweep Complete ==========');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log('\nProgrammatic Issues Summary:');
    console.log(JSON.stringify(results.programmaticIssues, null, 2));

    // Save results to file for reference
    fs.writeFileSync('/tmp/bug_sweep_results.json', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error during bug sweep:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runBugSweep();
