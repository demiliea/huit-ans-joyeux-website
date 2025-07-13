# GitHub Pages CI/CD Setup

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages whenever code is pushed to the `main` branch.

## Setup Instructions

### 1. Enable GitHub Pages in your repository

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy your site

### 2. Configure base path (if needed)

If your repository name is not the root domain (e.g., `https://username.github.io/repository-name`), you may need to update the `vite.config.ts` file to include the base path:

```typescript
export default defineConfig(({ mode }) => ({
  base: '/your-repository-name/', // Add this line
  server: {
    host: "::",
    port: 8080,
  },
  // ... rest of config
}));
```

### 3. Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) will:

- **Trigger**: Run on push to `main` branch and pull requests
- **Build**: Install dependencies and build the project using `npm run build`
- **Deploy**: Deploy the built files from the `dist` folder to GitHub Pages

### 4. Branch Protection (Optional)

For production deployments, consider:
- Making `main` a protected branch
- Requiring pull request reviews before merging
- Requiring status checks to pass before merging

### 5. Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file to the `public` directory with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use the custom domain

## Troubleshooting

- **Build fails**: Check the Actions tab for detailed error logs
- **404 errors**: Ensure the base path is correctly configured
- **Assets not loading**: Verify all asset paths are relative or use the correct base path

## Workflow Status

You can monitor deployment status in the **Actions** tab of your GitHub repository.