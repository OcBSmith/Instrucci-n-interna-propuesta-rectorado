# MEMORY.md — Instrucción Interna UMA PTGAS
Estado del proyecto entre sesiones. Máximo ~60 líneas. Resumir o eliminar lo que ya no aporte.

## Estado actual

- **v funcionando**: web estática publicada en GitHub Pages con 39 fichas de artículos.
- Repo: `https://github.com/OcBSmith/Instrucci-n-interna-propuesta-rectorado.git`, rama `main`
- Dashboard con contadores dinámicos (leen `data-status` del DOM).
- Nota de versión/fecha visible en cabecera.

## Recortes de derechos documentados en la web (verificados 2026-10-01)

| # | Art. 2026 | Art. 2017 | Descripción |
|---|-----------|-----------|-------------|
| 1 | 10.5 | 15.1 / 15.3 | Reducción verano no acumulable a reducción por edad |
| 2 | 14.1 | 21.1 | Disponibilidad exigible hasta 22:00 (antes 21:30) |
| 3 | 24.2 | 15.3 | Prórroga post-jubilación pierde reducciones por edad |
| 4 | 6-7 | 4.1 | Jornada partida pierde "lunes a jueves" |
| 5 | DT | DT 2017 | CIVI desaparece del articulado (solo preámbulo) |
| 6 | 23 | 15.2 | Bolsa 28h: presencia obligatoria sujeta a visto bueno |
| 7 | 8.5 | 3.4 | Saldo positivo requiere autorización |
| 8 | 28.15 | 5.3 | Navidad: bloque 24 dic–6 ene → 5 días + 24 y 31 por turnos |

## Auditoría 2026-10-01: hallazgos incorporados a la web el mismo día (fichas Arts. 8, 12, 14, 15, 28, 29, 31 y CIVI)
Fichas que pasan a "alerta": Art. 12 (HE), Art. 14 (disponibilidad), Art. 15 (asistencias), Art. 31 (ausencias).
Los puntos "A verificar" siguen pendientes.
- 14.3.a: se suprime "a elección del empleado" (2017 Art. 25) entre 2h o €/hora.
- 15: asistencias — desaparece informe previo Comité/Junta (2017 Art. 26.2º → "serán informados"); ámbito reducido (excluye funciones ordinarias, HE y "mudanzas").
- 12: horario especial excluye la regulación de exceso de jornada (no existía en 2017).
- 28.5: pruebas internas RPT UMA → "tiempo indispensable" (2017 10.4: días de celebración).
- 31.1: tope 6 días/3 ausencias aplica también con volante médico (2017 Art. 8: tope solo "sin justificación médica").
- 8.3: desaparecen "condiciones más beneficiosas" (2017 3.5) y "sin excepción de ningún colectivo" (2017 3.2.b).
- 29: omitidas 2h/día retribuidas por prematuro hospitalizado (2017 13.a; subsiste vía EBEP 48.g).
- A verificar: +4 semanas adicionales nacimiento/adopción (2017 13.a/b) remitidas a "normativa vigente" (29.4); "vacaciones obligatorias" (28.11); festivo de mañana tarifa b vs c (17.2); subidas no uniformes de cuantías (+10% / +18,46% / 30 € sin cambio); Navidad 2027–28 (25 dic en sábado: 9 días en 2017 vs 7).
- Errores en la web: ficha Art. 15 dice que el derecho de información "se mantiene" (2017 exigía informe previo); ficha HE habla de "veto sindical" (el texto dice "previa negociación"); ficha Art. 31 solo como mejora; ficha CIVI usa "LÍNEA ROJA ABSOLUTA: No se firmará" (incumple voz impersonal).

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
