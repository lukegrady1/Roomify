import { SearchParams } from '../types';

export function parseSearchParams(searchString: string): SearchParams {
  const params = new URLSearchParams(searchString);
  
  return {
    campus: params.get('campus') || undefined,
    start: params.get('start') || undefined,
    end: params.get('end') || undefined,
    min: params.get('min') ? Number(params.get('min')) : undefined,
    max: params.get('max') ? Number(params.get('max')) : undefined,
    room: (params.get('room') as 'entire' | 'private' | 'shared') || undefined,
    beds: params.get('beds') ? Number(params.get('beds')) : undefined,
    baths: params.get('baths') ? Number(params.get('baths')) : undefined,
    amenities: params.get('amenities')?.split(',') || undefined,
    sort: (params.get('sort') as SearchParams['sort']) || 'relevance',
  };
}

export function buildSearchString(filters: SearchParams): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        }
      } else {
        params.set(key, String(value));
      }
    }
  });
  
  return params.toString();
}

export function updateSearchParam(
  currentSearch: string,
  key: string,
  value: string | number | string[] | undefined
): string {
  const current = parseSearchParams(currentSearch);
  const updated = { ...current, [key]: value };
  return buildSearchString(updated);
}