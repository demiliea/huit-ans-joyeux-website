# Birthday Timeline App with Tigris Storage

A beautiful birthday celebration app that integrates with Fly.io's Tigris object storage to store and display photos on a dynamic timeline.

## Features

- **Tigris Storage Integration**: Upload photos directly to Fly.io's globally distributed object storage
- **Dynamic Timeline**: Display photos and events chronologically
- **Photo Management**: Upload, store, and retrieve photos with metadata
- **Responsive Design**: Beautiful UI that works on all devices
- **Automatically add photos to the timeline with year information

## Tigris Object Storage Integration

This app uses Fly.io's Tigris object storage to:
- Store photos in globally distributed storage
- Provide fast access to photos worldwide
- Generate secure URLs for photo access
- Automatically handle photo uploads and retrieval

### Key Benefits of Tigris

Due to Tigris being globally distributed:
- Photos are stored in multiple regions for fast access
- No complex authentication required
- Photos are automatically cached globally
- Simple S3-compatible API

### 1. Setup Tigris Storage

Follow the setup guide in [TIGRIS_SETUP.md](./TIGRIS_SETUP.md)

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your Tigris credentials
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
# Start backend server
npm run backend

# Start frontend (in another terminal)
npm run dev

# Or start both at once
npm run dev:full
```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Scroll to "Upload to Tigris Storage" section
3. Select a photo, add title, description, and year
4. Click "Upload to Tigris Storage"
5. View your photo on the timeline

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── PhotoUpload.tsx      # Tigris upload component
│   │   ├── Timeline.tsx         # Timeline display
│   │   └── PhotoGallery.tsx     # Photo gallery
│   └── App.tsx                  # Main app component
├── server/
│   └── index.ts                 # Backend server with Tigris integration
├── public/
├── TIGRIS_SETUP.md              # Detailed setup guide
└── README.md                    # This file
```

## API Endpoints

### Photo Management
- `POST /api/upload-photo` - Upload photo to Tigris
- `GET /api/timeline` - Get timeline events
- `GET /api/photo/:id` - Get photo with signed URL

### Health Check
- `GET /health` - Server health check
- `GET /api/test-tigris` - Test Tigris connection

## Architecture

1. **Frontend**: React app with file upload interface
2. **Backend**: Express server handling Tigris API calls
3. **Storage**: Tigris object storage for photo files
4. **Timeline**: In-memory storage for timeline events (use database in production)

### Tigris Integration

- Photo upload to Tigris with metadata
- Secure signed URLs for photo access
- Global distribution for fast access

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Storage**: Fly.io Tigris Object Storage (S3-compatible)
- **UI Components**: Radix UI, Lucide Icons

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Deployment

This app is designed to run on Fly.io with Tigris storage:

1. Set up Tigris storage: `fly storage create`
2. Deploy the app: `fly deploy`
3. Environment variables are automatically configured

## Troubleshooting

### Common Issues

1. **"Failed to upload photo"**
   - Check Tigris credentials in .env
   - Verify bucket exists
   - Test connection with `/api/test-tigris`

2. **"Connection failed"**
   - Ensure Tigris endpoint is correct
   - Check access keys and permissions

3. **"CORS errors"**
   - Make sure backend server is running
   - Check frontend is making requests to correct backend URL

### Debug Mode

Enable debug logging by adding to your `.env`:
```
DEBUG=true
```

## Production Considerations

For production deployment:

1. **Use database** for timeline storage instead of in-memory
2. **Configure proper CORS** for your domain
3. **Set up monitoring** and logging
4. **Use environment variables** for all configuration
5. **Consider CDN** for additional performance (though Tigris is already global)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check server logs
3. Verify Tigris configuration
4. Test connection with the test endpoint

## Additional Resources

- [Tigris Documentation](https://fly.io/docs/reference/tigris/)
- [Fly.io Documentation](https://fly.io/docs/)
- [S3 API Reference](https://docs.aws.amazon.com/s3/latest/API/)

## Timeline Photo Display

Once photos are uploaded:
1. They are stored in Tigris with global distribution
2. They are automatically added to the timeline with the specified year
3. The timeline refreshes to show new photos
4. Photos are accessible via secure signed URLs

This integration provides a seamless way to combine personal photos with milestone events in a beautiful timeline format, with the performance benefits of global distribution.
