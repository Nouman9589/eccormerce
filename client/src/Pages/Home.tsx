import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageSlider from '../Components/ImageSlider';
import Categorylink from '../Components/Categorylink';
import ProductCard from '../Components/ProductCard';
import SearchAndFilter from '../Components/SearchAndFilter';
import FloatingSearch from '../Components/FloatingSearch';
import FilterModal from '../Components/FilterModal';
import Footer from '../Components/Footer';
import AdminWelcome from '../Components/AdminWelcome';
import Loader from '../Resusebles/Loader';
import { useProductContext } from '../Context/ProductContext';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  description?: string;
  originalPrice?: number;
  availableSizes?: string[];
}

interface FilterOptions {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-low' | 'price-high' | 'name' | 'newest' | 'rating';
  inStock: boolean;
}

const HomePage = () => {
  const { products, loading } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest',
    inStock: false
  });

  // Organize products by categories
  const productsByCategory = useMemo(() => {
    const categories: Record<string, Product[]> = {};
    products.forEach(product => {
      const category = product.category.toLowerCase();
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(product);
    });
    return categories;
  }, [products]);

  // Apply search and filters for "Show All Products" section
  const filteredAllProducts = useMemo(() => {
    if (!showAllProducts && !searchTerm) return [];
    
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
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
          return Math.random() - 0.5;
        case 'newest':
        default:
          const aTime = (a as any).createdAt?.seconds || 0;
          const bTime = (b as any).createdAt?.seconds || 0;
          if (aTime && bTime) {
            return bTime - aTime;
          }
          return b.id.localeCompare(a.id);
      }
    });

    return filtered;
  }, [products, searchTerm, filters, showAllProducts]);

  // Get price range for the filter component
  const priceRange = useMemo(() => {
    const prices = products.map(product => parseFloat(product.price));
    return {
      min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000
    };
  }, [products]);

  // Available categories
  const categories = useMemo(() => {
    return [...new Set(products.map(product => product.category.toLowerCase()))];
  }, [products]);

  // Get featured products (first 8 products)
  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    if (search) {
      setShowAllProducts(true);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowAllProducts(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Traditional Search and Filter - Only show when searching */}
      {(searchTerm || showAllProducts) && (
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

      {/* Admin Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <AdminWelcome />
      </div>

      {/* Hero Section */}
      <div className="relative">
      <ImageSlider />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Discover Your Style
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Explore our curated collection of premium fashion and lifestyle products
              </p>
              <Link
                to="/cloths"
                className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results / All Products Section */}
      {(showAllProducts || searchTerm) && (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
                </h2>
                <p className="text-gray-600">
                  {filteredAllProducts.length} products found
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAllProducts(false);
                  setSearchTerm('');
                }}
                className="text-gray-600 hover:text-gray-800 font-medium"
            >
                Clear Search
              </button>
          </div>
          
            {filteredAllProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAllProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                title={product.name}
                currentPrice={parseFloat(product.price)}
                originalPrice={product.originalPrice}
                availableSizes={product.availableSizes || []}
                currency="$"
                rating={4.5}
                reviewCount={Math.floor(Math.random() * 100) + 1}
                isNew={Math.random() > 0.7}
                discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
              />
            ))}
          </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found for "{searchTerm}"
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories Section - only show if not searching */}
      {!showAllProducts && !searchTerm && (
        <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600">Find exactly what you're looking for</p>
            </div>
        <Categorylink />
          </div>
        </div>
      )}

      {/* Featured Products - only show if not searching */}
      {!showAllProducts && !searchTerm && featuredProducts.length > 0 && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites from our collection</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageUrl={product.imageUrl}
                  title={product.name}
                  currentPrice={parseFloat(product.price)}
                  originalPrice={product.originalPrice}
                  availableSizes={product.availableSizes || []}
                  currency="$"
                  rating={4.8}
                  reviewCount={Math.floor(Math.random() * 150) + 20}
                  isNew={Math.random() > 0.5}
                  discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category-based Product Sections - only show if not searching */}
      {!showAllProducts && !searchTerm && Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <div key={category} className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 capitalize">{category}</h2>
                <p className="text-gray-600">Explore our {category} collection</p>
              </div>
              <Link
                to={`/${category}`}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(categoryProducts as Product[]).slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl}
              title={product.name}
              currentPrice={parseFloat(product.price)}
                  originalPrice={product.originalPrice}
                  availableSizes={product.availableSizes || []}
              currency="$"
                  rating={4.5}
                  reviewCount={Math.floor(Math.random() * 100) + 1}
                  isNew={Math.random() > 0.7}
                  discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
            />
          ))}
            </div>
          </div>
        </div>
      ))}

      {/* Newsletter Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Stay in Style</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Subscribe
              </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
