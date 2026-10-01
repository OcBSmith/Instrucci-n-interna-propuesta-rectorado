---
description: Audita los textos de las fichas en art_texts.js y los párrafos de análisis en index.html contra las fuentes primarias para detectar imprecisiones o afirmaciones no verificadas
---

Lee `docs/constitution.md` y `MEMORY.md` antes de actuar.

Usa el subagente **verificador-fuentes** para auditar los textos de las fichas en `art_texts.js` y los párrafos de análisis en `index.html` contra las fuentes primarias.

Artículos o sección a verificar: $ARGUMENTS (si está vacío, verificar todos)

El informe debe incluir, en formato tabla:
- Ficha / artículo
- Afirmación en la web
- Texto real en la fuente
- Estado: ✅ correcto | ⚠ inexacto | ❌ incorrecto

Para los inexactos o incorrectos, propón la corrección exacta.

No modifiques ningún archivo todavía: presenta el informe y espera aprobación.
