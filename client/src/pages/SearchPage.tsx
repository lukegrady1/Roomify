import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, List, Map as MapIcon, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import ListingCard from '../components/ListingCard';
import FiltersDrawer from '../components/FiltersDrawer';
import { fallbackCampuses, findCampusByName } from '../lib/campuses';
import type { Listing, SearchFilters, Campus } from '../types';

// Mock listings data for demo
const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Cozy Studio Near Harvard',
    description: 'Beautiful studio apartment just 10 minutes walk from Harvard Yard. Recently renovated with modern amenities.',
    price: 2400,
    room_type: 'entire',
    bedrooms: 1,
    bathrooms: 1,
    city: 'Cambridge',
    state: 'MA',
    lat: 42.3744,
    lng: -71.1169,
    move_in: '2025-01-01',
    move_out: '2025-08-31',
    amenities: ['wifi', 'laundry', 'furnished'],
    created_at: '2024-01-01',
    listing_photos: [{
      id: '1',
      listing_id: '1',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      position: 0
    }]
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Shared Room in MIT Area',
    description: 'Great shared accommodation with other graduate students. Close to MIT campus and public transportation.',
    price: 1200,
    room_type: 'shared',
    bedrooms: 4,
    bathrooms: 2,
    city: 'Cambridge',
    state: 'MA',
    lat: 42.3601,
    lng: -71.0942,
    move_in: '2025-02-01',
    move_out: '2025-07-31',
    amenities: ['wifi', 'kitchen', 'parking'],
    created_at: '2024-01-02',
    listing_photos: [{
      id: '2',
      listing_id: '2',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      position: 0
    }]
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'Private Room Boston University',
    description: 'Private bedroom in shared house. Walking distance to BU campus. Great for students.',
    price: 1800,
    room_type: 'private',
    bedrooms: 1,
    bathrooms: 1,
    city: 'Boston',
    state: 'MA',
    lat: 42.3505,
    lng: -71.1054,
    move_in: '2025-01-15',
    move_out: '2025-12-15',
    amenities: ['wifi', 'laundry', 'utilities_included'],
    created_at: '2024-01-03'
  }
];

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showMap, setShowMap] = useState(true);
  
  // Parse URL parameters
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const campus = params.get('campus') || '';
  const startDate = params.get('start');
  const endDate = params.get('end');
  
  // Find campus info
  const campusInfo = useMemo(() => {
    return campus ? findCampusByName(campus) : null;
  }, [campus]);

  // Current filters from URL
  const filters = useMemo((): SearchFilters => ({
    campus,
    start: startDate || undefined,
    end: endDate || undefined,
    min: params.get('min') ? parseInt(params.get('min')!) : undefined,
    max: params.get('max') ? parseInt(params.get('max')!) : undefined,
    room: (params.get('room') as any) || undefined,
    beds: params.get('beds') ? parseInt(params.get('beds')!) : undefined,
    baths: params.get('baths') ? parseInt(params.get('baths')!) : undefined,
    amenities: params.get('amenities')?.split(',').filter(Boolean) || [],
  }), [params, campus, startDate, endDate]);

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    let filtered = [...MOCK_LISTINGS];

    // Filter by campus (rough proximity for demo)
    if (campusInfo) {
      filtered = filtered.filter(listing => 
        listing.city?.toLowerCase().includes(campusInfo.city?.toLowerCase() || '') ||
        listing.state?.toLowerCase() === campusInfo.state?.toLowerCase()
      );
    }

    // Filter by price range
    if (filters.min) filtered = filtered.filter(l => l.price >= filters.min!);
    if (filters.max) filtered = filtered.filter(l => l.price <= filters.max!);

    // Filter by room type
    if (filters.room) filtered = filtered.filter(l => l.room_type === filters.room);

    // Filter by bedrooms
    if (filters.beds) filtered = filtered.filter(l => (l.bedrooms || 0) >= filters.beds!);

    // Filter by bathrooms
    if (filters.baths) filtered = filtered.filter(l => (l.bathrooms || 0) >= filters.baths!);

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(l => 
        filters.amenities!.some(amenity => (l.amenities || []).includes(amenity))
      );
    }

    return filtered;
  }, [filters, campusInfo]);

  // Update URL when filters change
  const updateURL = (newFilters: SearchFilters) => {
    const newParams = new URLSearchParams();
    
    if (newFilters.campus) newParams.set('campus', newFilters.campus);
    if (newFilters.start) newParams.set('start', newFilters.start);
    if (newFilters.end) newParams.set('end', newFilters.end);
    if (newFilters.min) newParams.set('min', newFilters.min.toString());
    if (newFilters.max) newParams.set('max', newFilters.max.toString());
    if (newFilters.room) newParams.set('room', newFilters.room);
    if (newFilters.beds) newParams.set('beds', newFilters.beds.toString());
    if (newFilters.baths) newParams.set('baths', newFilters.baths.toString());
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      newParams.set('amenities', newFilters.amenities.join(','));
    }

    navigate(`/search?${newParams.toString()}`, { replace: true });
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    // Filters are updated but not applied to URL yet
  };

  const handleApplyFilters = () => {
    // This will be called from FiltersDrawer
  };

  const handleClearFilters = () => {
    navigate(`/search?campus=${campus}`, { replace: true });
  };

  // Default map center
  const mapCenter = campusInfo 
    ? { lat: campusInfo.lat || 42.3601, lng: campusInfo.lng || -71.0942 }
    : { lat: 42.3601, lng: -71.0942 }; // Default to MIT area

  const hasActiveFilters = filters.min || filters.max || filters.room || filters.beds || filters.baths || (filters.amenities && filters.amenities.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">
            {filteredListings.length} places near {campus || 'campus'}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMap(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              !showMap ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              showMap ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {/* Desktop/Mobile Layout */}
      <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">
                {filteredListings.length} places
              </h1>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            {campus && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 p-3 bg-blue-50 rounded-lg">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Near <span className="font-medium">{campus}</span></span>
              </div>
            )}

            {/* Inline filters would go here - for now just show filters button */}
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              More filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:flex">
          {/* Listings List */}
          <div className={`${showMap ? 'hidden' : 'block'} lg:block lg:w-1/2 overflow-y-auto`}>
            <div className="p-4 lg:p-6 space-y-4">
              {filteredListings.length > 0 ? (
                filteredListings.map(listing => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onHover={setSelectedListing}
                    className="w-full"
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No listings found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className={`${showMap ? 'block' : 'hidden'} lg:block lg:w-1/2 lg:sticky lg:top-0 h-full`}>
            <Map
              listings={filteredListings}
              center={mapCenter}
              selectedListing={selectedListing}
              onMarkerClick={setSelectedListing}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Filters Drawer */}
      <FiltersDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={() => updateURL(filters)}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}

export default SearchPage;