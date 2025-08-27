export interface Campus {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  slug?: string;
}

export interface Listing {
  id: string;
  campus_id?: string;
  user_id: string;
  title: string;
  description?: string;
  price: number;
  room_type: 'entire' | 'private' | 'shared';
  bedrooms?: number;
  bathrooms?: number;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  move_in?: string;
  move_out?: string;
  amenities?: string[];
  created_at: string;
  updated_at?: string;
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  url: string;
  width?: number;
  height?: number;
  position: number;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  school_email?: string;
  created_at: string;
}

export interface MessageThread {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  sent_at: string;
}

export interface SearchFilters {
  campus?: string;
  start?: string;
  end?: string;
  min?: number;
  max?: number;
  room?: 'entire' | 'private' | 'shared';
  beds?: number;
  baths?: number;
  amenities?: string[];
}

export interface SearchParams extends SearchFilters {
  sort?: 'relevance' | 'price-low' | 'price-high' | 'distance' | 'newest';
}