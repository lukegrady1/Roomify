export interface LatLng {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Haversine distance calculation
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) {
    return '< 0.1 mi';
  }
  if (miles < 1) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(miles)} mi`;
}

export function createBounds(center: LatLng, radiusMiles: number): Bounds {
  const latChange = radiusMiles / 69; // Approximate miles per degree latitude
  const lngChange = radiusMiles / (69 * Math.cos(toRadians(center.lat)));
  
  return {
    north: center.lat + latChange,
    south: center.lat - latChange,
    east: center.lng + lngChange,
    west: center.lng - lngChange
  };
}

export function isPointInBounds(point: LatLng, bounds: Bounds): boolean {
  return point.lat >= bounds.south &&
         point.lat <= bounds.north &&
         point.lng >= bounds.west &&
         point.lng <= bounds.east;
}