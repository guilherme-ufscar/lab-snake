@echo off
chcp 65001 >nul 2>&1
title Lab Snake - Puzzle Game
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║                                          ║
echo  ║          L A B   S N A K E               ║
echo  ║           Puzzle  Game                    ║
echo  ║                                          ║
echo  ╚══════════════════════════════════════════╝
echo.

:: ── Ir para a pasta do script ──
cd /d "%~dp0"

:: ── Verificar se o Node.js esta instalado ──
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Node.js nao foi encontrado no seu computador!
    echo.
    echo  O Node.js e necessario para rodar o jogo.
    echo  Siga os passos abaixo:
    echo.
    echo    1. Acesse:  https://nodejs.org
    echo    2. Clique no botao verde "LTS" para baixar
    echo    3. Execute o instalador e clique "Next" ate o fim
    echo    4. Reinicie este arquivo depois de instalar
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  [OK] Node.js %NODE_VER% encontrado.

:: ── Instalar dependencias se for a primeira vez ──
if not exist "node_modules\" (
    echo.
    echo  [..] Primeira execucao detectada!
    echo      Baixando e instalando dependencias do projeto...
    echo      (Isso so acontece uma vez, pode levar ~30 segundos)
    echo.
    call npm install --loglevel=error
    if %errorlevel% neq 0 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias.
        echo  Verifique sua conexao com a internet e tente novamente.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Tudo instalado com sucesso!
) else (
    echo  [OK] Dependencias ja instaladas.
)

echo.
echo  ═══════════════════════════════════════════
echo.
echo   Iniciando o jogo...
echo   O navegador vai abrir automaticamente!
echo.
echo   Endereco: http://localhost:5173
echo.
echo   * Para jogar no CELULAR pela mesma Wi-Fi,
echo     use o endereco "Network" abaixo.
echo.
echo   * Para FECHAR o jogo, feche esta janela
echo     ou pressione Ctrl+C.
echo.
echo  ═══════════════════════════════════════════
echo.

:: ── Abrir o navegador automaticamente apos 2s ──
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"

:: ── Iniciar servidor (--host para celular na rede) ──
call npx vite --host
