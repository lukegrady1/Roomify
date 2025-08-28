import type { Database } from './database.types';

// Convenience types for database entities
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Campus = Database['public']['Tables']['campuses']['Row'];
export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingPhoto = Database['public']['Tables']['listing_photos']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type MessageThread = Database['public']['Tables']['message_threads']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];

// Insert types for creating new records
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type CampusInsert = Database['public']['Tables']['campuses']['Insert'];
export type ListingInsert = Database['public']['Tables']['listings']['Insert'];
export type ListingPhotoInsert = Database['public']['Tables']['listing_photos']['Insert'];
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];
export type MessageThreadInsert = Database['public']['Tables']['message_threads']['Insert'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Update types for updating records
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type CampusUpdate = Database['public']['Tables']['campuses']['Update'];
export type ListingUpdate = Database['public']['Tables']['listings']['Update'];
export type ListingPhotoUpdate = Database['public']['Tables']['listing_photos']['Update'];
export type FavoriteUpdate = Database['public']['Tables']['favorites']['Update'];
export type MessageThreadUpdate = Database['public']['Tables']['message_threads']['Update'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];

// Extended types with relationships
export type ListingWithPhotos = Listing & {
  listing_photos: ListingPhoto[];
};

export type ListingWithCampus = Listing & {
  campus: Campus | null;
};

export type ListingWithDetails = Listing & {
  listing_photos: ListingPhoto[];
  campus: Campus | null;
  profile: Profile;
};

export type MessageThreadWithDetails = MessageThread & {
  listing: Listing | null;
  buyer: Profile | null;
  seller: Profile | null;
  messages: Message[];
};

// UI state types
export type SearchFilters = {
  campus?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: 'entire' | 'private' | 'shared';
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
};

export type SortOption = 
  | 'relevance' 
  | 'price_asc' 
  | 'price_desc' 
  | 'distance' 
  | 'newest';

// Room type options
export const ROOM_TYPES = {
  entire: 'Entire Place',
  private: 'Private Room',
  shared: 'Shared Room'
} as const;

// Common amenities
export const AMENITIES = [
  'wifi',
  'laundry',
  'parking',
  'kitchen',
  'gym',
  'pool',
  'air_conditioning',
  'heating',
  'pets_allowed',
  'smoking_allowed',
  'furnished',
  'utilities_included'
] as const;

export type Amenity = typeof AMENITIES[number];