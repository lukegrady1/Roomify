import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Upload, X, Calendar, DollarSign, Wifi, Car, Coffee, Zap, Waves, Dumbbell, PawPrint, Home as HomeIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, isSupabaseReady, mockAuthUser } from '../lib/supabase';

// Step components
const BasicsStep = ({ data, updateData, errors }: any) => {
  const roomTypes = [
    {
      value: 'entire',
      title: 'Entire place',
      description: 'Guests have the whole place to themselves'
    },
    {
      value: 'private',
      title: 'Private room',
      description: 'Guests have their own room in a shared place'
    },
    {
      value: 'shared',
      title: 'Shared room',
      description: 'Guests share a room with others'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Tell us about your place</h3>
        <p className="text-gray-600 mb-6">
          Help guests find and understand your space with accurate details.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Cozy studio apartment near campus"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={100}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {data.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Describe your space, what makes it special, and what guests can expect..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {data.description.length}/1000 characters
        </p>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What type of place will guests have?
        </label>
        <div className="grid gap-3">
          {roomTypes.map((type) => (
            <label
              key={type.value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                data.room_type === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="room_type"
                value={type.value}
                checked={data.room_type === type.value}
                onChange={(e) => updateData({ room_type: e.target.value as any })}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{type.title}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
              {data.room_type === type.value && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <select
            value={data.bedrooms}
            onChange={(e) => updateData({ bedrooms: parseInt(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.bedrooms ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} bedroom{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
          {errors.bedrooms && (
            <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <select
            value={data.bathrooms}
            onChange={(e) => updateData({ bathrooms: parseFloat(e.target.value) })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.bathrooms ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
              <option key={num} value={num}>{num} bathroom{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
          )}
        </div>
      </div>
    </div>
  );
};
const LocationStep = ({ data, updateData, errors }: any) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');

  const handleGeocode = async () => {
    const fullAddress = `${data.address_line1} ${data.address_line2} ${data.city}, ${data.state} ${data.postal_code}`.trim();
    
    if (!fullAddress || !data.city || !data.state) {
      setGeocodeError('Please fill in the address fields first');
      return;
    }

    setIsGeocoding(true);
    setGeocodeError('');

    try {
      // For now, we'll just simulate geocoding since we don't have Google Places API key in dev
      // In production, this would use Google Geocoding API
      const mockCoordinates = {
        lat: 42.3601 + (Math.random() - 0.5) * 0.01, // Random coords around Cambridge, MA
        lng: -71.0942 + (Math.random() - 0.5) * 0.01
      };

      updateData(mockCoordinates);
      setGeocodeError('');
    } catch (error) {
      setGeocodeError('Unable to geocode address. Please check the address and try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Where is your place located?</h3>
        <p className="text-gray-600 mb-6">
          Your address is only shared with guests after they've made a reservation.
        </p>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street address *
        </label>
        <input
          type="text"
          value={data.address_line1}
          onChange={(e) => updateData({ address_line1: e.target.value })}
          placeholder="123 Main Street"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.address_line1 ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.address_line1 && (
          <p className="mt-1 text-sm text-red-600">{errors.address_line1}</p>
        )}
      </div>

      {/* Apartment/Unit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          value={data.address_line2}
          onChange={(e) => updateData({ address_line2: e.target.value })}
          placeholder="Apt 4B"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            placeholder="Boston"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.state ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select state</option>
            {stateOptions.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP code (optional)
          </label>
          <input
            type="text"
            value={data.postal_code}
            onChange={(e) => updateData({ postal_code: e.target.value })}
            placeholder="02138"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleGeocode}
            disabled={isGeocoding}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeocoding ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2" />
                Getting coordinates...
              </div>
            ) : (
              'Get coordinates'
            )}
          </button>
        </div>
      </div>

      {/* Coordinates display */}
      {(data.lat && data.lng) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-green-700">
              Location confirmed: {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
            </span>
          </div>
        </div>
      )}

      {geocodeError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {geocodeError}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Privacy note</h4>
        <p className="text-sm text-blue-700">
          Your exact address won't be shared with guests until after they book. 
          We'll show the general area on the map to help them find your neighborhood.
        </p>
      </div>
    </div>
  );
};
const PhotosStep = ({ data, updateData, errors }: any) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  // Create preview URLs for uploaded files
  React.useEffect(() => {
    const newPreviews = data.photos.map((file: File) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    // Cleanup old URLs
    return () => {
      newPreviews.forEach((url: string) => URL.revokeObjectURL(url));
    };
  }, [data.photos]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const totalPhotos = data.photos.length + imageFiles.length;
    
    if (totalPhotos > 10) {
      alert('You can only upload up to 10 photos');
      return;
    }
    
    updateData({ photos: [...data.photos, ...imageFiles] });
  };

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_: File, i: number) => i !== index);
    updateData({ photos: newPhotos });
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...data.photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    updateData({ photos: newPhotos });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Add photos of your place</h3>
        <p className="text-gray-600 mb-6">
          Photos help guests imagine staying at your place. You can add up to 10 photos.
        </p>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : errors.photos 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        
        <div className="flex flex-col items-center">
          <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {dragActive ? 'Drop photos here' : 'Upload photos'}
          </h4>
          <p className="text-gray-600 mb-4">
            Drag and drop photos here, or click to select files
          </p>
          <label
            htmlFor="photo-upload"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Choose photos
          </label>
          <p className="text-sm text-gray-500 mt-2">
            JPG, PNG up to 10MB each. Maximum 10 photos.
          </p>
        </div>
      </div>

      {errors.photos && (
        <p className="text-sm text-red-600">{errors.photos}</p>
      )}

      {/* Photo previews */}
      {data.photos.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">
            Photos ({data.photos.length}/10)
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with controls */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity">
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => removePhoto(index)}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    {index > 0 && (
                      <button
                        onClick={() => movePhoto(index, index - 1)}
                        className="px-2 py-1 bg-white text-black text-xs rounded hover:bg-gray-100"
                      >
                        ←
                      </button>
                    )}
                    {index < data.photos.length - 1 && (
                      <button
                        onClick={() => movePhoto(index, index + 1)}
                        className="px-2 py-1 bg-white text-black text-xs rounded hover:bg-gray-100"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Main photo indicator */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Main photo
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> The first photo will be the main photo shown in search results. 
              Use the arrow buttons to reorder photos.
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Photo tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use natural lighting when possible</li>
          <li>• Show the most important spaces first</li>
          <li>• Include photos of bedrooms, bathrooms, and common areas</li>
          <li>• Make sure photos are clear and well-lit</li>
          <li>• Avoid personal items and clutter</li>
        </ul>
      </div>
    </div>
  );
};
const PriceStep = ({ data, updateData, errors }: any) => {
  const availableAmenities = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'kitchen', name: 'Kitchen', icon: Coffee },
    { id: 'laundry', name: 'Laundry', icon: HomeIcon },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'utilities_included', name: 'Utilities included', icon: Zap },
    { id: 'furnished', name: 'Furnished', icon: HomeIcon },
    { id: 'gym', name: 'Gym', icon: Dumbbell },
    { id: 'pool', name: 'Pool', icon: Waves },
    { id: 'pets_allowed', name: 'Pets allowed', icon: PawPrint },
  ];

  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = data.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id: string) => id !== amenityId)
      : [...currentAmenities, amenityId];
    updateData({ amenities: newAmenities });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Set your price and availability</h3>
        <p className="text-gray-600 mb-6">
          Set a competitive price and let guests know when your place is available.
        </p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly rent *
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            min="0"
            step="50"
            value={data.price || ''}
            onChange={(e) => updateData({ price: parseFloat(e.target.value) || 0 })}
            placeholder="2400"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          This is the total monthly rent guests will pay
        </p>
      </div>

      {/* Availability dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available from *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.move_in}
              onChange={(e) => updateData({ move_in: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.move_in ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.move_in && (
            <p className="mt-1 text-sm text-red-600">{errors.move_in}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available until *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.move_out}
              onChange={(e) => updateData({ move_out: e.target.value })}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.move_out ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.move_out && (
            <p className="mt-1 text-sm text-red-600">{errors.move_out}</p>
          )}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What amenities do you offer?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableAmenities.map((amenity) => {
            const Icon = amenity.icon;
            const isSelected = data.amenities?.includes(amenity.id);
            
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`flex items-center gap-3 p-3 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                  {amenity.name}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Select all amenities that apply to your listing
        </p>
      </div>

      {/* Pricing tips */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">Pricing tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Research similar places in your area</li>
          <li>• Consider your location and amenities</li>
          <li>• Factor in utilities and any included services</li>
          <li>• You can always adjust your price later</li>
        </ul>
      </div>
    </div>
  );
};
const ReviewStep = ({ data }: any) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoomTypeLabel = (roomType: string) => {
    switch (roomType) {
      case 'entire': return 'Entire place';
      case 'private': return 'Private room';
      case 'shared': return 'Shared room';
      default: return roomType;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Review your listing</h3>
        <p className="text-gray-600 mb-6">
          Take a moment to review your listing details before publishing.
        </p>
      </div>

      {/* Listing Preview */}
      <div className="border rounded-xl overflow-hidden">
        {/* Photos */}
        {data.photos.length > 0 && (
          <div className="aspect-video bg-gray-200">
            <img
              src={URL.createObjectURL(data.photos[0])}
              alt="Main listing photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Title and Location */}
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {data.title || 'Untitled listing'}
            </h4>
            <p className="text-gray-600">
              {[data.city, data.state].filter(Boolean).join(', ') || 'Location not set'}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Property details</h5>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Type:</span> {getRoomTypeLabel(data.room_type)}</p>
                <p><span className="text-gray-600">Bedrooms:</span> {data.bedrooms}</p>
                <p><span className="text-gray-600">Bathrooms:</span> {data.bathrooms}</p>
                <p><span className="text-gray-600">Price:</span> {formatPrice(data.price)}/month</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Availability</h5>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">From:</span> {formatDate(data.move_in)}</p>
                <p><span className="text-gray-600">Until:</span> {formatDate(data.move_out)}</p>
                <p><span className="text-gray-600">Photos:</span> {data.photos.length} uploaded</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-2">Description</h5>
            <p className="text-gray-700 text-sm leading-relaxed">
              {data.description || 'No description provided'}
            </p>
          </div>

          {/* Amenities */}
          {data.amenities && data.amenities.length > 0 && (
            <div className="mb-6">
              <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
              <div className="flex flex-wrap gap-2">
                {data.amenities.map((amenity: string) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                  >
                    {amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Address</h5>
            <div className="text-sm text-gray-700">
              <p>{data.address_line1}</p>
              {data.address_line2 && <p>{data.address_line2}</p>}
              <p>{[data.city, data.state, data.postal_code].filter(Boolean).join(', ')}</p>
              {data.lat && data.lng && (
                <p className="text-gray-500 mt-1">
                  Coordinates: {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and conditions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Before you publish</h5>
        <div className="space-y-2 text-sm text-gray-700">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <span>
              I confirm that all information provided is accurate and that I have the right to list this property.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <span>
              I agree to Roomify's Terms of Service and will respond to guest inquiries in a timely manner.
            </span>
          </label>
        </div>
      </div>

      {/* Publishing note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <p className="text-sm text-blue-700">
          After you publish, your listing will be live and searchable by students looking for housing. 
          You'll receive notifications when someone is interested in your place.
        </p>
      </div>
    </div>
  );
};

const STEPS = [
  { id: 'basics', title: 'Basics', component: BasicsStep },
  { id: 'location', title: 'Location', component: LocationStep },
  { id: 'photos', title: 'Photos', component: PhotosStep },
  { id: 'price', title: 'Price & Dates', component: PriceStep },
  { id: 'review', title: 'Review & Publish', component: ReviewStep },
];

interface ListingData {
  // Basics
  title: string;
  description: string;
  room_type: 'entire' | 'private' | 'shared';
  bedrooms: number;
  bathrooms: number;
  
  // Location
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  lat?: number;
  lng?: number;
  
  // Photos
  photos: File[];
  
  // Price & Dates
  price: number;
  move_in: string;
  move_out: string;
  amenities: string[];
}

function CreateListingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [, setUser] = useState<any>(null);
  
  const [listingData, setListingData] = useState<ListingData>({
    title: '',
    description: '',
    room_type: 'private',
    bedrooms: 1,
    bathrooms: 1,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    photos: [],
    price: 0,
    move_in: '',
    move_out: '',
    amenities: [],
  });

  // Check authentication status on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isSupabaseReady()) {
          // Use mock auth for development
          console.log('Using mock auth for development');
          setUser(mockAuthUser);
          setIsAuthenticating(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to auth page with return URL
          const params = new URLSearchParams();
          params.set('redirect', '/list-your-place');
          navigate('/auth?' + params.toString());
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error checking auth:', error);
        // In development, fall back to mock auth
        if (!isSupabaseReady()) {
          console.log('Falling back to mock auth due to Supabase configuration');
          setUser(mockAuthUser);
        } else {
          const params = new URLSearchParams();
          params.set('redirect', '/list-your-place');
          navigate('/auth?' + params.toString());
        }
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const updateData = (updates: Partial<ListingData>) => {
    setListingData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0: // Basics
        if (!listingData.title.trim()) newErrors.title = 'Title is required';
        if (!listingData.description.trim()) newErrors.description = 'Description is required';
        if (listingData.bedrooms < 1) newErrors.bedrooms = 'At least 1 bedroom required';
        if (listingData.bathrooms < 0.5) newErrors.bathrooms = 'At least 0.5 bathroom required';
        break;
        
      case 1: // Location
        if (!listingData.address_line1.trim()) newErrors.address_line1 = 'Address is required';
        if (!listingData.city.trim()) newErrors.city = 'City is required';
        if (!listingData.state.trim()) newErrors.state = 'State is required';
        break;
        
      case 2: // Photos
        if (listingData.photos.length === 0) newErrors.photos = 'At least 1 photo is required';
        break;
        
      case 3: // Price
        if (listingData.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!listingData.move_in) newErrors.move_in = 'Move-in date is required';
        if (!listingData.move_out) newErrors.move_out = 'Move-out date is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const uploadPhotos = async (photos: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('listing-photos')
        .upload(fileName, photo);
      
      if (error) {
        throw new Error(`Failed to upload ${photo.name}: ${error.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-photos')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      if (!isSupabaseReady()) {
        // Mock submission for development
        console.log('Mock listing creation:', listingData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Navigate to search with success message
        navigate('/search?demo=listing-created&title=' + encodeURIComponent(listingData.title));
        return;
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setErrors({ submit: 'You must be logged in to create a listing. Please sign in and try again.' });
        setIsSubmitting(false);
        return;
      }

      // Upload photos to Supabase Storage
      let photoUrls: string[] = [];
      if (listingData.photos.length > 0) {
        try {
          photoUrls = await uploadPhotos(listingData.photos);
        } catch (uploadError: any) {
          setErrors({ submit: `Photo upload failed: ${uploadError.message}` });
          setIsSubmitting(false);
          return;
        }
      }

      // Create the listing in the database
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: listingData.title,
          description: listingData.description,
          price: listingData.price,
          room_type: listingData.room_type,
          bedrooms: listingData.bedrooms,
          bathrooms: listingData.bathrooms,
          address_line1: listingData.address_line1,
          address_line2: listingData.address_line2,
          city: listingData.city,
          state: listingData.state,
          postal_code: listingData.postal_code,
          lat: listingData.lat,
          lng: listingData.lng,
          move_in: listingData.move_in,
          move_out: listingData.move_out,
          amenities: listingData.amenities,
        })
        .select()
        .single();

      if (listingError) {
        throw new Error(`Failed to create listing: ${listingError.message}`);
      }

      // Create photo records
      if (photoUrls.length > 0) {
        const photoRecords = photoUrls.map((url, index) => ({
          listing_id: listing.id,
          url,
          position: index,
        }));

        const { error: photoError } = await supabase
          .from('listing_photos')
          .insert(photoRecords);

        if (photoError) {
          console.warn('Failed to save photo records:', photoError);
          // Don't fail the entire operation for photo records
        }
      }
      
      // Navigate to the new listing
      const slug = listingData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      navigate(`/listing/${listing.id}/${slug}?created=true`);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      setErrors({ submit: error.message || 'Failed to create listing. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  // Show loading screen while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Development notice */}
      {!isSupabaseReady() && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-4xl mx-auto text-sm text-yellow-800">
            <strong>Development Mode:</strong> Using mock authentication and data storage. 
            Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for full functionality.
          </div>
        </div>
      )}
      
      {/* Progress header */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Back button */}
          <button
            onClick={() => currentStep === 0 ? navigate(-1) : handlePrev()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? 'Back' : 'Previous'}
          </button>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold">List your place</h1>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStep
                        ? 'bg-green-600 text-white'
                        : index === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {STEPS[currentStep].title}
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <CurrentStepComponent
            data={listingData}
            updateData={updateData}
            errors={errors}
          />
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Publishing...
                </>
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
                  Publish listing
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateListingPage;