import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User, Menu, X } from 'lucide-react';
import { MessagingService } from '../services/messagingService';
import { supabase, isSupabaseReady, mockAuthUser } from '../lib/supabase';
import type { FC } from 'react';

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!isSupabaseReady()) {
        setUser(mockAuthUser);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const threads = await MessagingService.getThreads(user.id);
        const totalUnread = threads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();
    
    // Refresh unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSignOut = async () => {
    if (isSupabaseReady()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            🏠 <span>Roomify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/search" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/list-your-place" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  List Your Space
                </Link>
                
                <Link 
                  to="/messages" 
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user.email || user.full_name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/messages" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Messages
                      {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link 
                to="/search" 
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/list-your-place" 
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    List Your Space
                  </Link>
                  
                  <Link 
                    to="/messages" 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link 
                    to="/profile" 
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-left w-full text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
