#!/bin/bash

# Fly.io Staging Deployment Script

set -e

echo "🔄 Starting staging deployment..."

# Set staging environment variables
export FLY_APP_NAME="birthday-timeline-tigris-staging"
export NODE_ENV="staging"

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

# Create staging app if it doesn't exist
if ! flyctl apps list | grep -q "$FLY_APP_NAME"; then
    echo "📦 Creating staging app..."
    flyctl apps create $FLY_APP_NAME
fi

# Set up Tigris storage for staging
echo "🗄️  Setting up staging Tigris storage..."
if ! flyctl storage list --app $FLY_APP_NAME | grep -q "tigris-storage-staging"; then
    echo "Creating staging Tigris storage..."
    flyctl storage create --name tigris-storage-staging --app $FLY_APP_NAME
fi

# Deploy to staging
echo "🚀 Deploying to staging..."
flyctl deploy --app $FLY_APP_NAME --no-cache

# Check staging deployment
echo "✅ Staging deployment completed!"
echo "🔗 Staging URL: https://$FLY_APP_NAME.fly.dev"

# Run health check
echo "🔍 Running staging health check..."
if curl -f "https://$FLY_APP_NAME.fly.dev/health" > /dev/null 2>&1; then
    echo "✅ Staging health check passed!"
else
    echo "❌ Staging health check failed!"
    exit 1
fi

echo "🎉 Staging deployment successful!"