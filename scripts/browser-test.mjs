import { chromium } from 'playwright';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from './serve.mjs';
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.route(/https?:\/\/(?!127\.0\.0\.1)/, route => route.abort());
const results = [];
try {
  const pages = process.env.SMOKE_ONLY ? ['index.html', 'chart-chartjs.html', 'apps-calendar.html', 'ui-modals.html', 'ui-tabs.html', 'tables-datatable.html', 'form-advanced.html'] : (await readdir('HTML')).filter(file => file.endsWith('.html'));
  for (const file of pages) {
    if (file === 'map-google.html') {
      results.push({ file, skipped: 'Requires external Google Maps API; external requests are disabled in this offline suite.', errors: [] });
      console.log('SKIP map-google.html (external Google Maps API)');
      continue;
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack || error.message));
    await page.goto(`${base}/${file}`, { waitUntil: 'load' });
    await page.waitForTimeout(200);
    const versions = await page.evaluate(() => ({ jquery: window.jQuery?.fn.jquery, bootstrap: window.bootstrap?.Modal.VERSION }));
    if (file === 'chart-chartjs.html') {
      const charts = await page.evaluate(() => Object.values(Chart.instances).length);
      if (charts !== 7) errors.push(`Expected 7 charts, got ${charts}`);
    }
    if (file === 'apps-calendar.html') {
      const events = await page.evaluate(() => document.getElementById('calendar').uboldCalendar?.getEvents().length);
      if (events !== 3) errors.push(`Expected 3 calendar events, got ${events}`);
    }
    if (file === 'index.html') {
      await page.locator('.open-left').click();
      if (!await page.locator('#wrapper').evaluate(el => el.classList.contains('forced'))) errors.push('Sidebar toggle failed');
    }
    if (['index.html', 'chart-chartjs.html', 'apps-calendar.html'].includes(file)) {
      await mkdir('test-results', { recursive: true });
      await page.screenshot({ path: `test-results/${file}.png`, fullPage: true });
    }
    results.push({ file, versions, errors });
    console.log(`${errors.length ? 'FAIL' : 'PASS'} ${file}${errors.length ? ': ' + errors.join(' | ') : ''}`);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
await mkdir('test-results', { recursive: true });
await writeFile('test-results/browser-results.json', JSON.stringify(results, null, 2));
if (results.some(result => result.errors.length)) process.exitCode = 1;
