
import React, { useState, useEffect } from 'react';
import { Camera, Heart, Upload, Share2 } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  // Load photos from localStorage on component mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('birthday-photos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (error) {
        console.error('Error loading photos from localStorage:', error);
      }
    }
  }, []);

  // Save photos to localStorage whenever photos change
  useEffect(() => {
    localStorage.setItem('birthday-photos', JSON.stringify(photos));
  }, [photos]);

  const handlePhotosUploaded = (newPhotos: string[]) => {
    setPhotos(newPhotos);
    setShowUpload(false);
  };

  const shareGooglePhotos = () => {
    window.open('https://photos.app.goo.gl/XhXLN94pzY2U3wEp9', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-birthday-pink" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-birthday-pink to-birthday-purple bg-clip-text text-transparent">
              Galerie Souvenirs
            </h2>
            <Heart className="w-8 h-8 text-birthday-coral" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partagez vos plus beaux souvenirs et ajoutez vos photos pour cette journée spéciale !
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-birthday-pink to-birthday-purple text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {showUpload ? 'Masquer l\'upload' : 'Ajouter des photos'}
          </button>
          
          <button
            onClick={shareGooglePhotos}
            className="bg-white text-birthday-purple font-semibold py-3 px-6 rounded-xl border-2 border-birthday-purple hover:bg-birthday-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Voir l'album Google Photos
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-birthday-pink/20">
            <PhotoUpload onPhotosUploaded={handlePhotosUploaded} existingPhotos={photos} />
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedPhoto(index)}
              >
                <div className="aspect-square">
                  <img
                    src={photo}
                    alt={`Souvenir ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-20 h-20 text-birthday-pink mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Aucune photo pour le moment
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Commencez à créer votre galerie de souvenirs en ajoutant vos premières photos !
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-birthday-pink to-birthday-purple text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Ajouter des photos
            </button>
          </div>
        )}

        {/* Modal pour photo sélectionnée */}
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={photos[selectedPhoto]}
                alt={`Souvenir ${selectedPhoto + 1}`}
                className="w-full h-auto rounded-2xl shadow-2xl max-h-screen object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
                <p className="text-sm">Photo {selectedPhoto + 1} sur {photos.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;
