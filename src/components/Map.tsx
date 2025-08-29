import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Listing } from '../types';

// Static libraries array to prevent reloading
const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

interface MapProps {
  listings: Listing[];
  center: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (listing: Listing) => void;
  selectedListing?: Listing | null;
  className?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export default function Map({
  listings,
  center,
  zoom = 13,
  onMarkerClick,
  selectedListing,
  className = ''
}: MapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const hasApiKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<Listing | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // Initialize marker clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    
    clustererRef.current = new MarkerClusterer({
      map,
      markers: [],
    });
    
    // Create markers for listings
    createMarkers(map);
  }, [listings]);

  const onUnmount = useCallback(() => {
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    setMap(null);
  }, []);

  const createMarkers = (mapInstance: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers for listings with coordinates
    const newMarkers = listings
      .filter(listing => listing.lat && listing.lng)
      .map(listing => {
        const marker = new google.maps.Marker({
          position: { lat: listing.lat!, lng: listing.lng! },
          map: mapInstance,
          title: listing.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24c0-8.837-7.163-16-16-16z" fill="#2563eb"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <text x="16" y="20" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="bold">$${Math.round(listing.price)}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 40),
            anchor: new google.maps.Point(16, 40)
          }
        });

        marker.addListener('click', () => {
          setInfoWindow(listing);
          onMarkerClick?.(listing);
        });

        return marker;
      });

    markersRef.current = newMarkers;

    // Add markers to clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current.addMarkers(newMarkers);
    }
  };

  // Update markers when listings change
  React.useEffect(() => {
    if (map) {
      createMarkers(map);
    }
  }, [listings, map]);

  // Highlight selected listing
  React.useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const listing = listings.filter(l => l.lat && l.lng)[index];
      if (listing && selectedListing && listing.id === selectedListing.id) {
        marker.setIcon({
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24c0-8.837-7.163-16-16-16z" fill="#dc2626"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="#dc2626" font-size="10" font-weight="bold">$${Math.round(listing.price)}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        });
      } else {
        marker.setIcon({
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24c0-8.837-7.163-16-16-16z" fill="#2563eb"/>
              <circle cx="16" cy="16" r="8" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="bold">$${Math.round(listing.price)}</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        });
      }
    });
  }, [selectedListing, listings]);

  if (loadError || !hasApiKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {!hasApiKey ? (
            <>
              <div className="text-gray-600 mb-2">Map Preview</div>
              <div className="text-sm text-gray-500">
                Set VITE_GOOGLE_MAPS_API_KEY to enable interactive map
              </div>
            </>
          ) : (
            <>
              <div className="text-red-600 mb-2">Map failed to load</div>
              <div className="text-sm text-gray-600">Please check your Google Maps API key</div>
            </>
          )}
          <div className="mt-4 text-sm text-gray-500">
            {listings.length} listings in this area
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defaultMapOptions}
        onClick={() => setInfoWindow(null)}
      >
        {infoWindow && infoWindow.lat && infoWindow.lng && (
          <InfoWindow
            position={{ lat: infoWindow.lat, lng: infoWindow.lng }}
            onCloseClick={() => setInfoWindow(null)}
          >
            <div className="max-w-xs">
              <div className="font-semibold text-sm mb-1">{infoWindow.title}</div>
              <div className="text-lg font-bold text-blue-600 mb-2">
                ${infoWindow.price}/mo
              </div>
              {infoWindow.description && (
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {infoWindow.description}
                </div>
              )}
              <div className="text-xs text-gray-500">
                {infoWindow.room_type} • {infoWindow.bedrooms || 0} bed • {infoWindow.bathrooms || 0} bath
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
