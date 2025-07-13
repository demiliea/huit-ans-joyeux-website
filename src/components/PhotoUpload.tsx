import React, { useState, useCallback } from 'react';
import { Upload, Camera, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onUploadSuccess?: (photo: any) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUploadSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString()
  });
  const { toast } = useToast();

  const handleAuthentication = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/google');
      const data = await response.json();
      
      if (data.authUrl) {
        // Open authentication URL in a new window
        const authWindow = window.open(data.authUrl, 'google-auth', 'width=500,height=600');
        
        // Listen for authentication completion
        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            // Check if authentication was successful
            // In a real app, you'd handle this through message passing or redirect
            toast({
              title: "Authentication Required",
              description: "Please complete the authentication process and refresh the page",
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to start authentication process",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Auto-fill title if empty
        if (!formData.title) {
          setFormData(prev => ({
            ...prev,
            title: file.name.replace(/\.[^/.]+$/, '')
          }));
        }
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  }, [formData.title, toast]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('photo', selectedFile);
      uploadData.append('userId', userId);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('year', formData.year);

      const response = await fetch('http://localhost:3001/api/upload-photo', {
        method: 'POST',
        body: uploadData
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Upload Successful",
          description: "Photo uploaded to Google Photos and added to timeline",
        });
        
        // Reset form
        setSelectedFile(null);
        setFormData({
          title: '',
          description: '',
          year: new Date().getFullYear().toString()
        });
        
        // Notify parent component
        onUploadSuccess?.(result);
        
        // Reset file input
        const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, userId, formData, onUploadSuccess, toast]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Temporary authentication simulation (in production, implement proper OAuth flow)
  const handleTempAuth = useCallback(() => {
    setIsAuthenticated(true);
    setUserId('temp-user-id');
    toast({
      title: "Authentication Simulated",
      description: "Using temporary authentication for demo purposes",
    });
  }, [toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload to Google Photos
        </CardTitle>
        <CardDescription>
          Add photos to your Google Photos library and display them on the timeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isAuthenticated ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to authenticate with Google Photos before uploading photos.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button onClick={handleAuthentication} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Authenticate with Google Photos
              </Button>
              
              <Button 
                onClick={handleTempAuth} 
                variant="outline" 
                className="w-full"
              >
                Use Demo Mode (Temporary)
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Connected to Google Photos! You can now upload photos.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="photo-upload">Select Photo</Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter photo title"
                disabled={isUploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter photo description"
                disabled={isUploading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="Year"
                disabled={isUploading}
                min="1900"
                max="2100"
              />
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to Google Photos
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;