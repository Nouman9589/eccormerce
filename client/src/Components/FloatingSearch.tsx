import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface FloatingSearchProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterToggle: () => void;
}

const FloatingSearch: React.FC<FloatingSearchProps> = ({ onSearchChange, onFilterToggle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Show floating search when scrolled down 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchTerm('');
    onSearchChange('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 pointer-events-auto">
      {!isExpanded ? (
        /* Floating Search Button */
        <div className="flex gap-2">
          <button
            onClick={onFilterToggle}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            aria-label="Open filters"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={handleExpand}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Expanded Search Input */
        <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center w-80 max-w-[calc(100vw-2rem)]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <button
            onClick={onFilterToggle}
            className="p-3 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Open filters"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleCollapse}
            className="p-3 text-gray-600 hover:text-red-600 transition-colors rounded-r-full"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingSearch; 