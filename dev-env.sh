#!/bin/bash

# =============================================================================
# Development Environment Setup Script
# =============================================================================

echo "🔧 Setting up development environment with .env variables"
echo "========================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your environment variables"
    echo "You can copy from env.example as a template"
    exit 1
fi

# Load environment variables from .env
echo "📋 Loading environment variables from .env..."
source .env

# Create development environment injection script
echo "🔧 Creating development environment script..."
cat > src/assets/env.js << EOF
/**
 * Environment Variables Injection Script (Development)
 * Generated automatically from .env file
 */

(function () {
  'use strict';

  // Create the global environment object
  window.__env__ = window.__env__ || {};

  // Development environment variables loaded from .env file
  window.__env__ = {
    API_URL: '${API_URL:-http://localhost:3000/api}',
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

  console.log('✅ Development environment variables loaded from .env');
  console.log('🔒 Environment variables loaded successfully (credentials hidden for security)');
})();
EOF

echo "✅ Development environment configured successfully!"
echo ""
echo "🚀 You can now start the development server:"
echo "   npm start"
echo ""
echo "🌐 Access your application at: http://localhost:4200"
echo ""
echo "🔒 Your environment variables are now loaded from .env file"
echo "⚠️  Remember: Never commit .env file to version control!"
