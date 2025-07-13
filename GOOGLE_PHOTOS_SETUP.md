# Google Photos API Setup Guide

This guide will help you set up Google Photos API integration for the Birthday Timeline App.

## Prerequisites

- Node.js (version 16 or higher)
- A Google Cloud Console account
- Basic knowledge of OAuth 2.0

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Create Project" or select an existing project
3. Give your project a name (e.g., "Birthday Timeline App")
4. Click "Create"

## Step 2: Enable Google Photos Library API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Photos Library API"
3. Click on "Photos Library API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required information:
     - App name: "Birthday Timeline App"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes:
     - `https://www.googleapis.com/auth/photoslibrary.appendonly`
     - `https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata`
4. For the OAuth client ID:
   - Application type: "Web application"
   - Name: "Birthday Timeline Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001`
   - Authorized redirect URIs:
     - `http://localhost:3001/auth/google/callback`
5. Click "Create"
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root directory of your project:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
   PORT=3001
   ```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Start the Application

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

## Step 7: Test the Integration

1. Open your browser and go to `http://localhost:3000`
2. Scroll down to the "Upload to Google Photos" section
3. Click "Authenticate with Google Photos"
4. Complete the OAuth flow
5. Try uploading a photo

## Understanding the Google Photos API Limitations

### Current API Restrictions (as of 2025)

- **App-created content only**: You can only manage photos and albums created by your app
- **No shared album writing**: Cannot write to existing shared albums via API
- **Timeline placement**: Photos uploaded via API will appear in the user's Google Photos timeline based on their upload date

### What This Means for Your App

1. **New Album Creation**: The app creates new albums for storing photos
2. **Timeline Integration**: Uploaded photos automatically appear in the Google Photos timeline
3. **Shared Album Reference**: The shared album URL you provided (`https://photos.app.goo.gl/XhXLN94pzY2U3wEp9`) can be used as inspiration but cannot be written to via API

### Workaround for Shared Albums

If you want to reference the shared album:
1. Use the provided shared album URL for inspiration/reference
2. Create a new album via the API for actual photo uploads
3. Users can manually add photos to the shared album if needed

## API Endpoints

### Authentication
- `GET /auth/google` - Get authentication URL
- `GET /auth/google/callback` - Handle OAuth callback

### Photo Management
- `POST /api/upload-photo` - Upload photo to Google Photos
- `GET /api/timeline` - Get timeline events
- `GET /api/albums` - List user's albums
- `POST /api/albums` - Create new album

### Health Check
- `GET /health` - Server health check

## Security Considerations

1. **Never commit credentials**: Keep your `.env` file in `.gitignore`
2. **Use HTTPS in production**: Configure proper SSL certificates
3. **Token storage**: In production, store tokens securely in a database
4. **Rate limiting**: Implement rate limiting for API endpoints

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check that your client ID and secret are correct
   - Verify the redirect URI matches exactly

2. **"Failed to upload photo"**
   - Ensure the user is authenticated
   - Check that the file is a valid image format
   - Verify API quotas haven't been exceeded

3. **"CORS errors"**
   - Make sure the backend server is running
   - Check that the frontend is making requests to the correct backend URL

### Debug Mode

Enable debug logging by adding to your `.env`:
```
DEBUG=true
```

## Production Deployment

For production deployment:

1. **Update redirect URIs** in Google Cloud Console
2. **Configure proper domain** in OAuth settings
3. **Use environment variables** for all sensitive data
4. **Implement proper database** for token storage
5. **Add error monitoring** and logging
6. **Configure HTTPS** for secure communication

## API Rate Limits

Google Photos API has the following limits:
- 10,000 requests per day
- 100 requests per 100 seconds per user

Plan your usage accordingly and implement proper error handling.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify your Google Cloud Console configuration
4. Ensure all dependencies are properly installed

## Additional Resources

- [Google Photos Library API Documentation](https://developers.google.com/photos/library)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## Timeline Photo Display

Once photos are uploaded:
1. They appear in the user's Google Photos library
2. They are automatically added to the timeline with the specified year
3. The timeline refreshes to show the new photos
4. Photos are displayed with their upload metadata

This integration provides a seamless way to combine personal photos with milestone events in a beautiful timeline format.