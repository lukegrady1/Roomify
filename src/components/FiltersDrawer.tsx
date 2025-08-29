import { useState } from 'react';
import { X, SlidersHorizontal, DollarSign, Home, Bed, Bath } from 'lucide-react';
import type { SearchFilters } from '../types';

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const AMENITIES = [
  'wifi',
  'laundry',
  'parking',
  'kitchen',
  'gym',
  'pool',
  'air_conditioning',
  'heating',
  'pets_allowed',
  'furnished',
  'utilities_included'
];

const ROOM_TYPES = [
  { value: 'entire', label: 'Entire Place' },
  { value: 'private', label: 'Private Room' },
  { value: 'shared', label: 'Shared Room' }
] as const;

export default function FiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: FiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = localFilters.amenities || [];
    const updated = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    updateFilter('amenities', updated);
  };

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
    onClearFilters();
  };

  const formatAmenityLabel = (amenity: string) => {
    return amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-0 z-50 flex">
        <div className="ml-auto w-full max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Price Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium">Price Range</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={localFilters.min || ''}
                    onChange={(e) => updateFilter('min', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="$5000"
                    value={localFilters.max || ''}
                    onChange={(e) => updateFilter('max', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-4 h-4 text-gray-600" />
                <h3 className="font-medium">Room Type</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {ROOM_TYPES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="roomType"
                      value={value}
                      checked={localFilters.room === value}
                      onChange={(e) => updateFilter('room', e.target.value as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="roomType"
                    checked={!localFilters.room}
                    onChange={() => updateFilter('room', undefined)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Any</span>
                </label>
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bed className="w-4 h-4 text-gray-600" />
                  <h3 className="font-medium text-sm">Bedrooms</h3>
                </div>
                <select
                  value={localFilters.beds || ''}
                  onChange={(e) => updateFilter('beds', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bath className="w-4 h-4 text-gray-600" />
                  <h3 className="font-medium text-sm">Bathrooms</h3>
                </div>
                <select
                  value={localFilters.baths || ''}
                  onChange={(e) => updateFilter('baths', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(localFilters.amenities || []).includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm">{formatAmenityLabel(amenity)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            <button
              onClick={handleClear}
              className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear all filters
            </button>
            <button
              onClick={handleApply}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Show results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
