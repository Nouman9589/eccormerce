
import Categorylink from '../Components/Categorylink';
import ProductCard from '../Components/ProductCard';
import { useProductContext } from '../Context/ProductContext';
import Footer from '../Components/Footer';
import Loader from '../Resusebles/Loader';
import { Tag, Package } from 'lucide-react';

const Accessories = () => {
  const { products, loading } = useProductContext();

  // Filter products where the category is 'accessories'
  const filteredProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === 'accessories'
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
      <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Accessories</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your look with our premium collection of accessories. From elegant jewelry to stylish bags and more.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Tag className="w-5 h-5 text-purple-600" />
            <span className="text-purple-600 font-medium">{filteredProducts.length} Products Available</span>
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
                  rating={4.3}
                  reviewCount={Math.floor(Math.random() * 50) + 1}
                  isNew={Math.random() > 0.8}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Accessories Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We're currently updating our accessories collection. Check back soon for amazing new products!
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Accessories;
