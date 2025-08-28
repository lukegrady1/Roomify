-- Row Level Security (RLS) Policies for Roomify
-- Run these after creating the initial schema

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- Users can view all profiles (for public listings, messaging, etc.)
create policy "profiles_select_all" on public.profiles
  for select using (true);

-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Users can delete their own profile
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- =============================================
-- CAMPUSES TABLE POLICIES
-- =============================================

-- Anyone can view campuses (public data)
create policy "campuses_select_all" on public.campuses
  for select using (true);

-- Only authenticated users can insert campuses (for admin purposes)
create policy "campuses_insert_authenticated" on public.campuses
  for insert with check (auth.role() = 'authenticated');

-- Only authenticated users can update campuses
create policy "campuses_update_authenticated" on public.campuses
  for update using (auth.role() = 'authenticated');

-- =============================================
-- LISTINGS TABLE POLICIES
-- =============================================

-- Anyone can view published listings
create policy "listings_select_all" on public.listings
  for select using (true);

-- Users can insert their own listings
create policy "listings_insert_own" on public.listings
  for insert with check (auth.uid() = user_id);

-- Users can update their own listings
create policy "listings_update_own" on public.listings
  for update using (auth.uid() = user_id);

-- Users can delete their own listings
create policy "listings_delete_own" on public.listings
  for delete using (auth.uid() = user_id);

-- =============================================
-- LISTING_PHOTOS TABLE POLICIES
-- =============================================

-- Anyone can view listing photos
create policy "listing_photos_select_all" on public.listing_photos
  for select using (true);

-- Users can insert photos for their own listings
create policy "listing_photos_insert_own" on public.listing_photos
  for insert with check (
    exists (
      select 1 from public.listings
      where listings.id = listing_photos.listing_id
      and listings.user_id = auth.uid()
    )
  );

-- Users can update photos for their own listings
create policy "listing_photos_update_own" on public.listing_photos
  for update using (
    exists (
      select 1 from public.listings
      where listings.id = listing_photos.listing_id
      and listings.user_id = auth.uid()
    )
  );

-- Users can delete photos for their own listings
create policy "listing_photos_delete_own" on public.listing_photos
  for delete using (
    exists (
      select 1 from public.listings
      where listings.id = listing_photos.listing_id
      and listings.user_id = auth.uid()
    )
  );

-- =============================================
-- FAVORITES TABLE POLICIES
-- =============================================

-- Users can view their own favorites
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

-- Users can insert their own favorites
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

-- Users can delete their own favorites
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

-- =============================================
-- MESSAGE_THREADS TABLE POLICIES
-- =============================================

-- Users can view threads where they are either buyer or seller
create policy "message_threads_select_participant" on public.message_threads
  for select using (
    auth.uid() = buyer_id or auth.uid() = seller_id
  );

-- Users can create threads as a buyer (seller is determined by listing owner)
create policy "message_threads_insert_buyer" on public.message_threads
  for insert with check (auth.uid() = buyer_id);

-- Users can update threads where they are a participant
create policy "message_threads_update_participant" on public.message_threads
  for update using (
    auth.uid() = buyer_id or auth.uid() = seller_id
  );

-- =============================================
-- MESSAGES TABLE POLICIES
-- =============================================

-- Users can view messages in threads where they are a participant
create policy "messages_select_participant" on public.messages
  for select using (
    exists (
      select 1 from public.message_threads
      where message_threads.id = messages.thread_id
      and (message_threads.buyer_id = auth.uid() or message_threads.seller_id = auth.uid())
    )
  );

-- Users can insert messages in threads where they are a participant
create policy "messages_insert_participant" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.message_threads
      where message_threads.id = messages.thread_id
      and (message_threads.buyer_id = auth.uid() or message_threads.seller_id = auth.uid())
    )
  );

-- Users can update their own messages (for editing)
create policy "messages_update_own" on public.messages
  for update using (auth.uid() = sender_id);

-- Users can delete their own messages
create policy "messages_delete_own" on public.messages
  for delete using (auth.uid() = sender_id);

-- =============================================
-- STORAGE BUCKET POLICIES (Run in Storage section)
-- =============================================

-- Create bucket for listing photos (if not exists)
-- insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true);

-- Allow authenticated users to upload listing photos
-- create policy "listing_photos_upload" on storage.objects
--   for insert with check (
--     bucket_id = 'listing-photos'
--     and auth.role() = 'authenticated'
--   );

-- Allow public read access to listing photos
-- create policy "listing_photos_select" on storage.objects
--   for select using (bucket_id = 'listing-photos');

-- Allow users to update/delete their own uploaded photos
-- create policy "listing_photos_update_own" on storage.objects
--   for update using (
--     bucket_id = 'listing-photos'
--     and auth.uid()::text = (storage.foldername(name))[1]
--   );

-- create policy "listing_photos_delete_own" on storage.objects
--   for delete using (
--     bucket_id = 'listing-photos'
--     and auth.uid()::text = (storage.foldername(name))[1]
--   );