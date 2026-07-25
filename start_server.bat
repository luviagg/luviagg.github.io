@echo off
title CS 1.6 CFG Builder Server - Port 3333
echo ===================================================
echo   Iniciando Servidor Web para CS CFG Builder
echo   Puerto: 3333
echo   URL: http://localhost:3333
echo ===================================================
echo.

rem Intentar abrir el navegador por defecto automáticamente
start http://localhost:3333

rem Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Node.js detectado. Usando npx http-server...
    npx http-server -p 3333 -c-1
    goto end
)

rem Check for Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Python detectado. Usando python http.server...
    python -m http.server 3333
    goto end
)

rem Check for PHP
where php >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] PHP detectado. Usando servidor interno de PHP...
    php -S localhost:3333
    goto end
)

echo [ERROR] No se encontro Node.js, Python o PHP instalado.
echo Por favor instala Node.js o Python para levantar el servidor local,
echo o podes abrir el archivo index.html directamente con tu navegador.
echo.
pause

:end
