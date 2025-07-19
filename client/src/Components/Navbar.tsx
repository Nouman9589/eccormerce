import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { Menu, X, ShoppingBag, User, Crown } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `relative px-4 py-2 rounded-lg transition-all duration-300 font-medium
    ${isActive 
      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} 
    hover:shadow-sm`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `block w-full text-left px-6 py-3 rounded-lg transition-all duration-300 font-medium
    ${isActive 
      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mendeez
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Admin Only Links */}
            {isAdmin && (
              <>
                <NavLink to="/add-product" className={navLinkClass}>
                  <div className="flex items-center space-x-1">
                    <Crown className="w-4 h-4" />
                    <span>Add Product</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard-items" className={navLinkClass}>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/analytics" className={navLinkClass}>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">📊</span>
                    <span>Analytics</span>
                  </div>
                </NavLink>
              </>
            )}
            
            {/* Public Links */}
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shirts" className={navLinkClass}>
              Shirts
            </NavLink>
            <NavLink to="/cloths" className={navLinkClass}>
              Cloths
            </NavLink>
            <NavLink to="/accessories" className={navLinkClass}>
              Accessories
            </NavLink>
            <NavLink to="/footwear" className={navLinkClass}>
              Footwear
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mendeez
            </span>
          </div>
          <button
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4 space-y-2">
          {/* Admin Only Links */}
          {isAdmin && (
            <div className="mb-6">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin Panel
              </div>
              <div className="space-y-1">
                <NavLink to="/add-product" className={mobileNavLinkClass} onClick={closeMenu}>
                  <div className="flex items-center space-x-3">
                    <Crown className="w-4 h-4" />
                    <span>Add Product</span>
                  </div>
                </NavLink>
                <NavLink to="/dashboard-items" className={mobileNavLinkClass} onClick={closeMenu}>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/analytics" className={mobileNavLinkClass} onClick={closeMenu}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📊</span>
                    <span>Analytics</span>
                  </div>
                </NavLink>
              </div>
            </div>
          )}
          
          {/* Public Links */}
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </div>
            <div className="space-y-1">
              <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/shirts" className={mobileNavLinkClass} onClick={closeMenu}>
                Shirts
              </NavLink>
              <NavLink to="/cloths" className={mobileNavLinkClass} onClick={closeMenu}>
                Cloths
              </NavLink>
              <NavLink to="/accessories" className={mobileNavLinkClass} onClick={closeMenu}>
                Accessories
              </NavLink>
              <NavLink to="/footwear" className={mobileNavLinkClass} onClick={closeMenu}>
                Footwear
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
