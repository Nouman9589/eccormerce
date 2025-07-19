import { useMemo } from 'react';
import { useProductContext } from '../Context/ProductContext';
import ProductCard from '../Components/ProductCard';
import ImageSlider from '../Components/ImageSlider';
import Loader from '../Resusebles/Loader';
import Categorylink from '../Components/Categorylink';
import Footer from '../Components/Footer';
import { ArrowRight, Star, TrendingUp, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  price: string;
  originalPrice?: number;
  availableSizes?: string[];
}

const HomePage = () => {
  const { products, loading } = useProductContext();

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

  // Get featured products (first 8 products)
  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  // Get new arrivals (last 6 products)
  const newArrivals = useMemo(() => {
    return products.slice(-6);
  }, [products]);

  // Get popular products (products with higher prices - simulating popularity)
  const popularProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      .slice(0, 6);
  }, [products]);

  // Get special offers (products with originalPrice)
  const specialOffers = useMemo(() => {
    return products
      .filter(product => product.originalPrice && product.originalPrice > parseFloat(product.price))
      .slice(0, 4);
  }, [products]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-white">
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

      {/* Categories Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>
      <Categorylink />
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-600">Handpicked favorites just for you</p>
              </div>
            </div>
            <Link
              to="/cloths"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
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
                rating={4.5}
                reviewCount={Math.floor(Math.random() * 100) + 1}
                isNew={Math.random() > 0.7}
                discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                <p className="text-gray-600">Latest additions to our collection</p>
              </div>
            </div>
            <Link
              to="/cloths"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
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
                isNew={true}
                discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Popular Products</h2>
                <p className="text-gray-600">Customer favorites and bestsellers</p>
              </div>
            </div>
            <Link
              to="/cloths"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((product) => (
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
                reviewCount={Math.floor(Math.random() * 200) + 50}
                isNew={false}
                discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers */}
      {specialOffers.length > 0 && (
        <div className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
                  <p className="text-gray-600">Don't miss these amazing deals</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialOffers.map((product) => (
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
                  isNew={false}
                  discount={product.originalPrice ? Math.round(((product.originalPrice - parseFloat(product.price)) / product.originalPrice) * 100) : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Sections */}
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
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
      <div className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                Subscribe <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
