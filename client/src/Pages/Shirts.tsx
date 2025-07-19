import Categorylink from '../Components/Categorylink';
import ProductCard from '../Components/ProductCard';
import { useProductContext } from '../Context/ProductContext';
import Footer from '../Components/Footer';
import Loader from '../Resusebles/Loader';
import { Tag, ShirtIcon } from 'lucide-react';

const Shirts = () => {
  const { products, loading } = useProductContext();

  // Filter products where the category is 'shirts' (case-insensitive)
  const filteredProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === 'shirts'
  );

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
            <span className="text-green-600 font-medium">{filteredProducts.length} Products Available</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Shirts Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We're currently updating our shirt collection. Check back soon for premium quality shirts!
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shirts;
