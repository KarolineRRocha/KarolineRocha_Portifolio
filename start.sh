#!/bin/bash

echo "🚀 Iniciando o projeto Karoline Rocha Portfolio..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências. Verifique se há problemas no package.json"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso!"

echo "🌐 Iniciando servidor de desenvolvimento..."
echo "📍 O projeto estará disponível em: http://localhost:4200"
echo "🔄 Para parar o servidor, pressione Ctrl+C"
echo ""

# Iniciar o servidor Angular
ng serve --open
