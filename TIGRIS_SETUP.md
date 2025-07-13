# Tigris Object Storage Setup Guide

This guide will help you set up Tigris object storage integration for the Birthday Timeline App using Fly.io.

## Prerequisites

- Node.js (version 16 or higher)
- A Fly.io account
- Basic understanding of object storage concepts

## What is Tigris?

Tigris is Fly.io's globally distributed object storage service that's S3-compatible. It provides:
- Global distribution for fast access worldwide
- Simple S3-compatible API
- Automatic scaling and redundancy
- Integration with Fly.io applications

## Step 1: Create a Fly.io Account

1. Go to [fly.io](https://fly.io)
2. Sign up for a new account or log in
3. Install the Fly CLI: `curl -L https://fly.io/install.sh | sh`
4. Authenticate: `fly auth login`

## Step 2: Create Tigris Storage

1. In your project directory, run:
   ```bash
   fly storage create
   ```

2. Choose a name for your storage bucket (or use the default)

3. Fly CLI will automatically set up the following environment variables:
   - `AWS_REGION`
   - `AWS_ENDPOINT_URL_S3`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `BUCKET_NAME`

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. The `.env` file should contain:
   ```
   AWS_REGION=auto
   AWS_ENDPOINT_URL_S3=https://fly-storage-api.tigris.dev
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   BUCKET_NAME=your_bucket_name_here
   PORT=3001
   ```

   **Note**: If you used `fly storage create`, these values are automatically configured in your Fly.io app.

## Step 4: Install Dependencies

```bash
npm install
```

## Step 5: Start the Application

1. Start the backend server:
   ```bash
   npm run backend
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Or start both at once:
   ```bash
   npm run dev:full
   ```

## Step 6: Test the Integration

1. Open your browser and go to `http://localhost:3000`
2. Scroll down to the "Upload to Tigris Storage" section
3. Click "Test Connection" to verify your Tigris setup
4. Try uploading a photo

## Understanding Tigris Features

### Global Distribution

- **Automatic Replication**: Photos are automatically replicated across multiple regions
- **Edge Caching**: Frequently accessed photos are cached at edge locations
- **Low Latency**: Users get fast access regardless of their location

### S3 Compatibility

- **Standard API**: Uses the same API as Amazon S3
- **Easy Migration**: Can easily switch between S3 and Tigris
- **Familiar Tools**: Works with existing S3 tools and libraries

### Integration Benefits

1. **No Authentication Complexity**: No OAuth flows or API keys to manage
2. **Automatic Scaling**: Handles any amount of photos automatically
3. **Global Performance**: Fast access from anywhere in the world
4. **Cost Effective**: Pay only for what you use

## API Endpoints

### Photo Management
- `POST /api/upload-photo` - Upload photo to Tigris
- `GET /api/timeline` - Get timeline events
- `GET /api/photo/:id` - Get photo with signed URL

### Health Check
- `GET /health` - Server health check
- `GET /api/test-tigris` - Test Tigris connection

## Security Considerations

1. **Environment Variables**: Never commit your `.env` file
2. **Signed URLs**: Photos are accessed via secure signed URLs
3. **Access Control**: Only your app can upload/manage photos
4. **HTTPS**: All communication is encrypted

## Troubleshooting

### Common Issues

1. **"Failed to connect to Tigris"**
   - Check your access keys in `.env`
   - Verify the endpoint URL is correct
   - Ensure your Fly.io account has Tigris enabled

2. **"Upload failed"**
   - Check that your bucket exists
   - Verify file size limits
   - Ensure proper permissions

3. **"Connection test failed"**
   - Verify all environment variables are set
   - Check network connectivity
   - Ensure credentials are valid

### Debug Mode

Enable debug logging by adding to your `.env`:
```
DEBUG=true
```

## Production Deployment

For production deployment on Fly.io:

1. **Deploy your app**:
   ```bash
   fly deploy
   ```

2. **Set environment variables**:
   ```bash
   fly secrets set AWS_ACCESS_KEY_ID=your_key
   fly secrets set AWS_SECRET_ACCESS_KEY=your_secret
   fly secrets set BUCKET_NAME=your_bucket
   ```

3. **Configure scaling**:
   ```bash
   fly scale count 2
   ```

## Advanced Configuration

### Custom Bucket Configuration

If you want to use a specific bucket name:

```bash
fly storage create --name my-photos-bucket
```

### Multiple Environments

For different environments (dev, staging, prod):

1. Create separate storage buckets
2. Use different environment variable sets
3. Deploy to different Fly.io apps

### Monitoring

Monitor your Tigris usage:

```bash
fly logs
fly status
```

## API Rate Limits

Tigris has generous rate limits:
- No specific limits for most operations
- Automatic scaling handles traffic spikes
- Global distribution reduces latency

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check server logs with `fly logs`
3. Verify Tigris configuration
4. Test connection with the test endpoint

## Additional Resources

- [Tigris Documentation](https://fly.io/docs/reference/tigris/)
- [Fly.io Documentation](https://fly.io/docs/)
- [S3 API Reference](https://docs.aws.amazon.com/s3/latest/API/)
- [Fly.io Community](https://community.fly.io/)

## Timeline Photo Display

Once photos are uploaded to Tigris:
1. They are stored globally with automatic replication
2. They are automatically added to the timeline with the specified year
3. The timeline refreshes to show new photos
4. Photos are accessible via secure signed URLs with global distribution

This integration provides a seamless way to combine personal photos with milestone events in a beautiful timeline format, with the performance benefits of Fly.io's global infrastructure.

## Cost Optimization

- **Pay per use**: Only pay for storage and bandwidth used
- **No minimum fees**: No upfront costs or minimum charges
- **Automatic cleanup**: Consider implementing cleanup for old photos
- **Efficient storage**: Images are stored efficiently with automatic compression

Tigris makes it easy to build globally distributed photo applications without the complexity of managing your own storage infrastructure!