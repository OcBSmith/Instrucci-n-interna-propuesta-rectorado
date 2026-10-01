# Comprobación de la web

Prueba `index.html` y `enmiendas-ugt.html` en **Chrome, Firefox y WebKit (motor de Safari)**,
a 1280 px y en móvil real de 375 px (Chrome y WebKit simulan el móvil con su viewport; Firefox no lo admite).

Comprueba: errores de consola, scroll horizontal, maquetación móvil (viewport), contadores frente a
las fichas reales, filtros, etiquetas cortadas, botones "Ver más" (pliegue, vacíos, que no abran el modal),
modal con teclado (Intro, Escape, retorno del foco), que las 39 fichas abran texto, botón "↑",
impresión ("Descargar PDF", fichas desplegadas, PDF de muestra en `tools/out/analisis.pdf`)
y accesibilidad con axe-core (falla con problemas graves o críticos, incluido el contraste).

La web no usa npm: esto es solo una herramienta local.

```
cd tools
npm install                                   # solo la primera vez
npx playwright-core install firefox webkit    # solo la primera vez (~150 MB)
npm run check                                 # todas las pruebas locales
node check-web.js --publicada                 # además compara la web publicada con la copia local
```

Usa el Chrome instalado; si no lo encuentra, define `CHROME_PATH`.
Termina con código 0 si todo está bien y 1 si falla alguna comprobación.
