@echo off
title CS 1.6 CFG Builder Server - Port 3333
echo ===================================================
echo   Iniciando Servidor Web para CS CFG Builder
echo   Puerto: 3333
echo   URL: http://localhost:3333
echo ===================================================
echo.

start http://localhost:3333

echo [INFO] Iniciando servidor Node.js...
node server.js
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No se pudo iniciar el servidor Node.js.
    pause
)
