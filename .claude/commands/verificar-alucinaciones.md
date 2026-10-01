---
description: Audita los textos de las fichas en art_texts.js y los párrafos de análisis en index.html contra las fuentes primarias para detectar imprecisiones o afirmaciones no verificadas
---

Lee `docs/constitution.md` y `MEMORY.md` antes de actuar.

Artículos o sección a verificar: $ARGUMENTS (si está vacío, verificar todos)

Tu trabajo:
1. Para cada ficha indicada, localiza el texto en `art_texts.js` y los párrafos `<p>` de análisis en `index.html`.
2. Contrasta cada afirmación factual contra `propuesta_ocr.txt` (texto 2026).
3. Contrasta cada referencia al texto de 2017 contra `20170206_TEXTO_REFUNDIDO_INSTRUCCION_INTERNA_antigua.pdf`.
4. Lista en formato tabla:
   - Ficha / artículo
   - Afirmación en la web
   - Texto real en la fuente
   - Estado: ✅ correcto | ⚠ inexacto | ❌ incorrecto
5. Para los inexactos o incorrectos, propón la corrección exacta.

No modifiques ningún archivo todavía: presenta el informe y espera aprobación.
