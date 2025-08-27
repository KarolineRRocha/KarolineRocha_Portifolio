#!/bin/bash

echo "🚀 Iniciando deploy manual para GitHub Pages..."

# Verificar se estamos na branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Erro: Você deve estar na branch main para fazer o deploy"
    echo "📋 Branch atual: $current_branch"
    echo "🔄 Execute: git checkout main"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Há mudanças não commitadas"
    echo "📋 Execute: git add . && git commit -m 'your message'"
    exit 1
fi

echo "✅ Branch main verificada"
echo "✅ Sem mudanças pendentes"

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Erro no build da aplicação"
    exit 1
fi

echo "✅ Build concluído com sucesso"

# Verificar se a pasta dist existe
if [ ! -d "dist/webPortifolio" ]; then
    echo "❌ Erro: Pasta dist/webPortifolio não encontrada"
    exit 1
fi

echo "📁 Conteúdo da pasta dist/webPortifolio:"
ls -la dist/webPortifolio

# Fazer deploy para a branch gh-pages
echo "🚀 Fazendo deploy para GitHub Pages..."

# Salvar branch atual
current_branch=$(git branch --show-current)

# Criar ou fazer checkout da branch gh-pages
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "📋 Fazendo checkout da branch gh-pages existente..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "📋 Criando nova branch gh-pages..."
    git checkout --orphan gh-pages
fi

# Limpar branch (exceto .git)
git rm -rf . || true

# Copiar arquivos de build para a raiz
echo "📁 Copiando arquivos de build..."
cp -r dist/webPortifolio/* .

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Deploy to GitHub Pages - $(date)"

# Push para gh-pages
echo "🚀 Enviando para GitHub Pages..."
git push origin gh-pages --force

# Voltar para a branch original
git checkout $current_branch

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://karolinerrocha.github.io/KarolineRocha_Portifolio/"
echo "⏰ Pode levar alguns minutos para atualizar"
