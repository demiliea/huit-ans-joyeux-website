# Fly.io CI/CD Deployment Guide

This guide covers deploying the Birthday Timeline App using Fly.io's CI/CD capabilities instead of GitHub Actions.

## Why Fly.io CI/CD?

- **Simplified Infrastructure**: Everything runs on Fly.io's platform
- **Better Integration**: Direct integration with Tigris storage and Fly.io services
- **Cost Effective**: No need for separate CI/CD services
- **Global Deployment**: Deploy to multiple regions easily
- **Built-in Monitoring**: Integrated logs and metrics

## Prerequisites

1. **Fly.io CLI installed**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Fly.io Account**:
   ```bash
   flyctl auth signup  # or flyctl auth login
   ```

3. **Project Setup**:
   ```bash
   git clone <your-repo>
   cd birthday-timeline-tigris
   ```

## Deployment Environments

### 1. Development (Local)
```bash
npm run dev:full
```
- Runs locally with hot reload
- Uses local environment variables
- Perfect for rapid development

### 2. Staging
```bash
./scripts/deploy-staging.sh
```
- Deploys to `birthday-timeline-tigris-staging.fly.dev`
- Isolated environment for testing
- Separate Tigris storage bucket

### 3. Production
```bash
./scripts/deploy-production.sh
```
- Deploys to `birthday-timeline-tigris.fly.dev`
- Production-grade configuration
- Extra safety checks and confirmations

## Initial Setup

### 1. Create Your Apps

```bash
# Create production app
flyctl apps create birthday-timeline-tigris

# Create staging app
flyctl apps create birthday-timeline-tigris-staging
```

### 2. Set Up Tigris Storage

```bash
# Production storage
flyctl storage create --name tigris-storage

# Staging storage
flyctl storage create --name tigris-storage-staging --app birthday-timeline-tigris-staging
```

### 3. Configure Environment Variables

```bash
# Production secrets
flyctl secrets set \
  AWS_ACCESS_KEY_ID=your_access_key \
  AWS_SECRET_ACCESS_KEY=your_secret_key \
  BUCKET_NAME=your_bucket_name \
  --app birthday-timeline-tigris

# Staging secrets
flyctl secrets set \
  AWS_ACCESS_KEY_ID=your_staging_access_key \
  AWS_SECRET_ACCESS_KEY=your_staging_secret_key \
  BUCKET_NAME=your_staging_bucket_name \
  --app birthday-timeline-tigris-staging
```

## Deployment Process

### Staging Deployment

1. **Run the staging deployment**:
   ```bash
   ./scripts/deploy-staging.sh
   ```

2. **What it does**:
   - Builds the Docker image
   - Deploys to staging environment
   - Runs health checks
   - Verifies Tigris connectivity

3. **Test staging**:
   ```bash
   curl https://birthday-timeline-tigris-staging.fly.dev/health
   curl https://birthday-timeline-tigris-staging.fly.dev/api/test-tigris
   ```

### Production Deployment

1. **Run the production deployment**:
   ```bash
   ./scripts/deploy-production.sh
   ```

2. **Safety checks**:
   - Confirmation prompt
   - Staging health check
   - Test execution
   - Health verification

3. **Monitor deployment**:
   ```bash
   flyctl logs --app birthday-timeline-tigris
   flyctl status --app birthday-timeline-tigris
   ```

## Advanced Configuration

### Multi-Region Deployment

```bash
# Deploy to multiple regions
flyctl regions add fra lhr nrt --app birthday-timeline-tigris

# Scale across regions
flyctl scale count 2 --app birthday-timeline-tigris
```

### Environment-Specific Configuration

Create environment-specific fly.toml files:

```bash
# fly.staging.toml
cp fly.toml fly.staging.toml
# Edit for staging configuration

# fly.production.toml
cp fly.toml fly.production.toml
# Edit for production configuration
```

### Automated Testing

Add to your deployment scripts:

```bash
# Run tests before deployment
npm test
npm run lint
npm run build
```

## Monitoring and Debugging

### Real-time Logs

```bash
# Production logs
flyctl logs --app birthday-timeline-tigris

# Staging logs
flyctl logs --app birthday-timeline-tigris-staging
```

### Health Monitoring

```bash
# Check app status
flyctl status --app birthday-timeline-tigris

# Check resource usage
flyctl vm status --app birthday-timeline-tigris
```

### Performance Monitoring

```bash
# View metrics
flyctl metrics --app birthday-timeline-tigris

# Check database connections
flyctl storage list --app birthday-timeline-tigris
```

## Rollback Strategy

### Quick Rollback

```bash
# List recent deployments
flyctl releases --app birthday-timeline-tigris

# Rollback to previous version
flyctl releases rollback --app birthday-timeline-tigris
```

### Automated Rollback

Add to your deployment script:

```bash
# Store current version
CURRENT_VERSION=$(flyctl releases --app $APP_NAME -j | jq -r '.[0].version')

# Deploy new version
flyctl deploy --app $APP_NAME

# If health check fails, rollback
if ! curl -f "https://$APP_NAME.fly.dev/health"; then
    flyctl releases rollback --app $APP_NAME
    exit 1
fi
```

## Security Best Practices

### 1. Environment Variables

```bash
# Never commit secrets to git
# Use flyctl secrets instead
flyctl secrets set SECRET_KEY=value --app your-app
```

### 2. Network Security

```bash
# Use internal networking when possible
flyctl ips allocate-v6 --private --app your-app
```

### 3. Access Control

```bash
# Limit access to production apps
flyctl orgs members --org your-org
```

## Troubleshooting

### Common Issues

#### 1. Deployment Fails

```bash
# Check logs
flyctl logs --app birthday-timeline-tigris

# Check build logs
flyctl logs --app birthday-timeline-tigris --build
```

#### 2. Health Check Fails

```bash
# Check app status
flyctl status --app birthday-timeline-tigris

# SSH into running instance
flyctl ssh console --app birthday-timeline-tigris
```

#### 3. Tigris Connection Issues

```bash
# Test Tigris connectivity
curl https://your-app.fly.dev/api/test-tigris

# Check secrets
flyctl secrets list --app birthday-timeline-tigris
```

### Debug Commands

```bash
# SSH into running app
flyctl ssh console --app birthday-timeline-tigris

# View environment variables
flyctl ssh console --app birthday-timeline-tigris -C env

# Check disk usage
flyctl ssh console --app birthday-timeline-tigris -C df -h
```

## NPM Scripts Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "deploy:staging": "./scripts/deploy-staging.sh",
    "deploy:production": "./scripts/deploy-production.sh",
    "deploy:dev": "./scripts/deploy.sh",
    "logs:staging": "flyctl logs --app birthday-timeline-tigris-staging",
    "logs:production": "flyctl logs --app birthday-timeline-tigris",
    "status:staging": "flyctl status --app birthday-timeline-tigris-staging",
    "status:production": "flyctl status --app birthday-timeline-tigris"
  }
}
```

## Continuous Deployment Workflow

### 1. Development Flow

```bash
# Work on feature
git checkout -b feature/new-feature
# Make changes
npm run dev:full
# Test locally
npm test
# Commit changes
git commit -m "Add new feature"
```

### 2. Staging Flow

```bash
# Deploy to staging
npm run deploy:staging
# Test staging
curl https://birthday-timeline-tigris-staging.fly.dev/health
# Verify functionality
```

### 3. Production Flow

```bash
# Merge to main
git checkout main
git merge feature/new-feature
# Deploy to production
npm run deploy:production
# Monitor deployment
npm run logs:production
```

## Performance Optimization

### 1. Build Optimization

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["npm", "start"]
```

### 2. Caching Strategy

```bash
# Use build cache
flyctl deploy --build-cache

# Cache node_modules
flyctl deploy --cache-from
```

## Cost Optimization

### 1. Auto-scaling

```toml
# fly.toml
[http_service]
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

### 2. Resource Limits

```toml
# fly.toml
[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1
```

## Conclusion

Fly.io CI/CD provides a streamlined deployment process that:
- Eliminates the need for external CI/CD services
- Integrates seamlessly with Tigris storage
- Provides global deployment capabilities
- Includes built-in monitoring and debugging tools
- Offers cost-effective scaling options

The deployment scripts provided handle all the complexity while maintaining safety and reliability for production deployments.

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io CLI Reference](https://fly.io/docs/flyctl/)
- [Tigris Storage Guide](https://fly.io/docs/reference/tigris/)
- [Fly.io Community](https://community.fly.io/)

---

For questions or issues, check the [troubleshooting section](#troubleshooting) or visit the Fly.io community forums.