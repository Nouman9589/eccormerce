import React, { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Loader2, Heart } from 'lucide-react';
import { useCartContext } from '../Context/CartContext';
import { useWishlistContext } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import AuthModal from './AuthModal';

const Mendeez: React.FC = () => {
  const { cartItems } = useCartContext();
  const { wishlistCount } = useWishlistContext();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  return (
    <>
      {/* Backdrop for user dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      
      <div className="fixed top-16 left-0 right-0 z-40 flex items-center justify-between p-4 text-black border-b border-gray-300 flex-wrap bg-white/95 backdrop-blur-md shadow-sm">
        {/* User Section */}
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          {authLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="relative user-menu z-50">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 relative border border-gray-200 hover:border-gray-300"
              >
                <User className="w-5 h-5 text-gray-700" />
                <div className="hidden sm:block text-left">
                  <span className="font-medium block text-gray-900">
                    {user?.name || 'User'}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="text-xs text-blue-600 font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                {user?.role === 'admin' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                )}
                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-60 backdrop-blur-sm transform origin-top-left transition-all duration-200">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-3 py-1">
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Admin Panel</span>
                      </div>
                      <Link
                        to="/dashboard-items"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/analytics"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-4 h-4 mr-3">📊</span>
                        Analytics
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-lg mx-2"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-3" />
                    )}
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          )}
        </div>

        {/* Brand Name */}
        <div className="text-2xl font-semibold flex-1 text-center mb-4 sm:mb-0">
          <Link to="/" className="hover:text-gray-500 tracking-widest">
            Mendeez
          </Link>
        </div>

        {/* Cart & Wishlist Section */}
        <div className="flex items-center space-x-6">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="cursor-pointer flex items-center space-x-2 hover:text-gray-400 transition-colors relative"
          >
            <div className="relative">
              <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'text-red-500 fill-current' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block">
              Wishlist ({wishlistCount})
            </span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="cursor-pointer flex items-center space-x-2 hover:text-gray-400 transition-colors relative"
          >
            <div className="relative">
              <AiOutlineShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="hidden sm:block">
              Cart ({cartItems.length})
            </span>
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Mendeez;
