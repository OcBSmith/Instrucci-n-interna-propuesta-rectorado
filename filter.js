(function () {
  'use strict';

  const searchInput = document.getElementById('artFilterInput');
  const clearBtn    = document.getElementById('artFilterClear');
  const filterChips = document.querySelectorAll('.filter-chip');
  const countInfo   = document.getElementById('filterResultCount');
  const tableBody   = document.getElementById('navTableBody');
  const noResults   = document.getElementById('noResultsBox');
  const tableEl     = document.getElementById('navTable');

  let currentFilter = 'all';
  let searchQuery   = '';

  function filterTable() {
    if (!tableBody) return;
    const rows        = tableBody.querySelectorAll('tr[data-status]');
    const sectionRows = tableBody.querySelectorAll('.map-section-row');
    let visibleCount  = 0;

    const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    rows.forEach(row => {
      const status       = row.getAttribute('data-status');
      const searchText   = (row.getAttribute('data-search') || '') + ' ' + (row.textContent || '');
      const normText     = searchText.toLowerCase();
      const matchesCat   = currentFilter === 'all' || status === currentFilter;
      const matchesQuery = terms.length === 0 || terms.every(t => normText.includes(t));

      if (matchesCat && matchesQuery) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    sectionRows.forEach(secRow => {
      let next = secRow.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('map-section-row')) {
        if (next.style.display !== 'none') { hasVisible = true; break; }
        next = next.nextElementSibling;
      }
      secRow.style.display = hasVisible ? '' : 'none';
    });

    if (countInfo) countInfo.textContent = `Mostrando ${visibleCount} de ${rows.length} materias`;
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    if (tableEl)   tableEl.style.display   = visibleCount === 0 ? 'none'  : '';
  }

  // ── B-2: resaltado de términos de búsqueda ──
  function applySearchHighlights(query) {
    document.querySelectorAll('.practica-text, .card-title, .compare-text').forEach(el => {
      el.querySelectorAll('mark.search-hl').forEach(m => {
        const p = m.parentNode;
        p.replaceChild(document.createTextNode(m.textContent), m);
        p.normalize();
      });
    });
    if (!query || query.trim().length < 2) return;
    const terms = query.trim().split(/\s+/).filter(t => t.length >= 2);
    if (!terms.length) return;
    const esc   = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + terms.map(esc).join('|') + ')', 'gi');

    document.querySelectorAll('.practica-text, .card-title, .compare-text').forEach(root => {
      const tw    = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let n;
      while ((n = tw.nextNode())) nodes.push(n);
      nodes.forEach(node => {
        if (!node.nodeValue.trim()) return;
        if (node.parentNode && node.parentNode.nodeName === 'MARK') return;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        regex.lastIndex = 0;
        while ((m = regex.exec(node.nodeValue)) !== null) {
          frag.appendChild(document.createTextNode(node.nodeValue.slice(last, m.index)));
          const mark = document.createElement('mark');
          mark.className = 'search-hl';
          mark.textContent = m[1];
          frag.appendChild(mark);
          last = m.index + m[1].length;
        }
        if (last > 0) {
          frag.appendChild(document.createTextNode(node.nodeValue.slice(last)));
          node.parentNode.replaceChild(frag, node);
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = this.value;
      if (clearBtn) clearBtn.style.display = searchQuery ? 'inline-flex' : 'none';
      filterTable();
      applySearchHighlights(searchQuery);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (searchInput) { searchInput.value = ''; searchQuery = ''; searchInput.focus(); }
      clearBtn.style.display = 'none';
      filterTable();
      applySearchHighlights('');
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', function () {
      filterChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      filterTable();
    });
  });

})();
