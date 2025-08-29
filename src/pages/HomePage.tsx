import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SearchBox } from '../components/SearchBox';
import { CheckCircle, MapPin, Filter } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-50 via-white to-brand-50 pt-16 pb-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-60"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find places to stay
                <br />
                <span className="text-brand-600">near campus</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover student housing and sublets perfect for your academic journey. 
                Search by campus, connect with hosts, and find your home away from home.
              </p>

              {/* Search Box */}
              <div className="max-w-5xl mx-auto">
                <SearchBox />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why choose Roomify?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  We make finding student housing simple, safe, and stress-free
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {/* Feature 1 */}
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl mb-6 group-hover:bg-brand-200 transition-colors">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Flexible Housing Options
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    From entire apartments to shared rooms, find accommodations that match your academic schedule and budget.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl mb-6 group-hover:bg-brand-200 transition-colors">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Campus-Centric Locations
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover housing near universities across the country. Walk to class or take a short ride.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl mb-6 group-hover:bg-brand-200 transition-colors">
                    <Filter className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Smart Filters
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Filter by price, dates, amenities, and distance. Find exactly what you're looking for with our advanced search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How it works
              </h2>
              <p className="text-xl text-gray-600 mb-16">
                Finding your perfect student housing is just three steps away
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <div className="relative">
                  <div className="text-6xl font-bold text-brand-200 mb-4">1</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Search
                  </h3>
                  <p className="text-gray-600">
                    Enter your campus and dates to find available housing options near you.
                  </p>
                </div>

                <div className="relative">
                  <div className="text-6xl font-bold text-brand-200 mb-4">2</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Connect
                  </h3>
                  <p className="text-gray-600">
                    Message hosts directly and ask questions about the listing and neighborhood.
                  </p>
                </div>

                <div className="relative">
                  <div className="text-6xl font-bold text-brand-200 mb-4">3</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Move In
                  </h3>
                  <p className="text-gray-600">
                    Complete your booking and move into your new home near campus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;