# Constitución — Instrucción Interna UMA PTGAS

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **La fuente manda**: nada se afirma sobre el texto de la instrucción sin verificarlo contra `propuesta_ocr.txt` (2026) o el PDF de 2017. Si no está en la fuente, no se escribe.

2. **Voz impersonal y objetiva**: los textos de análisis usan voz impersonal ("Se establece que...", "El artículo prevé..."). Cero lenguaje valorativo o combativo. La credibilidad ante el Rectorado depende de esto.

3. **Simplicidad primero**: HTML, CSS y JS puros. Sin dependencias ni build. Funciona abriendo `index.html` con doble clic. Prohibido añadir frameworks, npm o bundlers.

4. **Los 4 recortes de derechos son verificados**: están documentados con cita textual y referencia de artículo en ambos textos. No se reduce su número sin reverificar en la fuente.

5. **Contadores del dashboard son dinámicos**: leen `data-status` del DOM en tiempo real. Nunca se hardcodean.

6. **Idioma**: interfaz y análisis en español. Código en inglés donde ya lo hubiera (nombres de variables, funciones JS).
