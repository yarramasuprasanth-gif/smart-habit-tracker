#!/bin/bash

# Smart Habit Tracker - Quick Deploy Script
# This script prepares and deploys your app to Vercel

echo "🚀 Smart Habit Tracker - Deployment Script"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✅ Project directory verified"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your app is now live!"
echo "Check the URL above to access your Smart Habit Tracker PWA"
echo ""
echo "📱 Install on your phone:"
echo "1. Open the URL on your mobile device"
echo "2. iOS: Safari → Share → Add to Home Screen"
echo "3. Android: Chrome → Install button"
echo ""
echo "Happy habit tracking! 💪🔥"
