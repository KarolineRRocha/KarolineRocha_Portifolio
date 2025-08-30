#!/bin/bash

# =============================================================================
# Production Build Script for GitHub Pages Deployment
# =============================================================================

echo "🚀 Building production version for GitHub Pages"
echo "================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please create .env file with your production environment variables"
    echo "You can copy from env.example as a template"
    exit 1
fi

# Load environment variables
echo "📋 Loading environment variables..."
source .env

# Create environment injection script for production
echo "🔧 Creating environment injection script..."
cat > src/assets/env.js << EOF
/**
 * Environment Variables Injection Script (Production)
 * Generated automatically by build script for GitHub Pages
 */

(function() {
  'use strict';

  window.__env__ = {
    PORTFOLIO_API_URL: '${PORTFOLIO_API_URL:-https://your-production-api.com/api}',
    PORTFOLIO_GITHUB_USERNAME: '${PORTFOLIO_GITHUB_USERNAME:-KarolineRRocha}',
    PORTFOLIO_GITHUB_TOKEN: '', // Token não deve ser exposto no cliente
    PORTFOLIO_EMAILJS_SERVICE_ID: '${PORTFOLIO_EMAILJS_SERVICE_ID:-}',
    PORTFOLIO_EMAILJS_TEMPLATE_ID: '${PORTFOLIO_EMAILJS_TEMPLATE_ID:-}',
    PORTFOLIO_EMAILJS_USER_ID: '${PORTFOLIO_EMAILJS_USER_ID:-}',
    PORTFOLIO_ADMIN_USERNAME: '${PORTFOLIO_ADMIN_USERNAME:-}',
    PORTFOLIO_ADMIN_PASSWORD: '${PORTFOLIO_ADMIN_PASSWORD:-}',
    PORTFOLIO_FIREBASE_API_KEY: '${PORTFOLIO_FIREBASE_API_KEY:-}',
    PORTFOLIO_FIREBASE_AUTH_DOMAIN: '${PORTFOLIO_FIREBASE_AUTH_DOMAIN:-}',
    PORTFOLIO_FIREBASE_DATABASE_URL: '${PORTFOLIO_FIREBASE_DATABASE_URL:-}',
    PORTFOLIO_FIREBASE_PROJECT_ID: '${PORTFOLIO_FIREBASE_PROJECT_ID:-}',
    PORTFOLIO_FIREBASE_STORAGE_BUCKET: '${PORTFOLIO_FIREBASE_STORAGE_BUCKET:-}',
    PORTFOLIO_FIREBASE_MESSAGING_SENDER_ID: '${PORTFOLIO_FIREBASE_MESSAGING_SENDER_ID:-}',
    PORTFOLIO_FIREBASE_APP_ID: '${PORTFOLIO_FIREBASE_APP_ID:-}',
    PORTFOLIO_FIREBASE_MEASUREMENT_ID: '${PORTFOLIO_FIREBASE_MEASUREMENT_ID:-}'
  };

  console.log('Production environment variables loaded for GitHub Pages');
})();
EOF

# Build the application for GitHub Pages
echo "🔨 Building application for GitHub Pages..."

# Temporarily change base href for production build
sed -i '' 's|<base href="/">|<base href="/KarolineRocha_Portfolio/">|g' src/index.html

# Build
npm run build:prod

# Restore base href for local development
sed -i '' 's|<base href="/KarolineRocha_Portfolio/">|<base href="/">|g' src/index.html

if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"

    # Copy 404.html to the root of the build output for GitHub Pages SPA routing
    echo "🔧 Setting up GitHub Pages SPA routing..."
    if [ -f "src/assets/404.html" ]; then
        cp src/assets/404.html dist/KarolineRocha_Portfolio/404.html
        echo "✅ 404.html copied to build output"
    else
        echo "⚠️  404.html not found in src/assets/"
    fi

    echo "📁 Build output: dist/KarolineRocha_Portfolio/"
    echo ""
    echo "🚀 Ready for GitHub Pages deployment!"
    echo "The GitHub Actions workflow will automatically deploy this build to GitHub Pages"
    echo ""
    echo "📋 Next steps:"
    echo "1. Commit and push your changes to the main branch"
    echo "2. GitHub Actions will automatically build and deploy to GitHub Pages"
    echo "3. Your site will be available at: https://karolinerrocha.github.io/KarolineRocha_Portfolio/"
    echo ""
    echo "🔗 SPA routing is now configured for GitHub Pages!"
else
    echo "❌ Build failed!"
    exit 1
fi
