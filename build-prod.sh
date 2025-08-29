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
    API_URL: '${API_URL:-https://your-production-api.com/api}',
    GITHUB_USERNAME: '${GITHUB_USERNAME:-KarolineRRocha}',
    GITHUB_TOKEN: '${GITHUB_TOKEN:-}',
    EMAILJS_SERVICE_ID: '${EMAILJS_SERVICE_ID:-}',
    EMAILJS_TEMPLATE_ID: '${EMAILJS_TEMPLATE_ID:-}',
    EMAILJS_USER_ID: '${EMAILJS_USER_ID:-}',
    ADMIN_USERNAME: '${ADMIN_USERNAME:-}',
    ADMIN_PASSWORD: '${ADMIN_PASSWORD:-}',
    FIREBASE_API_KEY: '${FIREBASE_API_KEY:-}',
    FIREBASE_AUTH_DOMAIN: '${FIREBASE_AUTH_DOMAIN:-}',
    FIREBASE_DATABASE_URL: '${FIREBASE_DATABASE_URL:-}',
    FIREBASE_PROJECT_ID: '${FIREBASE_PROJECT_ID:-}',
    FIREBASE_STORAGE_BUCKET: '${FIREBASE_STORAGE_BUCKET:-}',
    FIREBASE_MESSAGING_SENDER_ID: '${FIREBASE_MESSAGING_SENDER_ID:-}',
    FIREBASE_APP_ID: '${FIREBASE_APP_ID:-}',
    FIREBASE_MEASUREMENT_ID: '${FIREBASE_MEASUREMENT_ID:-}'
  };

  console.log('Production environment variables loaded for GitHub Pages');
})();
EOF

# Build the application for GitHub Pages
echo "🔨 Building application for GitHub Pages..."
npm run build:prod

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
