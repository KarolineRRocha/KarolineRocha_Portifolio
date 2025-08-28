#!/bin/bash

# Setup Environment Script for Karoline Rocha Portfolio
# This script helps set up the environment files securely

echo "🔧 Setting up environment files for Karoline Rocha Portfolio"
echo "=========================================================="

# Check if environment files already exist
if [ -f "src/environments/environment.ts" ]; then
    echo "⚠️  Warning: environment.ts already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Environment files not modified."
        exit 1
    fi
fi

# Copy example files
echo "📋 Copying example environment files..."
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.prod.ts

echo "✅ Environment files created successfully!"
echo ""
echo "🔐 Next steps:"
echo "1. Edit src/environments/environment.ts with your actual values"
echo "2. Edit src/environments/environment.prod.ts with your production values"
echo "3. Never commit these files to version control"
echo ""
echo "📖 For detailed instructions, see SECURITY.md"
echo "🔗 For GitHub token setup: https://github.com/settings/tokens"
echo "📧 For EmailJS setup: https://www.emailjs.com/"
echo ""
echo "🎉 Setup complete! You can now run 'npm start' to begin development."
