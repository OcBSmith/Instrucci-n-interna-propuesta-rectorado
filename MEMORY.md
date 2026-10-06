# MEMORY.md — Instrucción Interna UMA PTGAS
Estado del proyecto entre sesiones. Máximo ~60 líneas. Resumir o eliminar lo que ya no aporte.

## Estado actual
- Web estática en GitHub Pages, 39 fichas (14 alerta / 8 mejora / 10 neutro / 7 nuevo). Repo `OcBSmith/Instrucci-n-interna-propuesta-rectorado`, rama `main`.
- Contadores dinámicos leen `data-status` del DOM. Nota de versión/fecha en cabecera.
- `normativa/`: 10 normas oficiales (PDF + `.txt` para grep). Ver CLAUDE.md.
- Sistema de agentes Kilo creado (2026-10-01): 6 subagentes en `.kilo/agents/` (desarrollador-web, verificador-fuentes, qa-web, publicador, evaluador-enmiendas, orquestador-enmiendas) y 6 comandos en `.kilo/command/` (auditar-articulo, nuevo-recorte, verificar-alucinaciones, evaluar-enmiendas, qa-web, publicar). `AGENTS.md` es puntero a `CLAUDE.md` (nueva sección «Kilo»). `.claude/` queda como copia para Claude Code; para Kilo la fuente de verdad es `.kilo/`.
- (2026-10-06) Incorporación de guía explicativa «¿Cómo funciona este análisis comparativo?» en `#articulos` estructurada en 3 niveles (resumen frente a Instrucción 2017, posición/alertas sindicales de UGT y apertura del texto íntegro literal propuesto al pulsar cualquier ficha). Justificación de texto legal en visor modal y alineación de terminología a «Instrucción interna vigente (2017)». Versión CSS `v=20261006d`. 26/26 checks OK en Chrome, Firefox, Safari/WebKit y móvil.
- (2026-10-06) Auditoría visual y de formato: corrección en Ficha 38, homogeneización de cajas UGT de conformidad (Fichas 02 y 03 con `art-card-ugt-ok` y `✓`), unificación de breakpoints responsive (eliminado 600px, 680px movido a 768px), enlace de retorno en `enmiendas-ugt.html`, corrección del visor modal (#artModal: retirada de negrita forzada y alineación a 26px), supresión de mención a 'Rectorado' en cabecera y actualización de fecha de auditoría a 06/10/2026.
- (2026-10-05) Rediseño completo del bloque `.doc-hero` (maqueta clara): fondo blanco, bordes redondeados y sombra sutil, ilustración 3D de hoja de documento con facetas rojas en la columna de logo, pill badge "DOCUMENTO ANALIZADO", divisor horizontal, caja de actualización con icono de documento y botón rojo UGT para "Descargar PDF". 26/26 checks OK en Chrome, Firefox, WebKit, móvil y accesibilidad.

## Recortes documentados en la web (verificados 2026-10-01)
| Art. 2026 | Art. 2017 | Recorte |
|---|---|---|
| 10.5 | 15.1/15.3 | Reducción verano no acumulable a reducción por edad |
| 14.1 | 21.1 | Disponibilidad hasta 22:00 (antes 21:30) |
| 14.3.a | 25 | Se suprime "a elección del empleado" (2h o €/h) |
| 24.2 | 15.3 | Prórroga post-jubilación pierde reducciones por edad |
| 6-7 | 4.1 | Jornada partida pierde "lunes a jueves" |
| 8.3/8.5 | 3.2.b/3.4/3.5 | Saldo positivo con autorización; pierde "sin excepción" y "condiciones más beneficiosas" |
| 12 | 25 | Horario especial excluido del exceso de jornada |
| 15 | 26 | Asistencias: sin informe previo de Comité/Junta; ámbito reducido |
| 23 | 15.2 | Bolsa 28h: presencia obligatoria sujeta a visto bueno |
| 28.5 | 10.4 | Pruebas internas RPT → tiempo indispensable |
| 28.15 | 5.3 | Navidad: bloque 24 dic–6 ene → 5 días + 24 y 31 por turnos |
| 29 | 13.a | Omitidas 2h/día por prematuro (subsiste vía EBEP 48.g) |
| 31.1 | 8 | Tope 6 días/3 ausencias también con volante médico |
| DT | DT 2017 | CIVI desaparece del articulado |

## Deuda técnica (pendiente)
1. ✅ HECHO (2026-10-01): verificación normativa volcada a las fichas Arts. 14, 17, 28 y 29. Detalle de lo volcado:
   - 29.4: las 4 semanas adicionales salen del Decreto 347/2003 (solo Junta). Ley 5/2023 (art. 3.1.c: al PTGAS solo de forma supletoria; art. 38) y EBEP art. 49 no las prevén → 2017 = 20 semanas, 2026 = 19.
   - 28.11: "vacaciones obligatorias" = bloque de agosto del calendario (2026: 3–21 ago) → asuntos propios solo acumulables a ese bloque.
   - 17.2: "festivo" en las tarifas b y c (confirmado en el PDF original, p. 11). En 2017 un festivo cobraba siempre la tarifa alta.
   - Navidad: el 25-12-2027 cae en sábado y no se traslada (Decreto 84/2026) → 9 días frente a 7. Los calendarios PTGAS 2025 y 2026 basan el cierre en el "art. 5.3 de la Instrucción Interna", que desaparece. El 28.15 copia el art. 33.1 del IV Convenio laboral.
   - 14.1: el acuerdo de homologación (apdo. 7º) no fija franja horaria y compensa a 1h45 → las 22:00 son decisión de la UMA; el 2x de la UMA es una mejora.
2. **Cuantías por IPC sin verificar**: pedir a Gerencia las tablas vigentes (DA 3ª 2017). Las subidas no son uniformes: +10% / +18,46% / 0%.
3. **Comprobar vigencia del IV Convenio** (copia UPO de 2004): buscar modificaciones posteriores en el BOJA.
4. ✅ Web probada (2026-10-01) con playwright-core + Chrome local desde un script en scratchpad (no hace falta MCP): 0 errores de consola, contadores 14/8/7/10, sin desbordamiento a 375 px. Corregido el CSS móvil que cortaba 18 etiquetas con "…". Separación de 8 px entre bloques de `.art-card-body` añadida. Pliegue automático: las fichas con cuerpo > 420 px se recortan a 300 px con botón "Ver más/Ver menos" (script inline en index.html, tras el del modal; el botón hace stopPropagation para no abrir el modal; en impresión se despliegan todas). Pliegan 6 fichas en escritorio y 12 en móvil.
5. **NotebookLM MCP**: falta `setup_auth` vía CLI.
6. ✅ Etiquetas «Línea roja» sustituidas por «Prioritario» en `enmiendas-ugt.html`.
7. Crear `specs/` si el proyecto se amplía (metodología SDD).

8. ✅ (2026-10-01) Prueba permanente en `tools/check-web.js` (26 comprobaciones); fichas accesibles con teclado (Tab, Intro/espacio, el foco vuelve al cerrar); marca de caché `?v=20261001` en CSS y JS.
   - Fallo encontrado por la prueba y corregido: `.art-card-more{display:inline-flex}` anulaba `[hidden]` → 31 fichas mostraban un botón vacío desde el commit 0ca4980. Además, la medición del pliegue se repite tras cargar la fuente web.
9. ✅ (2026-10-01) Prueba ampliada a Chrome, Firefox y WebKit, móvil real (viewport), impresión, accesibilidad (axe) y `--publicada`. Corregido: enmiendas-ugt.html sin viewport ni DOCTYPE (en móvil real se veía a 980 px, en modo de compatibilidad antigua); contraste insuficiente (gris de texto, etiquetas ⚠, contador activo, "sin equivalente"); impresión en una columna (25 → 17 págs.); un "Gerencia" residual en el Art. 8.
10. Pendiente HUMANO: tablas de cuantías vigentes (Gerencia); validar las 18 propuestas de enmienda; decidir si se borran calculators.js (no se carga), filter.js y accordion.js (buscan elementos que no existen); enmienda del Art. 18.1 redundante con el 18.2.

## Decisiones y por qué
- **Voz impersonal**: credibilidad ante el Rectorado; nada que parezca un panfleto.
- **Sin frameworks**: se abre con doble clic; audiencia no técnica.
- **OCR como fuente primaria**; ante dudas de OCR, contrastar con el PDF original.
- **Compartir es legal**: Reglamento 3/2024 arts. 2.2 y 10.5.

## Auditoría completa de las 39 fichas (2026-10-01) — 46 correcciones
Errores de fondo corregidos: Art. 9 decía que no existía normativa de teletrabajo (existe: Reglamento 10/2024, de 23 de julio); Art. 20 presentaba como mejora los 18 meses tras IT (ya estaban en 2017, Art. 19.2); Art. 21 le atribuía incompatibilidades y cómputo que no regula; DA 2ª decía que admite declaración responsable (no la prevé); DA MSN citaba festivos en sábado de 2024 equivocados y un convenio no verificado; Art. 32 atribuía a la Directiva la obligación de retribuir (es el art. 37.9 ET: 4 días, personal laboral); Art. 14: la disponibilidad solo se compensa en tiempo; Art. 27 "nula de pleno derecho"; Art. 25 "estudios médicos"; Art. 22 describía mal el régimen de 2017. "Gerencia" sustituido por el órgano competente en materia de PTGAS (lo que dice el texto de 2026).

## Cotejo modal (art_texts.js) con el OCR (2026-10-01)
Comparación palabra a palabra de 40 entradas: arts. 1-32 y DA/DT coinciden (las diferencias son solo erratas del OCR corregidas: espacios, "12/22/32" → 1.º/2.º/3.º, "300" → "30 o"). Corregido: el Art. 5.2.c omitía una frase; "civi_preambulo" y "da_festivos_sabado" contenían redacción propia con afirmaciones no verificadas bajo la etiqueta "texto literal" → ahora cita literal del Preámbulo y nota neutra. Caché `art_texts.js?v=3`.

## enmiendas-ugt.html revisada con correcciones del informe de evaluación (2026-10-01)
- Aplicadas todas las correcciones posibles de `revision/evaluacion-enmiendas.md` (18 enmiendas evaluadas).
- Nueva clase CSS `.ugt-pendiente` (color oscuro en light mode / ámbar en dark mode; pasa WCAG al heredar opacity:.8 del padre `.ugt-justif`).
- 19 marcadores `[⚠ Decisión sindical: ...]` añadidos en las celdas de justificación afectadas.
- Cambios de fondo: Art. 18 aptdo. 3 reescrito (sin referencia a «asuntos particulares»); Art. 9 teletrabajo reemplazado por redacción alternativa del evaluador (sin mínimo de días en la Instrucción); Art. 12 remisión ampliada a arts. 14–17; Art. 13.5 reestructurado en tres sub-aptdos (5, 5 bis, 5 ter); Art. 28.5 cambia de «suprimir» a «modificar el inciso»; Art. 28.15 justificación corregida (distinción entre texto del Rectorado y texto de 2017); Art. 30 añadida condición «siempre y cuando haya agotado el plazo máximo» y referencia al Art. 27.2; Art. 24.2 justificación corregida (argumento de silencio, no reconocimiento expreso); Art. 17.2.b redacción de letra c) añadida; DA festivos justificación corregida (no es la DA 3ª de 2017); DA CIVI «resoluciones de obligado cumplimiento» sustituido por «criterios de interpretación».
- `npm run check`: ✔ Todo correcto (26/26 comprobaciones).

## enmiendas-ugt.html actualizada (2026-10-01): de 8 a 18 propuestas
- La columna izquierda es el «Documento trabajo en MSN» de la Tabla del Rectorado (NO el texto de 2017; numeración distinta).
- Enmienda del permiso parental movida del Art. 28.5 (que regula exámenes) al Art. 29.5. Nuevas: Arts. 12, 14, 15, 17.2.b, 23, 24.2, 28 (5, 11, 15), 29 (prematuros, 4 semanas), 31.1, 32.3, DA festivos en sábado; añadidos a 6.1.c (L-J), 8.3 y 10.5.
- Las nuevas redacciones son BORRADORES basados en las posiciones de las fichas: pendientes de validación por la sección sindical.
- Hechos verificados: horario reducido 16/06–15/09/2024 y 16/06–08/09/2025 (resoluciones rectorales); Reglamento 10/2024 de teletrabajo sin mínimo de días (art. 11.1). Licencia no retribuida: la restricción bienal solo aplica tras agotar los 3 meses.
- Decidido (2026-10-01): las etiquetas «Línea roja» se sustituyen por «Prioritario» (tono técnico ante la Mesa); el Art. 10 se alinea con la práctica real: del 16 de junio al 15 de septiembre (Resolución de 27-05-2024), en enmiendas y en la ficha.

## Aprendizajes y errores a evitar
- Leer el artículo completo, no solo el titular (Art. 24.2 se omitió al principio).
- Los hallazgos de "ausencia" deben confirmarse con grep literal en el OCR.
- No hardcodear contadores. No afirmar "veto" ni "se mantiene" sin cotejar las dos versiones.
- Las normas autonómicas (Junta) no se aplican directamente a la UMA: comprobar el ámbito antes de citarlas.
- Las afirmaciones sobre hechos externos (prácticas pasadas, otros convenios, estudios, normativa "inexistente") son las que más fallan: verificar con fuente o eliminarlas.
- En 2026 el órgano no es "Gerencia", sino "el órgano que ostente las competencias en materia de PTGAS".
