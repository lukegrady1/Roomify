import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { ListingPhoto } from '../types';

interface PhotoGridProps {
  photos: ListingPhoto[];
  title: string;
  className?: string;
}

export default function PhotoGrid({ photos, title, className = '' }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // If no photos, show placeholder
  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center p-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No photos available</p>
        </div>
      </div>
    );
  }

  const mainPhoto = photos[0];
  const additionalPhotos = photos.slice(1, 5); // Show up to 4 additional photos

  return (
    <>
      <div className={`grid gap-2 ${className}`}>
        {/* Main photo */}
        <div 
          className="relative cursor-pointer group rounded-xl overflow-hidden"
          style={{ gridArea: photos.length === 1 ? 'span 1' : 'main' }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={mainPhoto.url}
            alt={`${title} - Photo 1`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            style={{ aspectRatio: photos.length === 1 ? '16/9' : '2/1' }}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
        </div>

        {/* Additional photos grid */}
        {additionalPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {additionalPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative cursor-pointer group rounded-lg overflow-hidden aspect-square"
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={photo.url}
                  alt={`${title} - Photo ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                
                {/* Show "View all X photos" on last image if there are more */}
                {index === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{photos.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View all photos button for mobile/small grids */}
        {photos.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="lg:hidden mt-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            View all {photos.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black"
          onKeyDown={handleKeyPress}
          tabIndex={0}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="text-sm">
                {currentImageIndex + 1} / {photos.length}
              </div>
              <button
                onClick={closeLightbox}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="absolute inset-0 flex items-center justify-center p-4 pt-16 pb-16">
            <img
              src={photos[currentImageIndex].url}
              alt={`${title} - Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-white shadow-lg'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  );
}
