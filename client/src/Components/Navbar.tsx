import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `relative after:absolute after:bottom-[-8px] after:left-0 after:h-0.5 
    after:bg-black after:transition-all after:duration-300 after:ease-in-out
    ${isActive 
      ? 'after:w-full' 
      : 'after:w-0 hover:after:w-full'} 
    hover:text-gray-500`;

  return (
    <nav className="text-black p-4 tracking-wide font-light text-xl border-b border-gray-300">
      <div className="flex justify-between items-center">
        {/* Hamburger Menu Button for Mobile */}
        <button
          className="text-2xl md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Links for Desktop */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
          {/* Admin Only Links */}
          {isAdmin && (
            <>
              <NavLink to="/add-product" className={navLinkClass}>
                Add Product
              </NavLink>
              <NavLink to="/dashboard-items" className={navLinkClass}>
                Dashboard Items
              </NavLink>
              <NavLink to="/analytics" className={navLinkClass}>
                Analytics
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
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 h-screen w-2/3 rounded-r-lg bg-white transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-20 shadow-lg`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-xs text-black focus:outline-none"
          onClick={toggleMenu}
        >
          ✖
        </button>

        {/* Links for Mobile */}
        <div className="flex flex-col items-center mt-16 space-y-4">
          {/* Admin Only Links */}
          {isAdmin && (
            <>
              <NavLink to="/add-product" className={navLinkClass}>
                Add Product
              </NavLink>
              <NavLink to="/dashboard-items" className={navLinkClass}>
                Dashboard Items
              </NavLink>
              <NavLink to="/analytics" className={navLinkClass}>
                Analytics
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
      </div>
    </nav>
  );
};

export default Navbar;
