import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Tigris S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || 'https://fly.storage.tigris.dev',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.BUCKET_NAME || 'photos';

// Types
interface PhotoUploadResponse {
  id: string;
  url: string;
  filename: string;
  uploadTime: string;
}

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  photoUrl?: string;
  photoId?: string;
  createdAt: string;
}

// In-memory storage for timeline events (in production, use a database)
const timelineEvents: TimelineEvent[] = [];

// Photo upload endpoint
app.post('/api/upload-photo', upload.single('photo'), async (req, res) => {
  const { title, description, year } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const key = `photos/${uniqueFilename}`;

    // Upload to Tigris
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadTime: new Date().toISOString(),
        title: title || 'Photo Upload',
        description: description || 'Photo uploaded via Birthday Timeline App',
        year: year || new Date().getFullYear().toString(),
      },
    });

    await s3Client.send(uploadCommand);

    // Generate signed URL for access
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 * 24 * 365 }); // 1 year expiry

    // Create timeline event
    const timelineEvent: TimelineEvent = {
      id: uuidv4(),
      year: year || new Date().getFullYear().toString(),
      title: title || 'Photo Upload',
      description: description || 'Photo uploaded to Tigris storage',
      photoUrl: signedUrl,
      photoId: uniqueFilename,
      createdAt: new Date().toISOString(),
    };

    timelineEvents.push(timelineEvent);

    const response: PhotoUploadResponse = {
      id: uniqueFilename,
      url: signedUrl,
      filename: file.originalname,
      uploadTime: new Date().toISOString(),
    };

    res.json({
      success: true,
      photo: response,
      timelineEvent,
      message: 'Photo uploaded successfully to Tigris',
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

// Get photo by ID with signed URL
app.get('/api/photo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const key = `photos/${id}`;
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });

    res.json({
      success: true,
      url: signedUrl,
      id,
    });
  } catch (error) {
    console.error('Error getting photo:', error);
    res.status(500).json({ error: 'Failed to get photo' });
  }
});

// Test Tigris connection
app.get('/api/test-tigris', async (req, res) => {
  try {
    // Test if we can connect to Tigris
    const testKey = 'test-connection';
    const testCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: 'test',
    });

    await s3Client.send(testCommand);
    
    res.json({
      success: true,
      message: 'Tigris connection successful',
      bucket: BUCKET_NAME,
      endpoint: process.env.AWS_ENDPOINT_URL_S3 || 'https://fly.storage.tigris.dev',
    });
  } catch (error) {
    console.error('Tigris connection error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to Tigris',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Tigris bucket: ${BUCKET_NAME}`);
  console.log(`Tigris endpoint: ${process.env.AWS_ENDPOINT_URL_S3 || 'https://fly.storage.tigris.dev'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});