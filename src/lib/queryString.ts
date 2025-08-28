import type { SearchFilters } from '../types';

export type SearchParams = {
  campus?: string;
  start?: string;
  end?: string;
  min?: number;
  max?: number;
  room?: 'entire' | 'private' | 'shared';
  beds?: number;
  baths?: number;
  amenities?: string[];
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'distance' | 'newest';
};

export function parseSearchParams(searchString: string = ''): SearchParams {
  const params = new URLSearchParams(searchString.startsWith('?') ? searchString.slice(1) : searchString);
  
  const result: SearchParams = {};
  
  if (params.get('campus')) result.campus = params.get('campus')!;
  if (params.get('start')) result.start = params.get('start')!;
  if (params.get('end')) result.end = params.get('end')!;
  
  const min = params.get('min');
  if (min && !isNaN(Number(min))) result.min = Number(min);
  
  const max = params.get('max');
  if (max && !isNaN(Number(max))) result.max = Number(max);
  
  const room = params.get('room');
  if (room && ['entire', 'private', 'shared'].includes(room)) {
    result.room = room as 'entire' | 'private' | 'shared';
  }
  
  const beds = params.get('beds');
  if (beds && !isNaN(Number(beds))) result.beds = Number(beds);
  
  const baths = params.get('baths');
  if (baths && !isNaN(Number(baths))) result.baths = Number(baths);
  
  const amenities = params.get('amenities');
  if (amenities) {
    result.amenities = amenities.split(',').filter(Boolean);
  }
  
  const sort = params.get('sort');
  if (sort && ['relevance', 'price_asc', 'price_desc', 'distance', 'newest'].includes(sort)) {
    result.sort = sort as SearchParams['sort'];
  }
  
  return result;
}

export function buildSearchParams(filters: Partial<SearchParams>): string {
  const params = new URLSearchParams();
  
  if (filters.campus) params.set('campus', filters.campus);
  if (filters.start) params.set('start', filters.start);
  if (filters.end) params.set('end', filters.end);
  if (filters.min !== undefined) params.set('min', String(filters.min));
  if (filters.max !== undefined) params.set('max', String(filters.max));
  if (filters.room) params.set('room', filters.room);
  if (filters.beds !== undefined) params.set('beds', String(filters.beds));
  if (filters.baths !== undefined) params.set('baths', String(filters.baths));
  if (filters.amenities && filters.amenities.length > 0) {
    params.set('amenities', filters.amenities.join(','));
  }
  if (filters.sort && filters.sort !== 'relevance') {
    params.set('sort', filters.sort);
  }
  
  return params.toString();
}

export function buildSearchUrl(filters: Partial<SearchParams>, basePath: string = '/search'): string {
  const queryString = buildSearchParams(filters);
  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function paramsToFilters(params: SearchParams): SearchFilters {
  return {
    campus: params.campus,
    startDate: params.start,
    endDate: params.end,
    minPrice: params.min,
    maxPrice: params.max,
    roomType: params.room,
    bedrooms: params.beds,
    bathrooms: params.baths,
    amenities: params.amenities || []
  };
}

export function filtersToParams(filters: SearchFilters): SearchParams {
  return {
    campus: filters.campus,
    start: filters.startDate,
    end: filters.endDate,
    min: filters.minPrice,
    max: filters.maxPrice,
    room: filters.roomType,
    beds: filters.bedrooms,
    baths: filters.bathrooms,
    amenities: filters.amenities && filters.amenities.length > 0 ? filters.amenities : undefined
  };
}

// Utility to clean empty values from search params
export function cleanSearchParams(params: SearchParams): SearchParams {
  const cleaned: SearchParams = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length === 0) return;
      (cleaned as any)[key] = value;
    }
  });
  
  return cleaned;
}