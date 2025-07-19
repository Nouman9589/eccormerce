import { useState, useMemo } from 'react';
import Categorylink from '../Components/Categorylink';
import ProductCard from '../Components/ProductCard';
import SearchAndFilter from '../Components/SearchAndFilter';
import FloatingSearch from '../Components/FloatingSearch';
import FilterModal from '../Components/FilterModal';
import { useProductContext } from '../Context/ProductContext';
import Footer from '../Components/Footer';
import Loader from '../Resusebles/Loader';
import { Tag, ShirtIcon } from 'lucide-react';

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-low' | 'price-high' | 'name' | 'newest' | 'rating';
  inStock: boolean;
}

const Shirts = () => {
  const { products, loading } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest',
    inStock: false
  });

  // Filter products where the category is 'shirts' (case-insensitive)
  const baseFilteredProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === 'shirts'
  );

  // Apply search and filters
  const filteredProducts = useMemo(() => {
    let filtered = baseFilteredProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          // Since we don't have actual ratings, we'll use a placeholder
          return Math.random() - 0.5;
        case 'newest':
        default:
          // Sort by creation date if available, otherwise by ID
          const aTime = (a as any).createdAt?.seconds || 0;
          const bTime = (b as any).createdAt?.seconds || 0;
          if (aTime && bTime) {
            return bTime - aTime;
          }
          return b.id.localeCompare(a.id);
      }
    });

    return filtered;
  }, [baseFilteredProducts, searchTerm, filters]);

  // Get price range for the filter component
  const priceRange = useMemo(() => {
    const prices = baseFilteredProducts.map(product => parseFloat(product.price));
    return {
      min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000
    };
  }, [baseFilteredProducts]);

  // Available categories (just shirts for this page)
  const categories = ['shirts'];

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Categorylink />
        </div>
      </div>

      {/* Traditional Search and Filter - Only show when searching */}
      {searchTerm && (
        <SearchAndFilter
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          categories={categories}
          priceRange={priceRange}
        />
      )}

      {/* Floating Search - Shows when scrolled down */}
      <FloatingSearch
        onSearchChange={handleSearchChange}
        onFilterToggle={() => setShowFilterModal(true)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilterChange={handleFilterChange}
        categories={categories}
        priceRange={priceRange}
        currentFilters={filters}
      />

      {/* Page Header */}
      <div className="py-16 bg-gradient-to-r from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
              <ShirtIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Shirts</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elevate your style with our curated collection of premium shirts. From casual comfort to formal elegance.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Tag className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">
              {filteredProducts.length} of {baseFilteredProducts.length} Products 
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageUrl={product.imageUrl}
                  title={product.name}
                  currentPrice={parseFloat(product.price)}
                  originalPrice={undefined}
                  availableSizes={product.availableSizes || []}
                  currency="$"
                  rating={4.4}
                  reviewCount={Math.floor(Math.random() * 60) + 10}
                  isNew={Math.random() > 0.8}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShirtIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? `No shirts found for "${searchTerm}"` : 'No Shirts Found'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'We\'re currently updating our shirt collection. Check back soon for premium quality shirts!'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shirts;
