/**
 * Tag, You're It poster — capture the ?demo=poster screen at 1080×1080.
 *
 * Run:
 *   npm run preview &
 *   node gen_poster.cjs
 */
const puppeteer = require(require.resolve('puppeteer', {
  paths: ['/Users/yin/code/games/mugshot-booth/node_modules'],
}));
const path = require('path');

const URL = process.env.TYI_PREVIEW_URL || 'http://localhost:4173/tag-youre-it/?demo=poster';
const OUT = path.resolve(__dirname, 'public/poster.png');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 120000,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1,
  });
  console.log('navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: OUT, omitBackground: false });
  console.log('saved', OUT);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
