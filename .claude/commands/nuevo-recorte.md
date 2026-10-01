---
description: Documenta un recorte de derechos nuevo en la ficha correspondiente de index.html y actualiza MEMORY.md
---

Lee `docs/constitution.md` y `MEMORY.md` antes de actuar.

Recorte a documentar: $ARGUMENTS

Tu trabajo:
1. Verifica que el recorte tiene cita textual en `propuesta_ocr.txt` (2026) y en el PDF 2017. Si no, para y avísame.
2. Localiza la `art-card` correspondiente en `index.html`.
3. Redacta en voz impersonal un párrafo de `⚠ Recorte:` siguiendo el estilo de los ya existentes en la ficha.
4. Añade ese párrafo al modal de `art_texts.js` si el artículo tiene texto de modal.
5. Asegúrate de que el `data-status` de la ficha sea `alerta` si no lo era ya.
6. Actualiza la tabla de recortes en `MEMORY.md`.
7. Muéstrame el diff antes de confirmar los cambios.

Después del cambio: actualiza `MEMORY.md` (sección "Estado actual" y tabla de recortes).
