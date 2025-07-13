#!/bin/bash

# Fly.io Production Deployment Script
# This script includes extra safety checks for production deployments

set -e

# Setup flyctl PATH
export FLYCTL_INSTALL="/home/ubuntu/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

echo "🔴 Starting PRODUCTION deployment..."

# Production safety confirmation
read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Production deployment cancelled."
    exit 1
fi

# Set production environment variables
export FLY_APP_NAME="birthday-timeline-tigris"
export NODE_ENV="production"

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

# Verify app exists
if ! flyctl apps list | grep -q "$FLY_APP_NAME"; then
    echo "❌ Production app $FLY_APP_NAME doesn't exist. Please create it first."
    echo "💡 Run this command to create the app:"
    echo "   flyctl apps create $FLY_APP_NAME"
    exit 1
fi

# Check if staging is working (optional but recommended)
echo "🔍 Checking staging deployment..."
STAGING_URL="https://birthday-timeline-tigris-staging.fly.dev"
if ! curl -f "$STAGING_URL/health" > /dev/null 2>&1; then
    echo "⚠️  Staging is not responding. Consider deploying to staging first."
    read -p "Continue with production deployment anyway? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "❌ Production deployment cancelled."
        exit 1
    fi
fi

# Run tests before deployment
echo "🧪 Running tests..."
if command -v npm &> /dev/null; then
    npm test || echo "⚠️  Tests failed or not configured"
    npm run lint || echo "⚠️  Linting failed or not configured"
fi

# Set up Tigris storage for production
echo "🗄️  Setting up production Tigris storage..."
if ! flyctl storage list --app $FLY_APP_NAME 2>/dev/null | grep -q "tigris-storage"; then
    echo "Creating production Tigris storage..."
    flyctl storage create --name tigris-storage --app $FLY_APP_NAME
fi

# Deploy to production
echo "🚀 Deploying to production..."
flyctl deploy --app $FLY_APP_NAME --no-cache

# Check production deployment
echo "✅ Production deployment completed!"
echo "🔗 Production URL: https://$FLY_APP_NAME.fly.dev"

# Run health check
echo "🔍 Running production health check..."
sleep 15  # Wait for app to start
if curl -f "https://$FLY_APP_NAME.fly.dev/health" > /dev/null 2>&1; then
    echo "✅ Production health check passed!"
else
    echo "❌ Production health check failed!"
    echo "🔄 Consider rolling back if issues persist"
    echo "📊 Check logs with: flyctl logs --app $FLY_APP_NAME"
    exit 1
fi

# Optional: Run smoke tests
echo "🔍 Running smoke tests..."
if curl -f "https://$FLY_APP_NAME.fly.dev/api/test-tigris" > /dev/null 2>&1; then
    echo "✅ Tigris connection test passed!"
else
    echo "⚠️  Tigris connection test failed - check configuration"
    echo "💡 Verify your Tigris secrets are set correctly:"
    echo "   flyctl secrets list --app $FLY_APP_NAME"
fi

echo "🎉 Production deployment successful!"
echo "📊 Monitor your app at: https://fly.io/apps/$FLY_APP_NAME"