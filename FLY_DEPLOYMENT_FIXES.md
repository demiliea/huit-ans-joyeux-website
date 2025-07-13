# Fly.io Deployment Fixes

This document addresses the deployment issues identified in the Birthday Timeline App.

## Issues Identified and Fixed

### 1. flyctl CLI Installation
**Issue**: flyctl was not installed
**Fix**: Install flyctl and add to PATH

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Add to PATH (add to ~/.bashrc or ~/.zshrc for persistence)
export FLYCTL_INSTALL="/home/ubuntu/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

### 2. Authentication Issues
**Issue**: Not authenticated with fly.io
**Fix**: Login to fly.io

```bash
# Login to fly.io
flyctl auth login

# Or signup if new user
flyctl auth signup
```

### 3. Dockerfile Issues
**Issue**: Missing curl for health checks
**Fix**: Updated Dockerfile with curl installation

### 4. Environment Variables
**Issue**: Missing or incorrect environment variables
**Fix**: Ensure all required secrets are set

### 5. Build Process Issues
**Issue**: Vite build output not properly served
**Fix**: Updated server to serve static files correctly

## Step-by-Step Fix Process

### Step 1: Install and Setup flyctl
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Add to PATH
export FLYCTL_INSTALL="/home/ubuntu/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Make PATH persistent
echo 'export FLYCTL_INSTALL="/home/ubuntu/.fly"' >> ~/.bashrc
echo 'export PATH="$FLYCTL_INSTALL/bin:$PATH"' >> ~/.bashrc
```

### Step 2: Authenticate with fly.io
```bash
# Login (this will open browser)
flyctl auth login
```

### Step 3: Create Apps (if they don't exist)
```bash
# Create production app
flyctl apps create birthday-timeline-tigris --org personal

# Create staging app
flyctl apps create birthday-timeline-tigris-staging --org personal
```

### Step 4: Set Up Tigris Storage
```bash
# Production storage
flyctl storage create --name tigris-storage --app birthday-timeline-tigris

# Staging storage
flyctl storage create --name tigris-storage-staging --app birthday-timeline-tigris-staging
```

### Step 5: Configure Secrets
```bash
# Production secrets
flyctl secrets set \
  AWS_ACCESS_KEY_ID=your_tigris_access_key \
  AWS_SECRET_ACCESS_KEY=your_tigris_secret_key \
  BUCKET_NAME=birthday-timeline-prod \
  AWS_REGION=auto \
  AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev \
  --app birthday-timeline-tigris

# Staging secrets
flyctl secrets set \
  AWS_ACCESS_KEY_ID=your_tigris_access_key \
  AWS_SECRET_ACCESS_KEY=your_tigris_secret_key \
  BUCKET_NAME=birthday-timeline-staging \
  AWS_REGION=auto \
  AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev \
  --app birthday-timeline-tigris-staging
```

### Step 6: Test Deployments
```bash
# Test staging deployment
npm run deploy:staging

# Test production deployment
npm run deploy:production
```

## Additional Fixes Made

### 1. Updated Dockerfile
- Added curl for health checks
- Improved multi-stage build process
- Fixed static file serving

### 2. Updated Server Configuration
- Added proper static file serving
- Fixed health check endpoint
- Improved error handling

### 3. Updated fly.toml
- Fixed internal port configuration
- Added proper health check path
- Improved resource allocation

### 4. Updated Deployment Scripts
- Added better error handling
- Fixed app creation logic
- Improved health check verification

## Environment Variables Required

### Production
- `AWS_ACCESS_KEY_ID`: Tigris access key
- `AWS_SECRET_ACCESS_KEY`: Tigris secret key
- `BUCKET_NAME`: Tigris bucket name for production
- `AWS_REGION`: auto
- `AWS_ENDPOINT_URL_S3`: https://fly.storage.tigris.dev

### Staging
- Same as production but with different bucket name

## Troubleshooting

### Common Issues and Solutions

1. **flyctl command not found**
   - Solution: Install flyctl and add to PATH

2. **Authentication timeout**
   - Solution: Run `flyctl auth login` and complete browser authentication

3. **App already exists**
   - Solution: Use existing app or choose different name

4. **Tigris connection fails**
   - Solution: Verify secrets are set correctly and Tigris storage is created

5. **Health check fails**
   - Solution: Check server logs with `flyctl logs --app your-app`

### Verification Commands

```bash
# Check authentication
flyctl auth whoami

# List apps
flyctl apps list

# Check app status
flyctl status --app birthday-timeline-tigris

# View logs
flyctl logs --app birthday-timeline-tigris

# Check secrets
flyctl secrets list --app birthday-timeline-tigris
```

## Next Steps

1. Complete authentication setup
2. Create or verify app existence
3. Configure Tigris storage
4. Set environment variables
5. Test deployments
6. Monitor and debug as needed

This comprehensive fix should resolve all deployment issues and get the Birthday Timeline App running successfully on fly.io.