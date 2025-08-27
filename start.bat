@echo off
echo 🚀 Iniciando o projeto Karoline Rocha Portfolio...

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se o npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não está instalado. Por favor, instale o npm primeiro.
    pause
    exit /b 1
)

echo 📦 Instalando dependências...
npm install

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências. Verifique se há problemas no package.json
    pause
    exit /b 1
)

echo ✅ Dependências instaladas com sucesso!

echo 🌐 Iniciando servidor de desenvolvimento...
echo 📍 O projeto estará disponível em: http://localhost:4200
echo 🔄 Para parar o servidor, pressione Ctrl+C
echo.

REM Iniciar o servidor Angular
ng serve --open
