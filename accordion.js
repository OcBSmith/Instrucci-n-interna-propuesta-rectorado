// ── NAVEGACIÓN A TEXTOS LEGALES ──
// Cambiar NEG_STATUS aquí no es responsabilidad de este módulo — ver features.js

window.showLegalArticle = function (artNum) {
  const items  = document.querySelectorAll('#textos-completos .acord-item');
  let   target = null;

  for (const item of items) {
    const artsText = item.querySelector('.acord-arts')?.textContent  || '';
    const titleText = item.querySelector('.acord-title')?.textContent || '';
    const tl = titleText.toLowerCase();
    const al = artsText.toLowerCase();

    // Especiales por texto descriptivo (sin solapamiento entre DA3 y Art.37)
    if (artNum === 37 && (tl.includes('sábado') || al.includes('sábado')))                          { target = item; break; }
    if (artNum === 33 && (al.includes('da1') || al.includes('da primera') || tl.includes('da1')))   { target = item; break; }
    if (artNum === 34 && (al.includes('da2') || al.includes('da segunda') || tl.includes('da2')))   { target = item; break; }
    if (artNum === 35 && (al.includes('da3') || al.includes('da tercera') || tl.includes('da tercera'))) { target = item; break; }
    if (artNum === 36 && (al.includes('da4') || al.includes('da cuarta')  || tl.includes('da cuarta')))  { target = item; break; }
    if (artNum === 38 && (al.includes('civi') || tl.includes('civi')))                              { target = item; break; }
    if (artNum === 39 && (al.includes('dt') || al.includes('capítulo vi') || tl.includes('plan de integración'))) { target = item; break; }

    // General: lado derecho de la flecha
    const arrowIdx = artsText.indexOf('→');
    const rhs      = arrowIdx >= 0 ? artsText.slice(arrowIdx) : artsText;
    const regex    = new RegExp('Art\\.?\\s*' + artNum + '\\b', 'i');
    if (regex.test(rhs) || regex.test(titleText)) { target = item; break; }
  }

  // Fallback DA3/DA4: buscar en el cuerpo del acordeón combinado
  if (!target && (artNum === 35 || artNum === 36)) {
    const kw = artNum === 35 ? 'da tercera' : 'da cuarta';
    for (const item of items) {
      if ((item.querySelector('.acord-body')?.textContent || '').toLowerCase().includes(kw)) {
        target = item; break;
      }
    }
  }

  if (target) {
    const head = target.querySelector('.acord-head');
    const body = target.querySelector('.acord-body');
    if (body) body.hidden = false;
    if (head) head.setAttribute('aria-expanded', 'true');

    // Scroll descontando el sticky nav
    const navEl  = document.getElementById('stickyNav');
    const navH   = navEl ? navEl.offsetHeight + 12 : 60;
    const rect   = target.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - navH, behavior: 'smooth' });

    target.classList.remove('pulse-target');
    void target.offsetWidth;
    target.classList.add('pulse-target');

    // A-1: deep link
    if (target.id) history.replaceState(null, '', '#' + target.id);
  } else {
    document.getElementById('textos-completos')?.scrollIntoView({ behavior: 'smooth' });
  }
};

// ── A-1: aplicar hash en carga ──
(function applyHashOnLoad() {
  const hash = location.hash;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (!el) return;
  if (el.classList.contains('acord-item')) {
    const body = el.querySelector('.acord-body');
    const head = el.querySelector('.acord-head');
    if (body) body.hidden = false;
    if (head) head.setAttribute('aria-expanded', 'true');
  }
  setTimeout(() => {
    const navEl = document.getElementById('stickyNav');
    const navH  = navEl ? navEl.offsetHeight + 12 : 60;
    const rect  = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - navH, behavior: 'smooth' });
  }, 200);
})();

// ── B-4: slider antes/después (se activa al abrir un acordeón por primera vez) ──
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#textos-completos .acord-item').forEach(item => {
    const head = item.querySelector('.acord-head');
    if (!head) return;
    head.addEventListener('click', function () {
      const body = item.querySelector('.acord-body');
      if (!body || body.hidden) return; // acaba de cerrarse
      const cols = body.querySelector('.acord-cols');
      if (!cols || cols.dataset.sliderInit) return;
      cols.dataset.sliderInit = '1';
      if (cols.children.length < 2) return;
      const ctrl = document.createElement('div');
      ctrl.className = 'acord-slider-controls';
      ctrl.innerHTML =
        '<button class="active" onclick="acordSliderShow(this,0,this.closest(\'.acord-body\'))">2017</button>' +
        '<button onclick="acordSliderShow(this,1,this.closest(\'.acord-body\'))">Propuesta 2026</button>';
      cols.appendChild(ctrl);
    });
  });
});

function acordSliderShow(btn, idx, body) {
  if (!body) return;
  const cols  = body.querySelector('.acord-cols');
  if (!cols) return;
  const panes = [...cols.children].filter(c => !c.classList.contains('acord-slider-controls'));
  panes.forEach((p, i) => { p.style.display = i === idx ? '' : 'none'; });
  [...btn.parentNode.children].forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
