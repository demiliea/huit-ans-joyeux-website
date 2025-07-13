import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Google Photos API configuration
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Scopes for Google Photos API
const SCOPES = [
  'https://www.googleapis.com/auth/photoslibrary.appendonly',
  'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata'
];

// Store for user tokens (in production, use a proper database)
const userTokens = new Map<string, any>();

// Types
interface PhotoUploadResponse {
  mediaItemId: string;
  productUrl: string;
  filename: string;
  uploadTime: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  photoUrl?: string;
  mediaItemId?: string;
  createdAt: string;
}

// In-memory storage for timeline events (in production, use a database)
const timelineEvents: TimelineEvent[] = [];

// Authentication routes
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true
  });
  
  res.json({ authUrl });
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    const { tokens } = await oauth2Client.getAccessToken(code as string);
    oauth2Client.setCredentials(tokens);
    
    // Store tokens (in production, associate with user ID)
    const userId = uuidv4();
    userTokens.set(userId, tokens);
    
    res.json({ 
      success: true, 
      userId,
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Photo upload endpoint
app.post('/api/upload-photo', upload.single('photo'), async (req, res) => {
  const { userId, title, description, year } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  if (!userId || !userTokens.has(userId)) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const tokens = userTokens.get(userId);
    oauth2Client.setCredentials(tokens);

    // Upload to Google Photos
    const uploadResponse = await uploadToGooglePhotos(file.buffer, file.originalname);
    
    // Create media item
    const mediaItem = await createMediaItem(uploadResponse.uploadToken, file.originalname);
    
    // Add to timeline
    const timelineEvent: TimelineEvent = {
      id: uuidv4(),
      year: year || new Date().getFullYear().toString(),
      title: title || 'Photo Upload',
      description: description || 'Photo uploaded to Google Photos',
      photoUrl: mediaItem.baseUrl,
      mediaItemId: mediaItem.id,
      createdAt: new Date().toISOString()
    };
    
    timelineEvents.push(timelineEvent);
    
    res.json({
      success: true,
      mediaItem,
      timelineEvent,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Get timeline events
app.get('/api/timeline', (req, res) => {
  const sortedEvents = timelineEvents.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  res.json(sortedEvents);
});

// Get user's albums
app.get('/api/albums', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId || !userTokens.has(userId as string)) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const tokens = userTokens.get(userId as string);
    oauth2Client.setCredentials(tokens);
    
    const albums = await listAlbums();
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// Create album
app.post('/api/albums', async (req, res) => {
  const { userId, title } = req.body;
  
  if (!userId || !userTokens.has(userId)) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const tokens = userTokens.get(userId);
    oauth2Client.setCredentials(tokens);
    
    const album = await createAlbum(title);
    res.json(album);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Helper functions
async function uploadToGooglePhotos(fileBuffer: Buffer, filename: string): Promise<{ uploadToken: string }> {
  const token = oauth2Client.credentials.access_token;
  
  const response = await axios.post(
    'https://photoslibrary.googleapis.com/v1/uploads',
    fileBuffer,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-File-Name': filename,
        'X-Goog-Upload-Protocol': 'raw'
      }
    }
  );

  return { uploadToken: response.data };
}

async function createMediaItem(uploadToken: string, filename: string) {
  const token = oauth2Client.credentials.access_token;
  
  const response = await axios.post(
    'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
    {
      newMediaItems: [{
        description: `Uploaded via Birthday Timeline App`,
        simpleMediaItem: {
          fileName: filename,
          uploadToken: uploadToken
        }
      }]
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.newMediaItemResults[0].mediaItem;
}

async function listAlbums() {
  const token = oauth2Client.credentials.access_token;
  
  const response = await axios.get(
    'https://photoslibrary.googleapis.com/v1/albums',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  return response.data.albums || [];
}

async function createAlbum(title: string) {
  const token = oauth2Client.credentials.access_token;
  
  const response = await axios.post(
    'https://photoslibrary.googleapis.com/v1/albums',
    {
      album: {
        title: title
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Make sure to set up your Google Photos API credentials in .env file`);
});