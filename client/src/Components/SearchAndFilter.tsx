import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAnalytics } from '../Context/AnalyticsContext';

interface SearchAndFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  priceRange: { min: number; max: number };
}

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-low' | 'price-high' | 'name' | 'newest' | 'rating';
  inStock: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onFilterChange,
  categories,
  priceRange
}) => {
  const { trackSearch } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    sortBy: 'newest',
    inStock: false
  });

  const [tempPriceRange, setTempPriceRange] = useState({
    min: priceRange.min,
    max: priceRange.max
  });

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      onSearchChange(searchTerm);
      
      // Track search analytics if there's a search term
      if (searchTerm.trim().length > 2) {
        try {
          // We don't know the exact result count here, but we can estimate
          // In a real implementation, you'd get this from the search results
          await trackSearch(searchTerm.trim(), 0); // 0 as placeholder for result count
        } catch (error) {
          console.error('Error tracking search:', error);
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange, trackSearch]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | [number, number] | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: 'newest',
      inStock: false
    });
    setTempPriceRange({
      min: priceRange.min,
      max: priceRange.max
    });
    setSearchTerm('');
  };

  const applyPriceRange = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: tempPriceRange.min,
      maxPrice: tempPriceRange.max
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== false && 
    value !== priceRange.min && value !== priceRange.max
  ).length;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPriceRange}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter; 