import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-low' | 'price-high' | 'name' | 'newest' | 'rating';
  inStock: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  priceRange: { min: number; max: number };
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onFilterChange,
  categories,
  priceRange,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [tempPriceRange, setTempPriceRange] = useState({
    min: currentFilters.minPrice,
    max: currentFilters.maxPrice
  });

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
      setTempPriceRange({
        min: currentFilters.minPrice,
        max: currentFilters.maxPrice
      });
    }
  }, [isOpen, currentFilters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    const updatedFilters = {
      ...filters,
      minPrice: tempPriceRange.min,
      maxPrice: tempPriceRange.max
    };
    onFilterChange(updatedFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sortBy: 'newest' as const,
      inStock: false
    };
    setFilters(clearedFilters);
    setTempPriceRange({
      min: priceRange.min,
      max: priceRange.max
    });
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'minPrice') return value !== priceRange.min;
    if (key === 'maxPrice') return value !== priceRange.max;
    if (key === 'sortBy') return value !== 'newest';
    return value !== '' && value !== false;
  }).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Filters & Sort
            </h2>
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sort By
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  filters.category === '' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleFilterChange('category', category)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    filters.category === category 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="text-gray-500 mt-6">to</div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Range: ${priceRange.min} - ${priceRange.max}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Availability
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
              />
              <span className="text-gray-700">Show only items in stock</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear All
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal; 