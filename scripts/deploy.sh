#!/bin/bash

# Fly.io Deployment Script
# This script handles deployment to Fly.io with proper error handling

set -e

echo "🚀 Starting Fly.io deployment..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if user is authenticated
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not authenticated with Fly.io. Please run: flyctl auth login"
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
if ! flyctl storage list | grep -q "tigris-storage"; then
    echo "Creating Tigris storage..."
    flyctl storage create --name tigris-storage
fi

# Deploy the application
echo "🚀 Deploying to Fly.io..."
flyctl deploy --no-cache

# Check deployment status
echo "✅ Deployment completed!"
echo "🔗 App URL: https://$APP_NAME.fly.dev"

# Run health check
echo "🔍 Running health check..."
if curl -f "https://$APP_NAME.fly.dev/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    exit 1
fi

echo "🎉 Deployment successful!"