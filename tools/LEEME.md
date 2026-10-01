# Comprobación de la web

Prueba `index.html` y `enmiendas-ugt.html` en Chrome (escritorio 1280 px y móvil 375 px):
errores de consola, scroll horizontal, contadores frente a las fichas reales, etiquetas cortadas,
pliegue "Ver más", apertura del modal con teclado y retorno del foco.

La web no usa npm: esto es solo una herramienta local.

```
cd tools
npm install        # solo la primera vez
npm run check
```

Usa el Chrome instalado. Si no lo encuentra, define `CHROME_PATH` con la ruta del ejecutable.
Termina con código 0 si todo está bien y 1 si falla alguna comprobación.
