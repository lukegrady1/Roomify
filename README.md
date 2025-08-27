# Roomify - Student Housing Platform

A modern, Airbnb-style platform for student sublets and housing near campuses.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. **Clone and install dependencies:**
```bash
cd client
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `VITE_GOOGLE_PLACES_API_KEY`: Your Google Places API key (can be same as Maps)

3. **Set up Supabase database:**

Run the SQL schema from `claude.md` in your Supabase SQL editor to create the necessary tables.

4. **Start the development server:**
```bash
npm run dev
```

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: URL-based state + Zustand for UI state
- **Routing**: React Router
- **Maps**: Google Maps JavaScript API + MarkerClusterer
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Testing**: Vitest + Testing Library

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🗂️ Project Structure

```
src/
  app/
    main.tsx          # Application entry point
    App.tsx           # Main app component with routing
  components/
    ui/              # shadcn/ui components
    [component files] # Feature components
  pages/
    HomePage.tsx     # Landing page with search
    SearchPage.tsx   # Map + list results
    ListingDetailPage.tsx  # Individual listing
    CreateListingPage.tsx  # Post new listing
    AuthPages.tsx    # Authentication
  lib/
    supabase.ts      # Supabase client setup
    campuses.ts      # Fallback campus data
    format.ts        # Utility formatting functions
    geo.ts          # Geographic calculations
    queryString.ts   # URL state management
    utils.ts        # General utilities
  store/
    [state files]   # Zustand stores
  types/
    index.ts        # TypeScript type definitions
```

## 🎯 Core Features (MVP)

- [x] Project setup with modern tooling
- [ ] Campus-based search with autocomplete
- [ ] Interactive map with clustered markers
- [ ] Listing cards with photos and details
- [ ] Filtering and sorting
- [ ] Listing detail pages
- [ ] User authentication (email + Google)
- [ ] Create listing flow with photo upload
- [ ] Basic messaging between users
- [ ] Responsive design

## 🚢 Deployment

The app is designed to deploy easily on Vercel or Netlify with automatic environment variable handling.

## 📋 Development Checklist

### PR #1: Foundation ✅
- [x] Tooling setup (Tailwind, shadcn/ui, ESLint, Prettier, Vitest)
- [x] Environment configuration
- [x] Project structure and routing
- [x] Basic types and utilities
- [x] Supabase client setup

### PR #2: Database & Auth (Next)
- [ ] Supabase database schema and RLS policies
- [ ] Authentication components
- [ ] User profile management

### PR #3: Search & Maps
- [ ] Homepage with campus search
- [ ] SearchPage with Google Maps integration
- [ ] Marker clustering
- [ ] Basic filtering

### PR #4: Listings
- [ ] Listing cards and detail pages
- [ ] Photo galleries
- [ ] Advanced filtering
- [ ] URL state management

### PR #5: Create Listing
- [ ] Multi-step listing creation flow
- [ ] Photo upload to Supabase Storage
- [ ] Address geocoding

### PR #6: Messaging
- [ ] Message threads between users
- [ ] Contact forms on listings

### PR #7: Polish & Testing
- [ ] Responsive design improvements
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🤝 Contributing

This project follows the plan outlined in `claude.md`. Each feature should be implemented in focused PRs with proper testing and documentation.