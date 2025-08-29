import React from 'react';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - will be added in future PR */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">Roomify</div>
            <nav className="flex space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign in</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative min-h-[70vh] max-h-[800px] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Find places to stay near campus
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Discover student housing and sublets perfect for your academic journey
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <SearchBox />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Flexible Housing Options
                </h3>
                <p className="text-gray-600">
                  Find accommodations that match your academic schedule
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Campus-Centric Locations
                </h3>
                <p className="text-gray-600">
                  Discover housing near universities across the country
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Filters
                </h3>
                <p className="text-gray-600">
                  Find the perfect student housing that fits your needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Roomify Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find your perfect student housing in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Search by Campus
                </h3>
                <p className="text-gray-600">
                  Enter your university or college to see nearby housing options
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Browse & Filter
                </h3>
                <p className="text-gray-600">
                  Use our smart filters to find housing that matches your preferences
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect & Move
                </h3>
                <p className="text-gray-600">
                  Contact landlords directly and secure your perfect student housing
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - will be updated in future PR */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">Roomify</div>
            <p className="text-gray-400">
              Student housing made simple
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}