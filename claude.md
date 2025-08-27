# Roomify — Claude Build Plan (Airbnb‑style sublets for students)

> **Mission**: Build a polished MVP that lets students search by **campus**, view sublets on an **interactive map**, and contact listers. Think Airbnb UI/UX tuned for student sublets.

This doc is an execution playbook for Claude (and friends) to act like a small, cracked engineering team. Follow the steps, ship in small PRs, and keep everything production‑grade.

---

## High‑level Requirements

1. **Home page** with a hero search (campus autocomplete + date range).
2. **Results page** with **map + list** layout (clustered markers, sticky list, filters).
3. **Listing detail** page with gallery, details, amenities, availability, and contact form.
4. **Create Listing** flow for listers (auth‑gated), including photo upload.
5. **Authentication** (email/password and Google) and basic profile.
6. **Campus search**: user chooses a campus; map/listings scoped by radius or by campus tag.
7. **Filtering & sorting**: price, date availability, room type, beds/baths, amenities, distance.
8. **Messaging (MVP)**: basic inquiry thread (no payments in v1).
9. **Responsive** and **accessible** UI with a modern, Airbnb‑like aesthetic.

> **Constraint**: Keep MVP client‑heavy and simple to deploy. Use **Supabase** (Auth + Postgres + Storage) from the client. Edge functions **optional** for advanced search.

---

## Tech Stack

* **Frontend**: React + TypeScript + Vite
* **UI**: Tailwind CSS + shadcn/ui (Radix primitives), lucide‑react icons
* **State**: URL as state + lightweight Zustand for UI state
* **Routing**: React Router
* **Maps**: Google Maps JavaScript API (`@react-google-maps/api`) + MarkerClusterer
* **Autocomplete**: Google Places Autocomplete for campuses (fall back to local `campuses.json`)
* **Backend**: Supabase (Auth, Postgres, Storage). Optional Edge Functions for advanced queries
* **Testing**: Vitest + Testing Library + Playwright (smoke/e2e)
* **Analytics**: PostHog or Plausible (optional)
* **Deployment**: Netlify or Vercel (preferred for env handling). GH Pages is possible but less ergonomic for env vars

---

## Repo Tasks (Do these first)

1. **Audit current repo** (./src, routing, existing Home/Search components). Keep what’s useful.
2. **Add tooling**: Tailwind, shadcn/ui, ESLint + Prettier, Vitest.
3. **Env handling**: `.env` with:

   * `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   * `VITE_GOOGLE_MAPS_API_KEY`
   * `VITE_GOOGLE_PLACES_API_KEY` (can be same as Maps if enabled)
4. **Project skeleton** (see structure below). Migrate existing files into the new scaffold where sensible.

---

## Data Model (Supabase SQL)

Run in Supabase SQL editor. Use `uuid-ossp` and `postgis` if available (optional but nice). For MVP, lat/lng as decimals is fine.

```sql
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
create index if not exists listings_campus_idx on public.listings(campus_id);
create index if not exists listings_price_idx on public.listings(price);
create index if not exists listings_move_idx on public.listings(move_in, move_out);

-- Listing Photos (store files in Supabase Storage bucket `listing-photos`)
create table if not exists public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  width integer,
  height integer,
  position integer default 0
);
create index if not exists listing_photos_listing_idx on public.listing_photos(listing_id);

-- Favorites
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, listing_id)
);

-- Messages (simple inquiry threads)
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete cascade,
  seller_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  sent_at timestamp with time zone default now()
);
create index if not exists messages_thread_idx on public.messages(thread_id);
```

**RLS Policies** (pseudocode – implement with Supabase policy UI/SQL):

* `profiles`: user can read all, update own row
* `listings`: anyone can read; only owner can insert/update/delete
* `listing_photos`: read all; only listing owner can write
* `favorites`: only owner can read/write their favorites
* `message_threads/messages`: members can read; only members can write

---

## URL Contract & Routes

* `/` – Home
* `/search?campus=Boston+University&start=2025-06-01&end=2025-08-31&min=500&max=1800&room=private&beds=1&baths=1&amenities=wifi,laundry` – Map/List
* `/listing/:id/:slug` – Listing detail
* `/list-your-place` – Create listing (auth gated)
* `/login` `/signup` `/profile`

Keep filters in the **URL** so results are shareable and indexable.

---

## Frontend Structure

```
src/
  app/
    main.tsx
    router.tsx
  components/
    ui/*                       # shadcn components
    SearchBox.tsx
    CampusAutocomplete.tsx
    DateRangePicker.tsx
    PriceRange.tsx
    Map.tsx
    MarkerCluster.tsx
    ListingCard.tsx
    ListingCardSkeleton.tsx
    FiltersDrawer.tsx
    PhotoGrid.tsx
    AmenityChips.tsx
    Header.tsx
    Footer.tsx
  pages/
    HomePage.tsx
    SearchPage.tsx
    ListingDetailPage.tsx
    CreateListingPage.tsx
    AuthPages.tsx
  lib/
    supabase.ts
    campuses.ts               # fallback campus dataset (few dozen entries)
    format.ts
    geo.ts                    # haversine, bounds, distance formatting
    queryString.ts            # URL <-> state helpers
  store/
    useFilters.ts
  styles/
    index.css (Tailwind base/components/utilities)
```

---

## Key Components (Acceptance Criteria)

### 1) SearchBox (Home)

* Campus autocomplete (Google Places; fallback to local JSON)
* Date range (move‑in/move‑out). Allow empty.
* CTA navigates to `/search?...` preserving selections.

### 2) SearchPage (Map + List)

* Two‑column layout on desktop: **left** sticky list, **right** full‑height **map**.
* Mobile: map toggle; floating filters button opens `FiltersDrawer`.
* **Marker clustering**; hovering a card highlights its marker (and vice versa).
* **Results empty state** with suggestions.
* **Perf**: virtualization for the list (e.g., `react-virtual`).

### 3) Filters

* Price range min/max, room type, bedrooms, bathrooms, amenities (chips), date availability.
* Sort: Relevance (default), Price low‑high, Distance to campus, Newest.

### 4) ListingCard

* Cover photo, title, price `/mo`, meta (room type, beds/baths, distance), small badges.
* Click goes to Listing detail.

### 5) ListingDetailPage

* PhotoGrid with lightbox, sticky contact card on desktop.
* Sections: Overview, Details, Amenities, Availability, Location map.
* “Contact Lister” opens or creates a message thread.

### 6) CreateListingPage (auth)

* Multi‑step form: Basics → Location (geocode to lat/lng) → Photos (drag‑drop) → Price & Dates → Review & Publish.
* Upload to Supabase Storage `listing-photos/` and record to `listing_photos`.

---

## Supabase Client Helpers

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
```

**Types** (keep in `types.d.ts` or alongside modules):

```ts
export type Campus = { id: string; name: string; city?: string; state?: string; lat?: number; lng?: number; slug?: string };
export type Listing = {
  id: string; campus_id?: string; user_id: string; title: string; description?: string; price: number;
  room_type: 'entire' | 'private' | 'shared'; bedrooms?: number; bathrooms?: number;
  address_line1?: string; city?: string; state?: string; lat?: number; lng?: number;
  move_in?: string; move_out?: string; amenities?: string[]; created_at: string;
};
```

**Queries** (MVP):

* Fetch campus by slug/name
* Fetch listings by `campus_id` and filters (apply date overlap logic, price range, room type, etc.)
* Insert listing; upload photos; attach photo rows
* Create/read message thread; send message

**Date filter logic**: a listing matches if `(listing.move_out is null or listing.move_out >= start) and (listing.move_in is null or listing.move_in <= end)`

---

## Maps & Geocoding

* Use `@react-google-maps/api` for Map + markers + info windows.
* Use `@googlemaps/markerclusterer` for clustering.
* On **SearchPage** load: center map at the campus (lat/lng). If campus unknown, use geocoding.
* Compute **distance to campus** with haversine for display & sorting.

---

## Styling & Design System (Airbnb‑ish)

* **Typography**: Inter, 14/16/18/24/32 scale; font‑semibold for headings
* **Colors**: neutral backgrounds, soft card shadows, rounded‑2xl
* **Buttons**: large tap targets, ghost/outline for filter chips
* **Cards**: hover lift, border, 8–12px radius
* **Skeletons**: shimmer placeholders while loading
* **Accessibility**: focus rings, aria‑labels on map controls, sufficient contrast

---

## Seeding Data (Dev)

Create a `scripts/seed.ts` that:

* Inserts a few campuses (with lat/lng)
* Inserts \~20 sample listings with plausible coords around a campus
* Uploads 1–3 stock photos per listing (use placeholder images in `/public/seed/` for local dev)

Add npm scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "seed": "tsx scripts/seed.ts",
    "test": "vitest",
    "e2e": "playwright test"
  }
}
```

---

## Page‑Level Pseudocode

### SearchPage.tsx (core flow)

```tsx
useEffect(() => {
  const params = parseSearchParams();
  const campus = await ensureCampus(params.campus);
  setCenter({ lat: campus.lat, lng: campus.lng });
  const { data } = await supabase
    .from('listings')
    .select('*, listing_photos(url, position)')
    .eq('campus_id', campus.id)
    .gte('price', params.min ?? 0)
    .lte('price', params.max ?? 100000)
    // add where clauses for dates/room/amenities
    .order('created_at', { ascending: false });
  setListings(data);
}, [location.search]);
```

---

## Messaging (MVP)

* Button on Listing Detail: **Contact Lister**
* If no thread exists between viewer and owner for listing → create `message_threads` row, then `messages` row
* Show a minimal thread view (no realtime needed in MVP)

---

## Testing Checklist

* Unit: `queryString` helpers, `geo` haversine, amenity filtering logic
* Component: SearchBox renders & navigates; ListingCard formats correctly; Map renders markers
* E2E: Home → Search → Listing Detail; Create Listing happy path; Contact flow

---

## Deployment

* Prefer **Vercel**/**Netlify** for easier env vars; set `VITE_*` envs
* Restrict Supabase Storage bucket to authenticated writes; public reads for listing photos
* Configure Supabase RLS before going live

---

## Stretch (Post‑MVP)

* Saved searches + email alerts
* Calendar availability widget (day‑level)
* Admin dashboard (report listings, verify .edu emails)
* Reviews/ratings after tenancy
* Payments/escrow (Stripe) — out of scope for MVP
* Campus pages with SEO content

---

## Definition of Done

* Can search by **campus**, see **map + list** with cluster markers, apply filters, click through to detail.
* Can **authenticate**, **create a listing** with photos, and see it in search.
* Can send a **message** inquiry to a lister.
* Lighthouse (mobile) performance > 85; a11y > 90.

---

## PR Plan (Small, Focused PRs)

1. Tooling + Tailwind + shadcn setup
2. Supabase client + SQL + RLS policies
3. Campus data + SearchBox (Home)
4. SearchPage shell + Map + clustering
5. Filters + URL state
6. ListingCard + Detail page
7. CreateListing flow + uploads
8. Messaging MVP
9. Seed script + E2E smoke tests

Use Conventional Commits (feat/fix/chore/docs) and include a crisp demo video/gif per PR.

---

## Notes for Claude

* Keep components pure and typed. No sprawling contexts; prefer URL state.
* For UX latency: optimistic UI for favorites; skeletons everywhere.
* Defer non‑critical JS with `import()` for secondary panels.
* Guard API keys; never commit `.env`.
* If Google Places is unavailable, fall back to `campuses.json` with `{ name, city, state, lat, lng, slug }`.

Now, start by scaffolding the folders, wiring Tailwind + shadcn, and porting the existing Home/Search into this structure while maintaining behavior. Create PR #1 with the base skeleton and instructions for environment setup in the README.
