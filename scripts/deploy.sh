#!/bin/bash

# Fly.io Deployment Script
# This script handles deployment to Fly.io with proper error handling

set -e

# Setup flyctl PATH
export FLYCTL_INSTALL="/home/ubuntu/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

echo "🚀 Starting Fly.io deployment..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Installing now..."
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/home/ubuntu/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

# Check if user is authenticated
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not authenticated with Fly.io. Please run: flyctl auth login"
    echo "💡 Run this command to authenticate:"
    echo "   flyctl auth login"
    exit 1
fi

# Get app name from fly.toml
APP_NAME=$(grep '^app = ' fly.toml | cut -d'"' -f2)

# Check if app exists
if ! flyctl apps list | grep -q "$APP_NAME"; then
    echo "📦 App $APP_NAME doesn't exist. Creating..."
    flyctl apps create $APP_NAME
fi

# Set up Tigris storage if not exists
echo "🗄️  Setting up Tigris storage..."
if ! flyctl storage list --app $APP_NAME 2>/dev/null | grep -q "tigris-storage"; then
    echo "Creating Tigris storage..."
    flyctl storage create --name tigris-storage --app $APP_NAME
fi

# Deploy the application
echo "🚀 Deploying to Fly.io..."
flyctl deploy --app $APP_NAME --no-cache

# Check deployment status
echo "✅ Deployment completed!"
echo "🔗 App URL: https://$APP_NAME.fly.dev"

# Run health check
echo "🔍 Running health check..."
sleep 15  # Wait for app to start
if curl -f "https://$APP_NAME.fly.dev/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    echo "📊 Check logs with: flyctl logs --app $APP_NAME"
    exit 1
fi

echo "🎉 Deployment successful!"
echo "📊 Monitor your app at: https://fly.io/apps/$APP_NAME"