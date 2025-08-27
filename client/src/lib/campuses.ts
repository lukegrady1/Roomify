import { Campus } from '../types';

// Fallback campus dataset for when Google Places is unavailable
export const campuses: Campus[] = [
  {
    id: 'boston-university',
    name: 'Boston University',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    lat: 42.3505,
    lng: -71.1054,
    slug: 'boston-university'
  },
  {
    id: 'harvard-university',
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'MA',
    country: 'USA',
    lat: 42.3744,
    lng: -71.1169,
    slug: 'harvard-university'
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    city: 'Cambridge',
    state: 'MA',
    country: 'USA',
    lat: 42.3601,
    lng: -71.0942,
    slug: 'mit'
  },
  {
    id: 'northeastern-university',
    name: 'Northeastern University',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    lat: 42.3398,
    lng: -71.0892,
    slug: 'northeastern-university'
  },
  {
    id: 'nyu',
    name: 'New York University',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.7282,
    lng: -73.9942,
    slug: 'nyu'
  },
  {
    id: 'columbia-university',
    name: 'Columbia University',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.8075,
    lng: -73.9626,
    slug: 'columbia-university'
  },
  {
    id: 'stanford-university',
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    country: 'USA',
    lat: 37.4275,
    lng: -122.1697,
    slug: 'stanford-university'
  },
  {
    id: 'uc-berkeley',
    name: 'University of California, Berkeley',
    city: 'Berkeley',
    state: 'CA',
    country: 'USA',
    lat: 37.8719,
    lng: -122.2585,
    slug: 'uc-berkeley'
  }
];

export function findCampusByName(name: string): Campus | undefined {
  return campuses.find(campus => 
    campus.name.toLowerCase().includes(name.toLowerCase())
  );
}

export function findCampusBySlug(slug: string): Campus | undefined {
  return campuses.find(campus => campus.slug === slug);
}