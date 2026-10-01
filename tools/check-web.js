// Prueba de la web en Chrome real. Uso: ver tools/LEEME.md
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const url = f => pathToFileURL(path.join(ROOT, f)).href;
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find(p => fs.existsSync(p));

const fallos = [];
const ok = (cond, msg) => { console.log(`${cond ? '  ✔' : '  ✘'} ${msg}`); if (!cond) fallos.push(msg); };

async function pagina(browser, file, width) {
  const p = await browser.newPage({ viewport: { width, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(url(file), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.waitForTimeout(300);
  return { p, errs };
}

(async () => {
  if (!CHROME) { console.error('No se encuentra Chrome. Define CHROME_PATH.'); process.exit(2); }
  const browser = await chromium.launch({ executablePath: CHROME });

  for (const w of [1280, 375]) {
    console.log(`\nindex.html — ${w}px`);
    const { p, errs } = await pagina(browser, 'index.html', w);
    ok(errs.length === 0, `sin errores de consola${errs.length ? ': ' + errs.join(' | ') : ''}`);
    ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'sin scroll horizontal');

    const c = await p.evaluate(() => {
      const cards = [...document.querySelectorAll('#artGrid .art-card')];
      const real = { all: cards.length };
      cards.forEach(x => { real[x.dataset.status] = (real[x.dataset.status] || 0) + 1; });
      const chips = {};
      document.querySelectorAll('#articulos .filter-chip').forEach(ch => {
        const s = ch.querySelector('.filter-chip-count'); if (ch.dataset.cat && s) chips[ch.dataset.cat] = +s.textContent;
      });
      return { real, chips };
    });
    ok(Object.keys(c.chips).length > 0 && Object.entries(c.chips).every(([k, v]) => (c.real[k] || 0) === v),
       `contadores = fichas reales ${JSON.stringify(c.chips)}`);

    const cortadas = await p.$$eval('#artGrid .art-card .pill', els => els.filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim()));
    ok(cortadas.length === 0, `ninguna etiqueta cortada${cortadas.length ? ': ' + cortadas.join(', ') : ''}`);

    const fantasmas = await p.$$eval('#artGrid .art-card-more', bs => bs.filter(b => (b.hidden || !b.textContent.trim()) && b.getBoundingClientRect().height > 0).length);
    ok(fantasmas === 0, `ningún botón "Ver más" vacío u oculto visible${fantasmas ? ' (' + fantasmas + ')' : ''}`);
    const fichasLargasSinPliegue = await p.$$eval('#artGrid .art-card-body', bs => bs.filter(b => b.offsetParent && !b.classList.contains('is-collapsed') && b.dataset.abierta !== '1' && b.scrollHeight > 420).length);
    ok(fichasLargasSinPliegue === 0, 'todas las fichas largas están plegadas');

    const plegada = await p.$('#artGrid .art-card:has(.art-card-body.is-collapsed)');
    if (plegada) {
      const btn = await plegada.$('.art-card-more');
      await btn.click();
      const st = await plegada.evaluate(c => ({ col: c.querySelector('.art-card-body').classList.contains('is-collapsed'), modal: document.getElementById('artModal').open }));
      ok(!st.col && !st.modal, '"Ver más" despliega sin abrir el modal');
      await btn.click();
      ok(await plegada.evaluate(c => c.querySelector('.art-card-body').classList.contains('is-collapsed')), '"Ver menos" vuelve a plegar');
    }

    const primera = p.locator('#artGrid .art-card').first();
    await primera.focus();
    await p.keyboard.press('Enter');
    const abierto = await p.evaluate(() => document.getElementById('artModal').open && document.getElementById('artModalBody').textContent.trim().length > 20);
    ok(abierto, 'Intro sobre una ficha abre el modal con texto');
    await p.keyboard.press('Escape');
    ok(await p.evaluate(() => document.activeElement && document.activeElement.classList.contains('art-card')), 'al cerrar, el foco vuelve a la ficha');
    await p.close();
  }

  for (const w of [1280, 375]) {
    console.log(`\nenmiendas-ugt.html — ${w}px`);
    const { p, errs } = await pagina(browser, 'enmiendas-ugt.html', w);
    ok(errs.length === 0, 'sin errores de consola');
    ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'sin scroll horizontal');
    ok(await p.$$eval('.ugt-row', r => r.length) > 0, 'hay propuestas UGT');
    await p.close();
  }

  await browser.close();
  console.log(fallos.length ? `\n✘ ${fallos.length} comprobaciones fallidas` : '\n✔ Todo correcto');
  process.exit(fallos.length ? 1 : 0);
})().catch(e => { console.error('FALLO:', e.message); process.exit(1); });
