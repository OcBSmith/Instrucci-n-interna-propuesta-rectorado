@echo off
echo Arrancando Playwright MCP en http://localhost:8931 ...
echo Deja esta ventana abierta mientras usas Claude Code.
echo.
npx @playwright/mcp@latest --port 8931
