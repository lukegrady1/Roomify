export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          school_email: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          school_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          school_email?: string | null
          created_at?: string
        }
      }
      campuses: {
        Row: {
          id: string
          name: string
          city: string | null
          state: string | null
          country: string | null
          lat: number | null
          lng: number | null
          slug: string | null
        }
        Insert: {
          id?: string
          name: string
          city?: string | null
          state?: string | null
          country?: string | null
          lat?: number | null
          lng?: number | null
          slug?: string | null
        }
        Update: {
          id?: string
          name?: string
          city?: string | null
          state?: string | null
          country?: string | null
          lat?: number | null
          lng?: number | null
          slug?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          campus_id: string | null
          title: string
          description: string | null
          price: number
          room_type: 'entire' | 'private' | 'shared' | null
          bedrooms: number | null
          bathrooms: number | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          lat: number | null
          lng: number | null
          move_in: string | null
          move_out: string | null
          amenities: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campus_id?: string | null
          title: string
          description?: string | null
          price: number
          room_type?: 'entire' | 'private' | 'shared' | null
          bedrooms?: number | null
          bathrooms?: number | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          lat?: number | null
          lng?: number | null
          move_in?: string | null
          move_out?: string | null
          amenities?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campus_id?: string | null
          title?: string
          description?: string | null
          price?: number
          room_type?: 'entire' | 'private' | 'shared' | null
          bedrooms?: number | null
          bathrooms?: number | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          lat?: number | null
          lng?: number | null
          move_in?: string | null
          move_out?: string | null
          amenities?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      listing_photos: {
        Row: {
          id: string
          listing_id: string
          url: string
          width: number | null
          height: number | null
          position: number | null
        }
        Insert: {
          id?: string
          listing_id: string
          url: string
          width?: number | null
          height?: number | null
          position?: number | null
        }
        Update: {
          id?: string
          listing_id?: string
          url?: string
          width?: number | null
          height?: number | null
          position?: number | null
        }
      }
      favorites: {
        Row: {
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      message_threads: {
        Row: {
          id: string
          listing_id: string | null
          buyer_id: string | null
          seller_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          listing_id?: string | null
          buyer_id?: string | null
          seller_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string | null
          buyer_id?: string | null
          seller_id?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          body: string
          sent_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          body: string
          sent_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          body?: string
          sent_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}