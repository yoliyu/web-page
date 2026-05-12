import { chromium } from '/Users/yolandasabuco/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvPath = `file://${path.join(__dirname, 'cv.html')}`;
const outPath = '/Users/yolandasabuco/Desktop/CV-Yolanda-Sabuco-Garcia.pdf';

// A4 width = 210mm = ~794px at 96dpi
const PAGE_WIDTH_PX = 794;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: PAGE_WIDTH_PX, height: 10 } });

await page.goto(cvPath, { waitUntil: 'networkidle' });

// Inject print-like styles directly (screen media used for PDF so @page doesn't paginate)
await page.addStyleTag({ content: `
  html { font-size: 13px !important; }
  body { background: white !important; }
  .cv-bg { padding: 0 !important; min-height: 0 !important; background: white !important; }
  .nav, .footer, .back-to-top, .cv-print-btn { display: none !important; }
  .cv-doc { box-shadow: none !important; max-width: 100% !important; }
  a { color: inherit !important; text-decoration: none !important; }
` });
await page.waitForTimeout(300);

// Measure natural column heights with grid stretching disabled
const { mainH, sbH, headerH } = await page.evaluate(async () => {
  const cols = document.querySelector('.cv-cols');
  cols.style.alignItems = 'start';
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const result = {
    mainH:   Math.ceil(document.querySelector('.cv-main').getBoundingClientRect().height),
    sbH:     Math.ceil(document.querySelector('.cv-sb').getBoundingClientRect().height),
    headerH: Math.ceil(document.querySelector('.cvh').getBoundingClientRect().height),
  };
  cols.style.alignItems = '';
  return result;
});

const contentHeight = headerH + Math.max(mainH, sbH);
console.log(`header:${headerH} main:${mainH} sb:${sbH} → total:${contentHeight}px (~${(contentHeight/96*25.4).toFixed(0)}mm)`);

// Use screen media so @page CSS rule doesn't create multiple pages
await page.emulateMedia({ media: 'screen' });

await page.pdf({
  path: outPath,
  width: `${PAGE_WIDTH_PX}px`,
  height: `${contentHeight + 24}px`,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
console.log('PDF saved:', outPath);
