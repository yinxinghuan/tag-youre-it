/**
 * Capture screenshots of all demo screens for Tag, You're It QA.
 *
 * Run:
 *   npm run preview &
 *   ( cd ../mugshot-booth && node ../tag-youre-it/qa_capture.cjs )
 */
const puppeteer = require(require.resolve('puppeteer', {
  paths: ['/Users/yin/code/games/mugshot-booth/node_modules'],
}));
const path = require('path');
const fs = require('fs');

const BASE = process.env.TYI_PREVIEW_URL || 'http://localhost:4173/tag-youre-it/';
const OUT_DIR = path.resolve(__dirname, '_qa');

const SCREENS = [
  { name: 'lobby', demo: 'lobby' },
  { name: 'lobby-it', demo: 'lobby-it' },
  { name: 'picker', demo: 'picker' },
  { name: 'move', demo: 'move' },
  { name: 'slam', demo: 'slam' },
  { name: 'reveal', demo: 'reveal' },
  { name: 'wall', demo: 'wall' },
];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 120000,
  });
  for (const s of SCREENS) {
    const page = await browser.newPage();
    page.on('console', (msg) => console.log('[console]', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('[pageerror]', err.message));
    await page.setViewport({ width: 380, height: 760, deviceScaleFactor: 2 });
    const url = `${BASE}?demo=${s.demo}`;
    console.log('→', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    // Allow css animations & dom mutations to settle. Slam needs longer
    // to reach the "cooking" phase (~2s in).
    const settle = s.demo === 'slam' ? 2800 : 1400;
    await new Promise((r) => setTimeout(r, settle));
    const file = path.join(OUT_DIR, `${s.name}.png`);
    await page.screenshot({ path: file, omitBackground: false });
    console.log('   saved', file);
    await page.close();
  }
  await browser.close();
  console.log('done. screenshots in', OUT_DIR);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
