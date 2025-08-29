-- =====================================================
-- Roomify Complete Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Optional but recommended for location features

-- =====================================================
-- 1. PROFILES TABLE (User profiles linked to auth.users)
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  school_email TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE USING (auth.uid() = id);

-- =====================================================
-- 2. CAMPUSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'USA',
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  slug TEXT UNIQUE,
  description TEXT,
  website TEXT,
  student_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for campuses
CREATE INDEX IF NOT EXISTS campuses_slug_idx ON public.campuses(slug);
CREATE INDEX IF NOT EXISTS campuses_location_idx ON public.campuses(lat, lng);
CREATE INDEX IF NOT EXISTS campuses_state_city_idx ON public.campuses(state, city);

-- Enable RLS on campuses
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;

-- Campuses RLS Policies (public read access)
CREATE POLICY "Anyone can view campuses" 
ON public.campuses FOR SELECT USING (true);

-- Only authenticated users can suggest new campuses (optional admin approval workflow)
CREATE POLICY "Authenticated users can insert campuses" 
ON public.campuses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 3. LISTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
  
  -- Basic listing info
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  
  -- Room details
  room_type TEXT CHECK (room_type IN ('entire', 'private', 'shared')) DEFAULT 'private',
  bedrooms INTEGER CHECK (bedrooms >= 0),
  bathrooms NUMERIC(3,1) CHECK (bathrooms >= 0),
  square_feet INTEGER CHECK (square_feet > 0),
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'USA',
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  
  -- Availability
  move_in DATE,
  move_out DATE,
  min_lease_months INTEGER DEFAULT 1,
  max_lease_months INTEGER,
  
  -- Additional details
  amenities JSONB DEFAULT '[]'::JSONB,
  house_rules TEXT,
  cancellation_policy TEXT DEFAULT 'moderate',
  
  -- Status and metadata
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'rented', 'pending')),
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for listings
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS listings_campus_id_idx ON public.listings(campus_id);
CREATE INDEX IF NOT EXISTS listings_price_idx ON public.listings(price);
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings(lat, lng);
CREATE INDEX IF NOT EXISTS listings_dates_idx ON public.listings(move_in, move_out);
CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings(status);
CREATE INDEX IF NOT EXISTS listings_room_type_idx ON public.listings(room_type);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings(created_at DESC);

-- Enable RLS on listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Listings RLS Policies
CREATE POLICY "Anyone can view active listings" 
ON public.listings FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create listings" 
ON public.listings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. LISTING PHOTOS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- in bytes
  file_type TEXT, -- e.g., 'image/jpeg'
  position INTEGER DEFAULT 0, -- for ordering photos
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for listing photos
CREATE INDEX IF NOT EXISTS listing_photos_listing_id_idx ON public.listing_photos(listing_id);
CREATE INDEX IF NOT EXISTS listing_photos_position_idx ON public.listing_photos(listing_id, position);

-- Enable RLS on listing photos
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;

-- Listing Photos RLS Policies
CREATE POLICY "Anyone can view listing photos" 
ON public.listing_photos FOR SELECT USING (true);

CREATE POLICY "Listing owners can manage photos" 
ON public.listing_photos FOR ALL USING (
  listing_id IN (
    SELECT id FROM public.listings WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- 5. FAVORITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- Index for favorites
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_listing_id_idx ON public.favorites(listing_id);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Favorites RLS Policies
CREATE POLICY "Users can manage their own favorites" 
ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 6. MESSAGE THREADS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique thread per listing-buyer pair
  UNIQUE(listing_id, buyer_id)
);

-- Indexes for message threads
CREATE INDEX IF NOT EXISTS message_threads_listing_id_idx ON public.message_threads(listing_id);
CREATE INDEX IF NOT EXISTS message_threads_buyer_id_idx ON public.message_threads(buyer_id);
CREATE INDEX IF NOT EXISTS message_threads_seller_id_idx ON public.message_threads(seller_id);
CREATE INDEX IF NOT EXISTS message_threads_last_message_idx ON public.message_threads(last_message_at DESC);

-- Enable RLS on message threads
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;

-- Message Threads RLS Policies
CREATE POLICY "Thread participants can view threads" 
ON public.message_threads FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

CREATE POLICY "Buyers can create threads" 
ON public.message_threads FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Thread participants can update threads" 
ON public.message_threads FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- =====================================================
-- 7. MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (LENGTH(body) > 0),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'image')),
  attachment_url TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS messages_thread_id_idx ON public.messages(thread_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_sent_at_idx ON public.messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS messages_unread_idx ON public.messages(thread_id, read_at) WHERE read_at IS NULL;

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages RLS Policies
CREATE POLICY "Thread participants can view messages" 
ON public.messages FOR SELECT USING (
  thread_id IN (
    SELECT id FROM public.message_threads 
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Thread participants can send messages" 
ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  thread_id IN (
    SELECT id FROM public.message_threads 
    WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
  )
);

CREATE POLICY "Senders can update their own messages" 
ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- =====================================================
-- 8. REVIEWS TABLE (Optional for MVP but useful)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  stay_start_date DATE,
  stay_end_date DATE,
  response TEXT, -- Response from listing owner
  response_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate reviews
  UNIQUE(listing_id, reviewer_id)
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS reviews_listing_id_idx ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_reviewee_id_idx ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews RLS Policies
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their own reviews" 
ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Listing owners can respond to reviews" 
ON public.reviews FOR UPDATE USING (auth.uid() = reviewee_id);

-- =====================================================
-- 9. SAVED SEARCHES TABLE (Optional)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_params JSONB NOT NULL, -- Store search filters as JSON
  email_alerts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for saved searches
CREATE INDEX IF NOT EXISTS saved_searches_user_id_idx ON public.saved_searches(user_id);

-- Enable RLS on saved searches
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Saved Searches RLS Policies
CREATE POLICY "Users can manage their own saved searches" 
ON public.saved_searches FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 10. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    first_name, 
    last_name, 
    avatar_url,
    school_email
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'school_email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.campuses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.message_threads
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to update thread last_message_at when new message is sent
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.message_threads 
  SET 
    last_message_at = NEW.sent_at,
    updated_at = NEW.sent_at
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update thread timestamp on new message
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_message();

-- =====================================================
-- 11. STORAGE BUCKETS (Run these in Supabase Dashboard)
-- =====================================================

-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for listing photos
CREATE POLICY "Anyone can view listing photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

CREATE POLICY "Authenticated users can upload listing photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-photos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own listing photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'listing-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own listing photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- 12. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert some sample campuses
INSERT INTO public.campuses (name, city, state, lat, lng, slug, description) VALUES
('Harvard University', 'Cambridge', 'MA', 42.3744, -71.1169, 'harvard-university', 'Prestigious Ivy League university in Cambridge, Massachusetts'),
('Massachusetts Institute of Technology', 'Cambridge', 'MA', 42.3601, -71.0942, 'mit', 'Leading technology and engineering research university'),
('Boston University', 'Boston', 'MA', 42.3505, -71.1054, 'boston-university', 'Large private research university in Boston'),
('Stanford University', 'Stanford', 'CA', 37.4275, -122.1697, 'stanford-university', 'Elite private research university in Silicon Valley'),
('University of California, Berkeley', 'Berkeley', 'CA', 37.8719, -122.2585, 'uc-berkeley', 'Top public research university in California'),
('New York University', 'New York', 'NY', 40.7282, -73.9942, 'nyu', 'Private research university in Manhattan'),
('Columbia University', 'New York', 'NY', 40.8075, -73.9626, 'columbia-university', 'Ivy League university in Manhattan'),
('University of Chicago', 'Chicago', 'IL', 41.7886, -87.5987, 'university-of-chicago', 'Private research university known for economics and social sciences')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 13. HELPFUL VIEWS (Optional)
-- =====================================================

-- View for listing details with campus info
CREATE OR REPLACE VIEW public.listings_with_campus AS
SELECT 
  l.*,
  c.name as campus_name,
  c.city as campus_city,
  c.state as campus_state,
  p.full_name as owner_name,
  p.avatar_url as owner_avatar,
  -- Calculate distance from campus (in miles, approximate)
  CASE 
    WHEN l.lat IS NOT NULL AND l.lng IS NOT NULL AND c.lat IS NOT NULL AND c.lng IS NOT NULL
    THEN (
      3959 * acos(
        cos(radians(c.lat)) * cos(radians(l.lat)) * 
        cos(radians(l.lng) - radians(c.lng)) + 
        sin(radians(c.lat)) * sin(radians(l.lat))
      )
    )
    ELSE NULL
  END as distance_to_campus_miles
FROM public.listings l
LEFT JOIN public.campuses c ON l.campus_id = c.id
LEFT JOIN public.profiles p ON l.user_id = p.id;

-- View for message threads with latest message
CREATE OR REPLACE VIEW public.threads_with_details AS
SELECT 
  mt.*,
  l.title as listing_title,
  l.price as listing_price,
  bp.full_name as buyer_name,
  bp.avatar_url as buyer_avatar,
  sp.full_name as seller_name,
  sp.avatar_url as seller_avatar,
  lm.body as last_message_body,
  lm.sent_at as last_message_sent_at,
  lm.sender_id as last_message_sender_id,
  -- Count unread messages for buyer and seller
  (SELECT COUNT(*) FROM public.messages m 
   WHERE m.thread_id = mt.id AND m.sender_id != mt.buyer_id AND m.read_at IS NULL) as buyer_unread_count,
  (SELECT COUNT(*) FROM public.messages m 
   WHERE m.thread_id = mt.id AND m.sender_id != mt.seller_id AND m.read_at IS NULL) as seller_unread_count
FROM public.message_threads mt
LEFT JOIN public.listings l ON mt.listing_id = l.id
LEFT JOIN public.profiles bp ON mt.buyer_id = bp.id
LEFT JOIN public.profiles sp ON mt.seller_id = sp.id
LEFT JOIN public.messages lm ON lm.id = (
  SELECT id FROM public.messages m2 
  WHERE m2.thread_id = mt.id 
  ORDER BY sent_at DESC 
  LIMIT 1
);

-- =====================================================
-- SETUP COMPLETE! 
-- =====================================================

-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Configure your Site URL and Redirect URLs
-- 3. Enable email provider and configure templates
-- 4. Set up Google OAuth (optional)
-- 5. Test the authentication flow in your app
-- 
-- The database is now ready for the Roomify application!