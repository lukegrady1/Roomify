import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share, Heart, Star, MapPin, Bed, Bath, Wifi, Car, Coffee, Zap, Waves, Dumbbell, PawPrint, Home } from 'lucide-react';
import Navbar from '../components/Navbar';
import PhotoGrid from '../components/PhotoGrid';
import Map from '../components/Map';
import type { Listing, ListingPhoto } from '../types';

// Mock listing data (in real app, this would come from API/Supabase)
const MOCK_LISTINGS_DATA: Record<string, Listing & { listing_photos: ListingPhoto[] }> = {
  '1': {
  id: '1',
  user_id: 'user1',
  title: 'Cozy Studio Apartment Near Harvard University',
  description: 'Beautiful and modern studio apartment located just 10 minutes walk from Harvard Yard. This recently renovated space features high ceilings, large windows with plenty of natural light, and modern amenities. Perfect for graduate students or young professionals looking for comfortable living near campus.\n\nThe apartment includes a full kitchen with stainless steel appliances, in-unit laundry, and fast WiFi. The building offers 24/7 security and a fitness center. Located in a safe and vibrant neighborhood with easy access to restaurants, cafes, and public transportation.',
  price: 2400,
  room_type: 'entire',
  bedrooms: 1,
  bathrooms: 1,
  city: 'Cambridge',
  state: 'MA',
  address_line1: '123 Harvard Street',
  lat: 42.3744,
  lng: -71.1169,
  move_in: '2025-01-01',
  move_out: '2025-08-31',
  amenities: ['wifi', 'laundry', 'furnished', 'utilities_included', 'gym', 'parking'],
  created_at: '2024-01-01',
  listing_photos: [
    {
      id: '1',
      listing_id: '1',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      position: 0
    },
    {
      id: '2', 
      listing_id: '1',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      position: 1
    },
    {
      id: '3',
      listing_id: '1', 
      url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
      position: 2
    },
    {
      id: '4',
      listing_id: '1',
      url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800', 
      position: 3
    },
    {
      id: '5',
      listing_id: '1',
      url: 'https://images.unsplash.com/photo-1574320924047-ee3cf2a5beea?w=800',
      position: 4
    }
  ]
  },
  '2': {
    id: '2',
    user_id: 'user2',
    title: 'Shared Room in MIT Area',
    description: 'Great shared accommodation with other graduate students. Close to MIT campus and public transportation. The house features a modern kitchen, study areas, and a great community atmosphere. Perfect for students looking for an affordable and social living experience.\n\nLocated in the heart of Cambridge, this shared room offers easy access to MIT, Harvard, and downtown Boston. The house includes high-speed internet, utilities, and access to common areas including a living room and fully equipped kitchen.',
    price: 1200,
    room_type: 'shared',
    bedrooms: 4,
    bathrooms: 2,
    city: 'Cambridge',
    state: 'MA',
    address_line1: '456 MIT Avenue',
    lat: 42.3601,
    lng: -71.0942,
    move_in: '2025-02-01',
    move_out: '2025-07-31',
    amenities: ['wifi', 'kitchen', 'parking', 'utilities_included'],
    created_at: '2024-01-02',
    listing_photos: [
      {
        id: '6',
        listing_id: '2',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        position: 0
      },
      {
        id: '7',
        listing_id: '2',
        url: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
        position: 1
      }
    ]
  },
  '3': {
    id: '3',
    user_id: 'user3',
    title: 'Private Room Boston University',
    description: 'Private bedroom in shared house. Walking distance to BU campus. Great for students looking for privacy while still enjoying a community environment.\n\nThis spacious room comes fully furnished with a comfortable bed, desk, and plenty of storage. The house features common areas, laundry facilities, and is located in a safe, student-friendly neighborhood.',
    price: 1800,
    room_type: 'private',
    bedrooms: 1,
    bathrooms: 1,
    city: 'Boston',
    state: 'MA',
    address_line1: '789 BU Boulevard',
    lat: 42.3505,
    lng: -71.1054,
    move_in: '2025-01-15',
    move_out: '2025-12-15',
    amenities: ['wifi', 'laundry', 'utilities_included', 'furnished'],
    created_at: '2024-01-03',
    listing_photos: [
      {
        id: '8',
        listing_id: '3',
        url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800',
        position: 0
      }
    ]
  }
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  kitchen: Coffee,
  utilities_included: Zap,
  pool: Waves,
  gym: Dumbbell,
  pets_allowed: PawPrint,
  furnished: Home
};

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // In a real app, you would fetch the listing data based on the ID from Supabase
  const listing = id ? MOCK_LISTINGS_DATA[id] : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAmenity = (amenity: string) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoomTypeLabel = (roomType: string) => {
    switch (roomType) {
      case 'entire': return 'Entire Place';
      case 'private': return 'Private Room';
      case 'shared': return 'Shared Room';
      default: return roomType;
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
            <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/search')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Share className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isFavorited ? 'text-red-600 bg-red-50' : 'hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Photo Grid */}
        <PhotoGrid 
          photos={listing.listing_photos}
          title={listing.title}
          className="mb-8"
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                {listing.city}, {listing.state}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  {getRoomTypeLabel(listing.room_type)}
                </div>
                {listing.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="border-b pb-6 mb-6">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="border-b pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  What this place offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.amenities.map((amenity, index) => {
                    const Icon = AMENITY_ICONS[amenity] || Home;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{formatAmenity(amenity)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Availability */}
            {(listing.move_in || listing.move_out) && (
              <div className="border-b pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Availability
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listing.move_in && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Available from</div>
                        <div className="font-medium">
                          {new Date(listing.move_in).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                    {listing.move_out && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Available until</div>
                        <div className="font-medium">
                          {new Date(listing.move_out).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Where you'll be
              </h2>
              {listing.lat && listing.lng && (
                <div className="rounded-lg overflow-hidden">
                  <Map
                    listings={[listing]}
                    center={{ lat: listing.lat, lng: listing.lng }}
                    zoom={15}
                    className="h-96"
                  />
                </div>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <div className="font-medium text-gray-900">{listing.address_line1}</div>
                <div>{listing.city}, {listing.state}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              {/* Price */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Lister
                </button>

                {showContactForm && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hi, I'm interested in this listing..."
                      />
                    </div>
                    <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Send Message
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  You won't be charged yet
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Guest favorite</span>
                </div>
                <div>
                  <span className="font-medium">Free cancellation</span> before move-in date
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;