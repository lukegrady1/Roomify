import type { Campus } from '../types';

// Fallback campus data when Google Places API is unavailable
// This is a subset of major universities with approximate coordinates
export const fallbackCampuses: Omit<Campus, 'id'>[] = [
  {
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'MA',
    country: 'USA',
    lat: 42.3744,
    lng: -71.1169,
    slug: 'harvard-university'
  },
  {
    name: 'Massachusetts Institute of Technology',
    city: 'Cambridge',
    state: 'MA',
    country: 'USA',
    lat: 42.3601,
    lng: -71.0942,
    slug: 'mit'
  },
  {
    name: 'Boston University',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    lat: 42.3505,
    lng: -71.1054,
    slug: 'boston-university'
  },
  {
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    country: 'USA',
    lat: 37.4275,
    lng: -122.1697,
    slug: 'stanford-university'
  },
  {
    name: 'University of California, Berkeley',
    city: 'Berkeley',
    state: 'CA',
    country: 'USA',
    lat: 37.8719,
    lng: -122.2585,
    slug: 'uc-berkeley'
  },
  {
    name: 'New York University',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.7295,
    lng: -73.9965,
    slug: 'nyu'
  },
  {
    name: 'Columbia University',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.8075,
    lng: -73.9626,
    slug: 'columbia-university'
  },
  {
    name: 'University of Chicago',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    lat: 41.7886,
    lng: -87.5987,
    slug: 'university-of-chicago'
  },
  {
    name: 'Northwestern University',
    city: 'Evanston',
    state: 'IL',
    country: 'USA',
    lat: 42.0564,
    lng: -87.6753,
    slug: 'northwestern-university'
  },
  {
    name: 'University of Pennsylvania',
    city: 'Philadelphia',
    state: 'PA',
    country: 'USA',
    lat: 39.9522,
    lng: -75.1932,
    slug: 'upenn'
  },
  {
    name: 'Yale University',
    city: 'New Haven',
    state: 'CT',
    country: 'USA',
    lat: 41.3163,
    lng: -72.9223,
    slug: 'yale-university'
  },
  {
    name: 'Princeton University',
    city: 'Princeton',
    state: 'NJ',
    country: 'USA',
    lat: 40.3431,
    lng: -74.6551,
    slug: 'princeton-university'
  },
  {
    name: 'University of California, Los Angeles',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    lat: 34.0689,
    lng: -118.4452,
    slug: 'ucla'
  },
  {
    name: 'University of Southern California',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    lat: 34.0224,
    lng: -118.2851,
    slug: 'usc'
  },
  {
    name: 'University of Washington',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    lat: 47.6553,
    lng: -122.3035,
    slug: 'university-of-washington'
  },
  {
    name: 'University of Texas at Austin',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    lat: 30.2849,
    lng: -97.7341,
    slug: 'ut-austin'
  },
  {
    name: 'Georgia Institute of Technology',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    lat: 33.7756,
    lng: -84.3963,
    slug: 'georgia-tech'
  },
  {
    name: 'Carnegie Mellon University',
    city: 'Pittsburgh',
    state: 'PA',
    country: 'USA',
    lat: 40.4435,
    lng: -79.9436,
    slug: 'carnegie-mellon'
  },
  {
    name: 'Duke University',
    city: 'Durham',
    state: 'NC',
    country: 'USA',
    lat: 36.0014,
    lng: -78.9382,
    slug: 'duke-university'
  },
  {
    name: 'University of Michigan',
    city: 'Ann Arbor',
    state: 'MI',
    country: 'USA',
    lat: 42.2780,
    lng: -83.7382,
    slug: 'university-of-michigan'
  }
];

export function findCampusByName(query: string): Omit<Campus, 'id'> | null {
  const normalizedQuery = query.toLowerCase().trim();
  
  return fallbackCampuses.find(campus => 
    campus.name.toLowerCase().includes(normalizedQuery) ||
    campus.slug?.includes(normalizedQuery) ||
    `${campus.city?.toLowerCase()} ${campus.state?.toLowerCase()}`.includes(normalizedQuery)
  ) || null;
}

export function searchCampuses(query: string, limit = 10): Omit<Campus, 'id'>[] {
  if (!query.trim()) return fallbackCampuses.slice(0, limit);
  
  const normalizedQuery = query.toLowerCase().trim();
  
  const matches = fallbackCampuses.filter(campus =>
    campus.name.toLowerCase().includes(normalizedQuery) ||
    campus.city?.toLowerCase().includes(normalizedQuery) ||
    campus.state?.toLowerCase().includes(normalizedQuery) ||
    campus.slug?.includes(normalizedQuery)
  );
  
  // Sort by relevance (exact matches first, then partial matches)
  matches.sort((a, b) => {
    const aExact = a.name.toLowerCase() === normalizedQuery ? 1 : 0;
    const bExact = b.name.toLowerCase() === normalizedQuery ? 1 : 0;
    
    if (aExact !== bExact) return bExact - aExact;
    
    const aStarts = a.name.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
    const bStarts = b.name.toLowerCase().startsWith(normalizedQuery) ? 1 : 0;
    
    if (aStarts !== bStarts) return bStarts - aStarts;
    
    return a.name.localeCompare(b.name);
  });
  
  return matches.slice(0, limit);
}