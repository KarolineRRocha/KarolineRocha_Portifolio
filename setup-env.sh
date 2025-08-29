#!/bin/bash

# =============================================================================
# Environment Setup Script for Karoline Rocha Portfolio
# =============================================================================

echo "🚀 Setting up environment for Karoline Rocha Portfolio"
echo "=================================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created successfully!"
    echo "⚠️  Please edit .env file with your actual values before running the application"
else
    echo "✅ .env file already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed successfully!"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Edit .env file with your actual API keys and credentials"
echo "2. Run 'npm start' to start the development server"
echo "3. Access the application at http://localhost:4200"
echo ""
echo "🔒 Security notes:"
echo "- Never commit .env file to version control"
echo "- Keep your API keys and tokens secure"
echo "- Use strong passwords for admin accounts"
echo ""
echo "✨ Setup complete!"
