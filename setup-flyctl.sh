#!/bin/bash

# Setup script for flyctl installation and PATH configuration

set -e

echo "🔧 Setting up flyctl for Fly.io deployments..."

# Install flyctl if not already installed
if ! command -v flyctl &> /dev/null; then
    echo "📦 Installing flyctl..."
    curl -L https://fly.io/install.sh | sh
else
    echo "✅ flyctl is already installed"
fi

# Setup PATH
export FLYCTL_INSTALL="/home/ubuntu/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Make PATH persistent
echo "🔧 Making flyctl PATH persistent..."
if ! grep -q "FLYCTL_INSTALL" ~/.bashrc; then
    echo 'export FLYCTL_INSTALL="/home/ubuntu/.fly"' >> ~/.bashrc
    echo 'export PATH="$FLYCTL_INSTALL/bin:$PATH"' >> ~/.bashrc
fi

# Make scripts executable
chmod +x scripts/deploy.sh
chmod +x scripts/deploy-staging.sh
chmod +x scripts/deploy-production.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: source ~/.bashrc"
echo "2. Run: flyctl auth login"
echo "3. Create your apps and set up Tigris storage"
echo "4. Set your environment secrets"
echo "5. Deploy using npm run deploy:staging or npm run deploy:production"
echo ""
echo "🔗 For detailed instructions, see FLY_DEPLOYMENT_FIXES.md"