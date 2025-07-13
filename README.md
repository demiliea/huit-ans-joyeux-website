# Birthday Timeline App with Google Photos Integration

A beautiful birthday celebration app that integrates with Google Photos API to store and display photos on a dynamic timeline.

## Features

- **Google Photos Integration**: Upload photos directly to Google Photos
- **Dynamic Timeline**: Display photos on a chronological timeline
- **Photo Gallery**: Beautiful photo display with modal view
- **Wishes Section**: Collect birthday wishes and messages
- **Responsive Design**: Mobile-friendly layout
- **Real-time Updates**: Timeline automatically refreshes after photo uploads

## Google Photos API Integration

This app uses the Google Photos API to:
- Upload photos to your Google Photos library
- Create albums for organizing photos
- Display photos on the timeline with metadata
- Automatically add photos to the Google Photos timeline

### Important Notes

Due to recent Google Photos API changes (March 2025):
- Only app-created content can be managed
- Cannot write to existing shared albums via API
- Photos uploaded via API appear on the Google Photos timeline based on upload date
- The shared album URL you provided (`https://photos.app.goo.gl/XhXLN94pzY2U3wEp9`) can be used as reference but cannot be written to via API

## Quick Start

### 1. Setup Google Photos API

Follow the detailed setup guide in [GOOGLE_PHOTOS_SETUP.md](./GOOGLE_PHOTOS_SETUP.md)

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Google Photos API credentials
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
npm run backend  # Backend server (port 3001)
npm run dev      # Frontend (port 3000)
```

### 5. Use the App

1. Open `http://localhost:3000`
2. Scroll to "Upload to Google Photos" section
3. Authenticate with Google Photos
4. Upload photos with title, description, and year
5. Watch them appear on the timeline!

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── PhotoUpload.tsx      # Google Photos upload component
│   │   ├── Timeline.tsx         # Dynamic timeline with photos
│   │   ├── PhotoGallery.tsx     # Photo gallery display
│   │   └── ...
│   └── pages/
│       └── Index.tsx            # Main page
├── server/
│   └── index.ts                 # Backend server with Google Photos API
├── .env.example                 # Environment variables template
├── GOOGLE_PHOTOS_SETUP.md       # Detailed setup guide
└── README.md                    # This file
```

## API Endpoints

- `GET /auth/google` - Get authentication URL
- `GET /auth/google/callback` - Handle OAuth callback
- `POST /api/upload-photo` - Upload photo to Google Photos
- `GET /api/timeline` - Get timeline events
- `GET /api/albums` - List user's albums
- `POST /api/albums` - Create new album

## How It Works

1. **Authentication**: Users authenticate with Google Photos via OAuth 2.0
2. **Photo Upload**: Photos are uploaded to Google Photos using the Library API
3. **Timeline Integration**: Uploaded photos are automatically added to the timeline
4. **Real-time Updates**: The timeline refreshes to show new photos
5. **Google Photos Timeline**: Photos appear in the user's Google Photos timeline

## Features in Detail

### Photo Upload Component
- File selection with validation
- Form for title, description, and year
- Progress indicators
- Error handling

### Dynamic Timeline
- Chronological display of events
- Photo integration with metadata
- Automatic sorting by year
- Responsive design

### Google Photos Integration
- OAuth 2.0 authentication
- Photo upload to Google Photos
- Album creation and management
- Timeline placement

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **APIs**: Google Photos Library API, Google OAuth 2.0
- **Build Tools**: Vite, ESLint

## Production Deployment

For production:
1. Update Google Cloud Console with production URLs
2. Configure proper environment variables
3. Implement database for token storage
4. Add error monitoring
5. Configure HTTPS

## Support

If you encounter issues:
1. Check the [setup guide](./GOOGLE_PHOTOS_SETUP.md)
2. Verify your Google Cloud Console configuration
3. Check browser console and server logs
4. Ensure all dependencies are installed

## License

This project is for demonstration purposes. Please comply with Google Photos API Terms of Service.

---

Enjoy your birthday celebration with beautiful photo memories! 🎉📸
