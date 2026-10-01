# CLAUDE.md — Instrucción Interna UMA PTGAS

Herramienta de análisis comparativo: propuesta de Instrucción Interna 2026 del Rectorado UMA vs. texto refundido vigente de 2017. Destinada a la sección PTGAS de UGT en el proceso de negociación.

## Stack y estructura

- HTML + CSS + JavaScript puros. Sin frameworks, sin npm, sin build. Abre con doble clic.
- `index.html` — estructura y 39 `art-card` con `data-status` (mejora/alerta/nuevo/neutro)
- `main.css` — estilos globales
- `art_texts.js` — textos verbatim para los modales de detalle
- `accordion.js`, `calculators.js`, `features.js`, `filter.js` — funcionalidad JS modular
- `propuesta_ocr.txt` — OCR de la propuesta 2026 (34 pp, 1178 líneas) — fuente primaria
- `20170206_TEXTO_REFUNDIDO_INSTRUCCION_INTERNA_antigua.pdf` — texto 2017 — fuente primaria
- `enmiendas-ugt.html` — página separada con propuestas de enmienda
- `normativa/` — LOCAL, no versionada (solo `FUENTES.md` con las URL para volver a descargarla). Normas oficiales descargadas (BOE/BOJA/UMA) en PDF + `.txt` extraído con `pdftotext` para buscar con grep: EBEP consolidado, Ley 5/2023 Función Pública Andalucía, Decreto 347/2003, fiestas Andalucía 2027, calendarios UMA (PTGAS 2025 y 2026, PDI 2026), IV Convenio PAS laboral universidades andaluzas (copia UPO), acuerdos de homologación (UCO anexo 2, UJA completo)
- `docs/constitution.md` — principios innegociables del análisis
- `MEMORY.md` — estado del proyecto entre sesiones

## Comandos

- Sin servidor. Abrir `index.html` directamente en navegador.
- Comprobar la web tras cada cambio: `cd tools && npm run check` (la primera vez, `npm install`). Usa Chrome local; debe terminar en "✔ Todo correcto".
- Evaluar las enmiendas UGT: `/evaluar-enmiendas` (todas) o `/evaluar-enmiendas Art. 14` (una). Lo coordina el agente `orquestador-enmiendas`, que delega cada propuesta en `evaluador-enmiendas` (solo lectura, comprueba fuentes y redacta en lenguaje claro para la plantilla) y escribe `revision/evaluacion-enmiendas.md`. Esa carpeta NO se versiona: el repositorio es público.
- Al modificar `main.css` o cualquier `.js`, actualizar la marca `?v=AAAAMMDD` de sus referencias en `index.html`.
- Git: `git add -p`, commit descriptivo en español, push a `main`.

## Convenciones

- **Voz impersonal siempre**: "Se solicitará", "Se pedirá", "El texto establece que...". Nunca "UGT pide/exige/denuncia".
- **Sin lenguaje belicoso**: objetivo, técnico, verificable.
- **Textos en español**. Código en inglés solo donde ya lo hubiera.
- `data-status` válidos: `mejora` | `alerta` | `nuevo` | `neutro`
- Contadores dinámicos del dashboard leen `data-status` del DOM real — no hardcodear cifras.
- Los modales de `art_texts.js` usan HTML interno (`<p>`, `<strong>`, `<em>`). No Markdown.

## Reglas de dominio — trampas conocidas

- **Fuente primaria es el OCR** (`propuesta_ocr.txt`), no el PDF — el PDF tiene errores de maquetación.
- **Articulado 2017 vs 2026 cambia numeración**: confirmar siempre el artículo de origen antes de afirmar equivalencia.
- **4 recortes de derechos confirmados** (ver `MEMORY.md`): nunca reducir este número sin verificar el texto fuente.
- Los textos de `art_texts.js` deben ser fieles al texto fuente; cualquier paráfrasis o resumen es una alucinación potencial.
- Compartir el análisis con la plantilla durante la negociación **es legal** (Reglamento 3/2024 Arts. 2.2 y 10.5).

## Forma de trabajar

- Leer `MEMORY.md` al empezar. Actualizarlo al terminar.
- Cambios al texto de artículos: verificar siempre contra `propuesta_ocr.txt` o el PDF 2017.
- Un commit por tarea concreta. Mensaje descriptivo de lo que cambia y por qué.
- Al terminar una tarea, indicar qué RF cubre y actualizar `MEMORY.md`.

## Límites

- ✅ Siempre: respetar la voz impersonal, verificar contra texto fuente antes de afirmar.
- ⚠ Preguntar antes: añadir nuevos artículos, cambiar `data-status` de una ficha, crear archivos nuevos.
- 🚫 Nunca: inventar citas textuales, usar lenguaje sindical combativo, hardcodear los contadores.
