-- Roomify Database Schema
-- Run this in your Supabase SQL Editor

-- Enable extensions (optional but recommended)
-- create extension if not exists "uuid-ossp";
-- create extension if not exists postgis;

-- Users/Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  school_email text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Campuses
create table if not exists public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  country text default 'USA',
  lat numeric(9,6),
  lng numeric(9,6),
  slug text unique
);

-- Enable RLS
alter table public.campuses enable row level security;

-- Create index for campus lookups
create index if not exists campuses_slug_idx on public.campuses(slug);

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  campus_id uuid references public.campuses(id) on delete set null,
  title text not null,
  description text,
  price numeric(10,2) not null, -- monthly rent
  room_type text check (room_type in ('entire', 'private', 'shared')) default 'private',
  bedrooms integer,
  bathrooms numeric(3,1),
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  lat numeric(9,6),
  lng numeric(9,6),
  move_in date,
  move_out date,
  amenities jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.listings enable row level security;

-- Create indexes for efficient queries
create index if not exists listings_campus_idx on public.listings(campus_id);
create index if not exists listings_price_idx on public.listings(price);
create index if not exists listings_move_idx on public.listings(move_in, move_out);
create index if not exists listings_user_idx on public.listings(user_id);

-- Listing Photos (store files in Supabase Storage bucket `listing-photos`)
create table if not exists public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  width integer,
  height integer,
  position integer default 0
);

-- Enable RLS
alter table public.listing_photos enable row level security;

-- Create index for photo lookups
create index if not exists listing_photos_listing_idx on public.listing_photos(listing_id);

-- Favorites
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, listing_id)
);

-- Enable RLS
alter table public.favorites enable row level security;

-- Messages (simple inquiry threads)
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.message_threads enable row level security;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  sent_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create index for message lookups
create index if not exists messages_thread_idx on public.messages(thread_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for listings updated_at
create trigger handle_listings_updated_at
  before update on public.listings
  for each row
  execute function public.handle_updated_at();