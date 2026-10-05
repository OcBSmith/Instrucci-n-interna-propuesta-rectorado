# Plan — Agentes de desarrollo en Kilo para el proyecto Instrucción Interna

## Contexto

El proyecto (web estática de análisis comparativo 2017 vs 2026 para UGT PTGAS UMA) tiene hoy agentes y comandos solo en formato Claude Code (`.claude/agents/`, `.claude/commands/`), que Kilo no carga. Kilo carga agentes de `.kilo/agents/*.md`, comandos de `.kilo/command/*.md` e instrucciones de `AGENTS.md` (no `CLAUDE.md`). No existe ningún agente dedicado al desarrollo de la web (fichas, CSS/JS, pruebas, publicación).

## Decisiones tomadas con el usuario

1. **Alcance**: ciclo completo — desarrollo web + verificación de contenido + QA + publicación.
2. **Migración**: los 2 agentes y 4 comandos existentes de `.claude/` se migran a `.kilo/` (adaptados al formato Kilo).
3. **Roster**: 4 agentes nuevos de desarrollo + 2 migrados de enmiendas.
4. **`.claude/`**: se deja intacto (coexisten ambas copias; el usuario asume el riesgo de desincronización).
5. **Comandos**: 4 migrados + 2 nuevos (`/qa-web`, `/publicar`).
6. **`AGENTS.md`**: puntero breve hacia `CLAUDE.md` (fuente única de reglas).

## Formato Kilo (verificado en la documentación oficial)

- Agente: `.kilo/agents/<nombre>.md` (el nombre del archivo es el nombre del agente). Frontmatter YAML: `description`, `mode: subagent`, `permission` (object: `edit`, `write`, `bash`, `task` con valores `allow|ask|deny` o patrones glob). El cuerpo markdown es el system prompt.
- Comando: `.kilo/command/<nombre>.md` con frontmatter `description` y cuerpo con `$ARGUMENTS` (mismo esquema que `.claude/commands/`).
- Verificación de carga: `kilo agent list` y `/reload` en sesión.

## Archivos a crear

### Agentes nuevos (`.kilo/agents/`)

**1. `desarrollador-web.md`** — implementa cambios en la web.
- `permission`: `task: deny`; `bash: {"*": "ask", "npm run check*": "allow", "node check-web.js*": "allow", "npx playwright*": "allow"}`; edit/write allow.
- Prompt: implementa cambios en `index.html`, `main.css`, `art_texts.js`, `enmiendas-ugt.html` respetando `docs/constitution.md` y `CLAUDE.md`: voz impersonal, `data-status` solo `mejora|alerta|nuevo|neutro`, contadores dinámicos (nunca hardcodear), modales en HTML (no Markdown), textos fieles a fuente (verificar contra `propuesta_ocr.txt` / PDF 2017 antes de escribir contenido), actualizar marca `?v=AAAAMMDD` en `index.html` al tocar CSS/JS, actualizar `MEMORY.md` al terminar. Tras cada cambio ejecutar `npm run check` (working directory `tools/`; en PowerShell 5.1 no usar `&&`). Devolver: resumen de cambios, resultado de check-web y diff.

**2. `verificador-fuentes.md`** — auditoría de contenido, solo lectura.
- `permission`: `edit: deny`, `write: deny`, `bash: deny`, `task: deny`.
- Prompt: contrastar cada afirmación factual de las fichas (`index.html`) y modales (`art_texts.js`) contra `propuesta_ocr.txt` (2026), el PDF 2017 y `normativa/` (índice en `normativa/FUENTES.md`). Tabla de salida: Ficha | Afirmación | Texto real en la fuente | Estado (✅/⚠/❌) + corrección exacta para los fallos. Dato no presente en fuente = «no verificado». No modifica archivos.

**3. `qa-web.md`** — QA de la web, solo lectura.
- `permission`: `edit: deny`, `write: deny`, `task: deny`; `bash: {"*": "deny", "npm run check*": "allow", "node check-web.js*": "allow", "npx playwright*": "allow", "npm install*": "allow"}`.
- Prompt: ejecutar la suite `tools/check-web.js` (26 comprobaciones: Chrome/Firefox/WebKit, escritorio 1280 px y móvil 375 px, contadores vs DOM, filtros, pliegue, modal por teclado, impresión, axe-core; `--publicada` si se pide). Interpretar fallos, localizar causa probable en el código sin modificarlo, y devolver informe: comprobaciones pasadas/falladas, causa y archivo/línea implicada.

**4. `publicador.md`** — publicación.
- `permission`: `edit: deny`, `write: deny`, `task: deny`; `bash: {"*": "deny", "git status*": "allow", "git diff*": "allow", "git add*": "allow", "git commit*": "allow", "git push*": "ask", "node check-web.js*": "allow", "npm run check*": "allow"}`.
- Prompt: 1) `git status`/`git diff` y listar los archivos a incluir (solo los previstos; nunca `revision/`, `normativa/` ni archivos untracked ajenos a la tarea). 2) Commit descriptivo en español, un commit por tarea concreta. 3) `git push` a `main` (GitHub Pages despliega solo). 4) Verificar el despliegue con `node check-web.js --publicada` desde `tools/`. Devolver: hash del commit, resultado de la verificación de Pages.

### Agentes migrados (`.kilo/agents/`)

**5. `evaluador-enmiendas.md`** — cuerpo idéntico al de `.claude/agents/evaluador-enmiendas.md` (ya compatible: usa Read/Grep/Glob, solo lectura). Frontmatter: `description` (idéntica), `mode: subagent`, `permission: {edit: deny, write: deny, bash: deny, task: deny}`.

**6. `orquestador-enmiendas.md`** — cuerpo adaptado del de `.claude/` (la referencia `Agent(evaluador-enmiendas)` pasa a ser delegación por la herramienta Task de Kilo al subagente `evaluador-enmiendas`; el resto del procedimiento, formato de informe y restricciones se mantienen). Frontmatter: `mode: subagent`, `permission: {edit: deny, task: {"evaluador-enmiendas": "allow"}, write: {"revision/*": "allow", "*": "deny"}}`.

### Comandos (`.kilo/command/`)

- `auditar-articulo.md`, `nuevo-recorte.md`, `verificar-alucinaciones.md`, `evaluar-enmiendas.md` — migrar de `.claude/commands/` con el mismo cuerpo; en `evaluar-enmiendas.md` y `verificar-alucinaciones.md` indicar que se delega en los subagentes `orquestador-enmiendas` y `verificador-fuentes` respectivamente.
- `qa-web.md` (nuevo) — «Ejecuta la suite completa de pruebas con el agente qa-web y preséntame el informe. No modifiques la web.»
- `publicar.md` (nuevo) — «Publica los cambios pendientes con el agente publicador: commit en español, push a main y verificación de GitHub Pages. Muéstrame el hash y el resultado de --publicada.»

### Instrucciones

- `AGENTS.md` (raíz) — puntero breve: «Las reglas del proyecto están en `CLAUDE.md`; leerlo al empezar. Agentes y comandos de Kilo: `.kilo/agents/` y `.kilo/command/`.»
- `CLAUDE.md` — añadir una sección corta «Kilo» documentando los 6 agentes, los 6 comandos y el puntero AGENTS.md (mantener el resto intacto).

## Tareas (orden)

1. Crear `AGENTS.md` (puntero) y actualizar `CLAUDE.md` con la sección Kilo.
2. Crear los 4 agentes nuevos en `.kilo/agents/` (desarrollador-web, verificador-fuentes, qa-web, publicador).
3. Migrar `evaluador-enmiendas` y `orquestador-enmiendas` a `.kilo/agents/` adaptando el frontmatter y la delegación.
4. Migrar los 4 comandos a `.kilo/command/` y crear `qa-web.md` y `publicar.md`.
5. Verificación (ver abajo).
6. Actualizar `MEMORY.md` (sección «Estado actual»: sistema de agentes Kilo creado; nota de que `.claude/` queda como copia para Claude Code).
7. Commit en español descriptivo (p. ej. «Agentes y comandos de Kilo: desarrollo, QA, publicación y migración de enmiendas») — solo con confirmación del usuario.

## Verificación

1. `kilo agent list` — los 6 agentes aparecen con `mode: subagent` y los permisos esperados. Si alguno no carga, corregir el frontmatter (el formato puede variar entre versiones) y repetir.
2. `/reload` en una sesión Kilo; comprobar que los 6 comandos aparecen en el menú slash.
3. Humo QA: ejecutar `/qa-web` → la suite termina en «✔ Todo correcto» (26 comprobaciones).
4. Humo verificación: pedir a `verificador-fuentes` auditar el Art. 14 → devuelve tabla y `git status` sigue limpio de cambios en la web.
5. Humo enmiendas: `/evaluar-enmiendas Art. 14` → el orquestador delega en el evaluador y escribe solo `revision/evaluacion-enmiendas.md`.
6. `git status` — solo los archivos previstos (`.kilo/agents/*`, `.kilo/command/*`, `AGENTS.md`, `CLAUDE.md`, `MEMORY.md`); `.claude/` sin cambios.

## Riesgos y mitigaciones

- **Formato de frontmatter/permisos**: la documentación puede diferir de la versión instalada. Mitigación: paso 1 de verificación (`kilo agent list`); si un patrón de permiso no es válido, degradar a `write: allow`/`bash: ask` globales y mantener la restricción en el prompt.
- **Desincronización `.claude/` vs `.kilo/`**: aceptada por el usuario. Nota en `MEMORY.md` recordando que la fuente de verdad para Kilo es `.kilo/`.
- **PowerShell 5.1**: `&&` no existe; los prompts de los agentes indican ejecutar `npm run check` con working directory `tools/` (o `; if ($?)`).
- **`revision/` y `normativa/` nunca se versionan**: el prompt de `publicador` lo prohíbe explícitamente.

## Fuera de alcance

- Borrar `.claude/` (decisión del usuario: se deja).
- Cambiar el contenido de las 39 fichas o de las 18 enmiendas.
- Crear `specs/` (deuda técnica pendiente, no ahora).
- Configurar permisos globales en `kilo.jsonc` (los permisos viven en el frontmatter de cada agente).
