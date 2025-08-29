import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath } from 'lucide-react';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onHover?: (listing: Listing | null) => void;
  onFavorite?: (listing: Listing) => void;
  isFavorited?: boolean;
  className?: string;
  distance?: string;
}

export default function ListingCard({
  listing,
  onHover,
  onFavorite,
  isFavorited = false,
  className = '',
  distance
}: ListingCardProps) {
  const navigate = useNavigate();
  
  const handleMouseEnter = () => onHover?.(listing);
  const handleMouseLeave = () => onHover?.(null);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(listing);
  };

  const handleClick = () => {
    const slug = listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    navigate(`/listing/${listing.id}/${slug}`);
  };

  const getRoomTypeLabel = (roomType: string) => {
    switch (roomType) {
      case 'entire': return 'Entire Place';
      case 'private': return 'Private Room';
      case 'shared': return 'Shared Room';
      default: return roomType;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200">
        {listing.listing_photos?.[0]?.url ? (
          <img
            src={listing.listing_photos[0].url}
            alt={listing.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <Bed className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">No image</span>
            </div>
          </div>
        )}
        
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>

        {/* Room type badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
            {getRoomTypeLabel(listing.room_type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location and distance */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {[listing.city, listing.state].filter(Boolean).join(', ')}
          </span>
          {distance && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{distance}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {listing.title}
        </h3>

        {/* Description */}
        {listing.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Features */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {listing.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {listing.amenities && listing.amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {listing.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                >
                  {amenity.replace(/_/g, ' ')}
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{listing.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and availability */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(listing.price)}
              </span>
              <span className="text-gray-500">/mo</span>
            </div>
            {(listing.move_in || listing.move_out) && (
              <div className="text-xs text-gray-500 mt-1">
                Available {listing.move_in && new Date(listing.move_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {listing.move_in && listing.move_out && ' - '}
                {listing.move_out && new Date(listing.move_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
