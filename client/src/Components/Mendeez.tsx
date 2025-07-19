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
      <div className="flex items-center justify-between p-4 text-black border-b border-gray-300 flex-wrap bg-white">
        {/* User Section */}
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          {authLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="relative user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
              >
                <User className="w-5 h-5" />
                <div className="hidden sm:block">
                  <span className="font-medium block">
                    {user?.name || 'User'}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="text-xs text-blue-600 font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                {user?.role === 'admin' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                )}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to="/dashboard-items"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/analytics"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="w-4 h-4 mr-2">📊</span>
                        Analytics
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
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
