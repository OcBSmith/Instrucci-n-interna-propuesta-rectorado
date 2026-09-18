(function () {
  'use strict';

  // ── BOTÓN VOLVER ARRIBA ──
  const btnTop = document.getElementById('btnTop');
  if (btnTop) {
    window.addEventListener('scroll', function () {
      btnTop.classList.toggle('visible', window.scrollY > 420);
    });
    btnTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── SCROLLSPY ──
  const navLinks       = document.querySelectorAll('.sticky-nav .nav-link');
  const trackedSections = document.querySelectorAll('main section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';
    trackedSections.forEach(sec => {
      const top = sec.offsetTop;
      if (scrollPos >= top && scrollPos < top + sec.offsetHeight) currentId = sec.id;
    });
    if (currentId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
      });
    }
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ── B-3: BARRA DE PROGRESO + PUNTOS DE LECTURA ──
  const readBar  = document.getElementById('readingBar');
  const readDots = {};

  navLinks.forEach(link => {
    const dot = document.createElement('span');
    dot.className = 'nav-read-dot';
    link.appendChild(dot);
    const id = (link.getAttribute('href') || '').replace('#', '');
    if (id) readDots[id] = dot;
  });

  let readSet;
  try { readSet = new Set(JSON.parse(localStorage.getItem('ugt-read-sections') || '[]')); }
  catch (e) { readSet = new Set(); }
  readSet.forEach(id => { if (readDots[id]) readDots[id].classList.add('read'); });

  const readObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      readSet.add(id);
      if (readDots[id]) readDots[id].classList.add('read');
      try { localStorage.setItem('ugt-read-sections', JSON.stringify([...readSet])); } catch (e) {}
    });
  }, { threshold: 0.2 });
  trackedSections.forEach(s => readObserver.observe(s));

  function updateProgress() {
    if (!readBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) readBar.style.width = Math.min(100, (window.scrollY / total) * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ── A-3: MODO ENFOQUE ──
  const focusBtn = document.getElementById('focusToggle');
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      document.body.classList.toggle('focus-mode');
      focusBtn.textContent = document.body.classList.contains('focus-mode') ? 'Enfoque ✓' : 'Enfoque';
    });
  }

  // ── A-2: NAVEGACIÓN TECLADO EN TABLA ──
  const navTableBody = document.getElementById('navTableBody');
  if (navTableBody) {
    navTableBody.querySelectorAll('tr[data-status]').forEach(row => row.setAttribute('tabindex', '0'));
    const focusableRows = () => [
      ...navTableBody.querySelectorAll('tr[data-status]:not([style*="display: none"])')
    ];
    navTableBody.addEventListener('keydown', function (e) {
      const rows = focusableRows();
      const idx  = rows.indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === 'ArrowDown' && idx < rows.length - 1) { e.preventDefault(); rows[idx + 1].focus(); }
      else if (e.key === 'ArrowUp' && idx > 0)            { e.preventDefault(); rows[idx - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') {
        const btn = rows[idx].querySelector('.map-btn-link');
        if (btn) { e.preventDefault(); btn.click(); }
      } else if (e.key === 'Escape') { rows[idx].blur(); }
    });
  }

  // ── D-1: BOTÓN COPIAR CITA ──
  document.querySelectorAll('.card').forEach(card => {
    const titleEl = card.querySelector('.card-title');
    const artEl   = card.querySelector('.card-articles');
    if (!titleEl) return;
    const btn = document.createElement('button');
    btn.className = 'copy-quote-btn';
    btn.title     = 'Copiar cita para compartir';
    btn.innerHTML = '⎘ Copiar cita';
    btn.addEventListener('click', () => {
      const quote = titleEl.textContent.trim();
      const arts  = artEl ? ' [' + artEl.textContent.trim() + ']' : '';
      const text  = 'UGT-UMA · Instrucción Interna 2026: «' + quote + '»' + arts;
      navigator.clipboard.writeText(text).then(onCopied, () => {
        // fallback execCommand
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); onCopied(); } catch (x) {}
        document.body.removeChild(ta);
      });
      function onCopied() {
        btn.textContent = '✔ Copiado'; btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = '⎘ Copiar cita'; btn.classList.remove('copied'); }, 2000);
      }
    });
    card.appendChild(btn);
  });

  // ── D-3: ESTADO DE NEGOCIACIÓN ──
  // Edita NEG_STATUS para actualizar el banner: 'open' | 'closed' | 'alert'
  const NEG_STATUS = 'open';
  const NEG_TEXT = {
    open:   { label: 'Negociación abierta',    detail: 'En curso en Mesa Sectorial — seguimiento activo por UGT UMA' },
    closed: { label: 'Acuerdo alcanzado',       detail: 'Texto firmado y pendiente de aprobación en Consejo de Gobierno' },
    alert:  { label: 'Negociación bloqueada',   detail: 'UGT ha suspendido la negociación por incumplimiento de condiciones mínimas' },
  };
  const negBanner = document.getElementById('negBanner');
  if (negBanner && NEG_TEXT[NEG_STATUS]) {
    const info = NEG_TEXT[NEG_STATUS];
    negBanner.innerHTML =
      '<span class="neg-badge status-' + NEG_STATUS + '">' +
        '<span class="neg-dot"></span>' +
        info.label + ' — <em style="font-style:normal;opacity:.75">' + info.detail + '</em>' +
      '</span>';
  }

  // ── D-4: FORMULARIO DE CONSULTA → mailto ──
  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name  = document.getElementById('cName').value.trim();
      const dept  = document.getElementById('cDept').value.trim();
      const topic = document.getElementById('cTopic').value;
      const msg   = document.getElementById('cMessage').value.trim();
      const subj  = encodeURIComponent('[UGT-UMA] Consulta Instrucción Interna' + (topic ? ': ' + topic : ''));
      const body  = encodeURIComponent(
        'Nombre: ' + name + (dept ? '\nDepartamento: ' + dept : '') +
        '\n\n' + msg + '\n\n---\nEnviado desde: Guía Instrucción Interna UGT UMA'
      );
      window.location.href = 'mailto:anroca77@gmail.com?subject=' + subj + '&body=' + body;
      document.getElementById('consultDialog').close();
    });
  }

})();
