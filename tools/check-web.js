// Prueba de la web en navegadores reales. Uso: ver tools/LEEME.md
const pw = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'out');
const PUBLICADA = 'https://ocbsmith.github.io/Instrucci-n-interna-propuesta-rectorado/';
const url = f => pathToFileURL(path.join(ROOT, f)).href;
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find(p => fs.existsSync(p));

const fallos = [];
const avisos = [];
const ok = (cond, msg) => { console.log(`${cond ? '  ✔' : '  ✘'} ${msg}`); if (!cond) fallos.push(msg); };
const aviso = msg => { console.log(`  ⚠ ${msg}`); avisos.push(msg); };

let MOVIL_REAL = true;
async function abrir(browser, file, width) {
  const opts = { viewport: { width, height: 900 } };
  if (width < 600 && MOVIL_REAL) Object.assign(opts, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await (await browser.newContext(opts)).newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(url(file), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.waitForTimeout(300);
  return { p, errs };
}

async function pruebaIndex(browser, w) {
  const { p, errs } = await abrir(browser, 'index.html', w);
  ok(errs.length === 0, `sin errores de consola${errs.length ? ': ' + errs.join(' | ') : ''}`);
  if (w < 600 && MOVIL_REAL) ok(await p.evaluate(() => document.documentElement.clientWidth) === w, `en móvil real la página se maqueta a ${w}px (viewport declarado)`);
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

  await p.click('#articulos .filter-chip[data-cat="alerta"]');
  const vis = await p.$$eval('#artGrid .art-card', cs => cs.filter(x => x.offsetParent !== null).map(x => x.dataset.status));
  ok(vis.length === c.real.alerta && vis.every(s => s === 'alerta'), `filtro "Alertas" muestra solo las ${c.real.alerta} fichas en alerta`);
  await p.click('#articulos .filter-chip[data-cat="all"]');

  const cortadas = await p.$$eval('#artGrid .art-card .pill', els => els.filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent.trim()));
  ok(cortadas.length === 0, `ninguna etiqueta cortada${cortadas.length ? ': ' + cortadas.join(', ') : ''}`);

  const fantasmas = await p.$$eval('#artGrid .art-card-more', bs => bs.filter(b => (b.hidden || !b.textContent.trim()) && b.getBoundingClientRect().height > 0).length);
  ok(fantasmas === 0, `ningún botón "Ver más" vacío u oculto visible${fantasmas ? ' (' + fantasmas + ')' : ''}`);
  const largas = await p.$$eval('#artGrid .art-card-body', bs => bs.filter(b => b.offsetParent && !b.classList.contains('is-collapsed') && b.dataset.abierta !== '1' && b.scrollHeight > 420).length);
  ok(largas === 0, 'todas las fichas largas están plegadas');

  const plegada = await p.$('#artGrid .art-card:has(.art-card-body.is-collapsed)');
  if (plegada) {
    const btn = await plegada.$('.art-card-more');
    await btn.click();
    const st = await plegada.evaluate(x => ({ col: x.querySelector('.art-card-body').classList.contains('is-collapsed'), modal: document.getElementById('artModal').open }));
    ok(!st.col && !st.modal, '"Ver más" despliega sin abrir el modal');
    await btn.click();
    ok(await plegada.evaluate(x => x.querySelector('.art-card-body').classList.contains('is-collapsed')), '"Ver menos" vuelve a plegar');
  }

  const primera = p.locator('#artGrid .art-card').first();
  await primera.focus();
  await p.keyboard.press('Enter');
  ok(await p.evaluate(() => document.getElementById('artModal').open && document.getElementById('artModalBody').textContent.trim().length > 20), 'Intro sobre una ficha abre el modal con texto');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(100);
  ok(await p.evaluate(() => !document.getElementById('artModal').open), 'Escape cierra el modal');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.classList.contains('art-card')), 'al cerrar, el foco vuelve a la ficha');

  const sinTexto = await p.evaluate(() => {
    const out = [];
    for (const card of document.querySelectorAll('#artGrid .art-card')) {
      card.click();
      const t = document.getElementById('artModalBody').textContent.trim();
      if (t.length < 40) out.push(card.querySelector('.art-card-ref').textContent);
      document.getElementById('artModal').close();
    }
    return out;
  });
  ok(sinTexto.length === 0, `las 39 fichas abren el modal con texto${sinTexto.length ? ': faltan ' + sinTexto.join(', ') : ''}`);

  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(400);
  const top = p.locator('#btnTop');
  ok(await top.isVisible(), 'botón "↑" visible al bajar');
  await top.click();
  await p.waitForFunction(() => window.scrollY < 50, null, { timeout: 4000 }).then(() => ok(true, 'botón "↑" vuelve arriba'), () => ok(false, 'botón "↑" vuelve arriba'));
  await p.context().close();
}

async function pruebaEnmiendas(browser, w) {
  const { p, errs } = await abrir(browser, 'enmiendas-ugt.html', w);
  ok(errs.length === 0, 'sin errores de consola');
  if (w < 600 && MOVIL_REAL) ok(await p.evaluate(() => document.documentElement.clientWidth) === w, `en móvil real la página se maqueta a ${w}px (viewport declarado)`);
  ok(await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, 'sin scroll horizontal');
  ok(await p.$$eval('.ugt-row', r => r.length) > 0, 'hay propuestas UGT');
  await p.context().close();
}

async function pruebaImpresion(browser) {
  const { p, errs } = await abrir(browser, 'index.html', 1280);
  await p.evaluate(() => { window.__printCalls = 0; window.print = () => { window.__printCalls++; }; });
  await p.evaluate(() => imprimirPDF());
  await p.waitForTimeout(700);
  ok(await p.evaluate(() => window.__printCalls) === 1 && errs.length === 0, 'el botón "Descargar PDF" lanza la impresión sin errores');

  await p.emulateMedia({ media: 'print' });
  const st = await p.evaluate(() => ({
    plegadas: [...document.querySelectorAll('.art-card-body.is-collapsed')].filter(b => getComputedStyle(b).maxHeight !== 'none').length,
    botones: [...document.querySelectorAll('.art-card-more')].filter(b => getComputedStyle(b).display !== 'none').length,
  }));
  ok(st.plegadas === 0, 'al imprimir, las fichas plegadas salen completas');
  ok(st.botones === 0, 'al imprimir, no aparecen los botones "Ver más"');
  fs.mkdirSync(OUT, { recursive: true });
  const pdf = path.join(OUT, 'analisis.pdf');
  await p.pdf({ path: pdf, format: 'A4', printBackground: true });
  const paginas = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  ok(paginas > 1, `PDF generado (${paginas} páginas) → tools/out/analisis.pdf`);
  await p.context().close();
}

async function pruebaAccesibilidad(browser) {
  const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  for (const file of ['index.html', 'enmiendas-ugt.html']) {
    const { p } = await abrir(browser, file, 1280);
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations
      .map(v => ({ id: v.id, impacto: v.impact, n: v.nodes.length, ayuda: v.help, ej: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })));
    const graves = r.filter(v => v.impacto === 'critical' || v.impacto === 'serious');
    ok(graves.length === 0, `${file}: sin problemas de accesibilidad graves o críticos`);
    for (const v of r) console.log(`      [${v.impacto}] ${v.id} ×${v.n}: ${v.ayuda} — ej.: ${v.ej.join(' | ')}`);
    await p.context().close();
  }
}

async function pruebaPublicada() {
  console.log(`\nWeb publicada — ${PUBLICADA}`);
  const norm = s => s.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  for (const f of ['index.html', 'enmiendas-ugt.html', 'main.css', 'art_texts.js']) {
    try {
      const res = await fetch(PUBLICADA + f + '?nocache=' + Date.now());
      const remoto = norm(await res.text());
      ok(res.ok && remoto === norm(fs.readFileSync(path.join(ROOT, f), 'utf8')), `${f} publicado coincide con la copia local`);
    } catch (e) { ok(false, `${f}: no se pudo descargar (${e.message})`); }
  }
}

(async () => {
  const motores = [];
  if (CHROME) motores.push(['Chrome', () => pw.chromium.launch({ executablePath: CHROME })]);
  else aviso('No se encuentra Chrome (define CHROME_PATH)');
  motores.push(['Firefox', () => pw.firefox.launch()], ['WebKit (Safari)', () => pw.webkit.launch()]);

  let chrome = null;
  for (const [nombre, lanzar] of motores) {
    let b;
    MOVIL_REAL = nombre !== 'Firefox';
    try { b = await lanzar(); } catch (e) { aviso(`${nombre} no disponible: ejecuta "npx playwright-core install firefox webkit"`); continue; }
    for (const w of [1280, 375]) { console.log(`\n${nombre} · index.html · ${w}px`); await pruebaIndex(b, w); }
    for (const w of [1280, 375]) { console.log(`\n${nombre} · enmiendas-ugt.html · ${w}px`); await pruebaEnmiendas(b, w); }
    if (nombre === 'Chrome') chrome = b; else await b.close();
  }
  MOVIL_REAL = true;
  if (chrome) {
    console.log('\nChrome · impresión'); await pruebaImpresion(chrome);
    console.log('\nChrome · accesibilidad (axe-core)'); await pruebaAccesibilidad(chrome);
    await chrome.close();
  }
  if (process.argv.includes('--publicada')) await pruebaPublicada();

  console.log(fallos.length ? `\n✘ ${fallos.length} comprobaciones fallidas` : `\n✔ Todo correcto${avisos.length ? ` (${avisos.length} avisos)` : ''}`);
  process.exit(fallos.length ? 1 : 0);
})().catch(e => { console.error('FALLO:', e.message); process.exit(1); });
