import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  onPhotosUploaded: (photos: string[]) => void;
  existingPhotos: string[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosUploaded, existingPhotos }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    setUploading(true);
    const newPhotos: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === files.length) {
              onPhotosUploaded([...existingPhotos, ...newPhotos]);
              setUploading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = existingPhotos.filter((_, i) => i !== index);
    onPhotosUploaded(updatedPhotos);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-birthday-pink bg-birthday-pink/5 scale-105'
            : 'border-birthday-pink/30 hover:border-birthday-pink hover:bg-birthday-pink/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-birthday-pink to-birthday-purple rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {uploading ? 'Téléchargement en cours...' : 'Ajoutez vos photos'}
            </h3>
            <p className="text-gray-600">
              Glissez-déposez vos photos ici ou cliquez pour les sélectionner
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Formats supportés: JPG, PNG, GIF, WEBP
            </p>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      {existingPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingPhotos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Add More Button */}
          <div
            className="aspect-square rounded-xl border-2 border-dashed border-birthday-pink/30 flex items-center justify-center cursor-pointer hover:border-birthday-pink hover:bg-birthday-pink/5 transition-colors"
            onClick={handleClick}
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-birthday-pink mx-auto mb-2" />
              <p className="text-sm text-gray-600">Ajouter plus</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;