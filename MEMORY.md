# MEMORY.md — Instrucción Interna UMA PTGAS
Estado del proyecto entre sesiones. Máximo ~60 líneas. Resumir o eliminar lo que ya no aporte.

## Estado actual

- **v funcionando**: web estática publicada en GitHub Pages con 39 fichas de artículos.
- Repo: `https://github.com/OcBSmith/Instrucci-n-interna-propuesta-rectorado.git`, rama `main`
- Dashboard con contadores dinámicos (leen `data-status` del DOM).
- Nota de versión/fecha visible en cabecera.

## Recortes de derechos documentados (4 confirmados)

| # | Artículo 2026 | Artículo 2017 | Descripción |
|---|---------------|---------------|-------------|
| 1 | Art. 10.5 | Art. 9 | Incompatibilidad reducción jornada verano + reducción por edad |
| 2 | Art. 14.1 | Art. 21.1 | Disponibilidad ordinaria exigible hasta 22:00h vs. 21:30h en 2017 |
| 3 | Art. 24.2 | Art. 22.2 | Prórroga voluntaria post-jubilación (hasta 70 años) pierde todas las reducciones por edad |
| 4 | Arts. 6-7 | Art. 4.1 | Jornada partida pierde la protección "lunes a jueves" para el turno de tarde |

## Decisiones importantes y por qué

- **Voz impersonal**: sección PTGAS-UGT no quiere que la web parezca un panfleto; objetivo para credibilidad ante Rectorado.
- **Sin frameworks**: debe poder abrirse con doble clic sin servidor; audiencia no técnica.
- **OCR como fuente**: el PDF 2026 tiene errores de maquetación; el OCR es más fiable para extracción de texto.
- **Compartir es legal**: Reglamento 3/2024 Arts. 2.2 (publicidad y transparencia) y 10.5 (actas nunca secretas) avalan la difusión a la plantilla.
- **MCP NotebookLM instalado** en `~/.claude.json` pero `setup_auth` pendiente de completar vía CLI.

## Aprendizajes y errores a evitar

- Art. 24.2 sobre prórroga voluntaria post-jubilación se omitió inicialmente — verificar siempre el artículo completo, no solo el titular.
- Los contadores dinámicos se rompían al hardcodearlos — usar siempre el IIFE que lee el DOM.
- Auditoría de alucinaciones (commit `a45ac34`): se corrigieron 5 errores donde el texto de las fichas no coincidía con la fuente.

## Próximos pasos

- Revisar si quedan más recortes no documentados (esp. en Arts. 15-20 sobre permisos y licencias).
- Completar `setup_auth` del MCP NotebookLM via CLI para poder usar NotebookLM desde Claude Code.
- Crear `specs/` para próximas funcionalidades si se amplía el proyecto.
