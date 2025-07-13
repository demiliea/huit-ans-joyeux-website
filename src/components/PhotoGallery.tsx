
import React, { useState } from 'react';
import { Camera, Heart, Upload } from 'lucide-react';

const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  // Photos placeholder - vous pouvez les remplacer par les vraies photos
  const photos = [
    '/placeholder.svg?height=300&width=300&text=Souvenir+1',
    '/placeholder.svg?height=300&width=300&text=Souvenir+2',
    '/placeholder.svg?height=300&width=300&text=Souvenir+3',
    '/placeholder.svg?height=300&width=300&text=Souvenir+4',
    '/placeholder.svg?height=300&width=300&text=Souvenir+5',
    '/placeholder.svg?height=300&width=300&text=Souvenir+6'
  ];

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
            Tous ces moments précieux qui nous ont menés jusqu'à ce jour spécial !
          </p>
        </div>

        {/* Instructions pour ajouter des photos */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-birthday-pink/20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Upload className="w-6 h-6 text-birthday-purple" />
            <h3 className="text-lg font-semibold text-gray-800">
              Ajoutez vos photos de l'album Google Photos
            </h3>
          </div>
          <p className="text-gray-600 text-center">
            Téléchargez les photos de votre album Google Photos et remplacez les placeholders ci-dessous.
            Cliquez sur "Upload Images" dans l'éditeur Lovable pour commencer !
          </p>
        </div>

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
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;
