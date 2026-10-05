const pw = require('playwright-core'); const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
(async () => {
  const b = await pw.chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const f of ['index.html', 'enmiendas-ugt.html']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto(pathToFileURL(path.join(__dirname, '..', f)).href); await p.evaluate(() => document.fonts.ready);
    await p.addScriptTag({ content: fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') });
    const r = await p.evaluate(async () => { const v = (await axe.run(document, { runOnly: ['color-contrast'] })).violations[0]; if (!v) return [];
      const m = {}; for (const n of v.nodes) { const d = n.any[0].data; const k = `${d.fgColor} sobre ${d.bgColor} (${d.contrastRatio}:1, mín ${d.expectedContrastRatio}) ${d.fontSize}`; (m[k] = m[k] || []).push(n.target.join(' ')); }
      return Object.entries(m).map(([k, t]) => `${k} ×${t.length}: ${[...new Set(t.map(s => s.replace(/:nth-child\(\d+\)/g, '')))].slice(0, 4).join(' | ')}`); });
    console.log('== ' + f); r.forEach(x => console.log('  ' + x));
    await p.close();
  }
  await b.close();
})();
