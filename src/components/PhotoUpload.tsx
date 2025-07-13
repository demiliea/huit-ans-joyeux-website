import React, { useState, useCallback } from 'react';
import { Upload, Camera, Check, AlertCircle, Cloud } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString()
  });
  const { toast } = useToast();

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
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('photo', selectedFile);
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
          description: "Photo uploaded to Tigris storage and added to timeline",
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
  }, [selectedFile, formData, onUploadSuccess, toast]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test-tigris');
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Connection Test Successful",
          description: `Connected to Tigris bucket: ${result.bucket}`,
        });
      } else {
        throw new Error(result.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Tigris",
        variant: "destructive"
      });
    }
  }, [toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Upload to Tigris Storage
        </CardTitle>
        <CardDescription>
          Upload photos to Fly.io's global Tigris storage and display them on the timeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Cloud className="h-4 w-4" />
          <AlertDescription>
            Photos will be stored in Tigris, Fly.io's globally distributed object storage. No authentication required!
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={testConnection} 
              variant="outline"
              className="flex-1"
            >
              Test Connection
            </Button>
          </div>

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
                Uploading to Tigris...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload to Tigris Storage
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;