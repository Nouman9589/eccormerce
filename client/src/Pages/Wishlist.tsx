import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlistContext } from '../Context/WishlistContext';
import { useCartContext } from '../Context/CartContext';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlistContext();
  const { addToCart } = useCartContext();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (item: any) => {
    const selectedSize = selectedSizes[item.id] || (item.availableSizes.length > 0 ? item.availableSizes[0] : 'One Size');
    
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
      size: selectedSize
    });

    // Optional: Remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="mb-8">
              <Heart className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite items here and never lose track of what you love.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="text-red-500 fill-current" />
              My Wishlist
              <span className="text-lg text-gray-500 font-normal">
                ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
              </span>
            </h1>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Remove from Wishlist */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-600 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Size Selection */}
                {item.availableSizes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Size:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(item.id, size)}
                          className={`px-3 py-1 text-sm rounded border transition-colors ${
                            selectedSizes[item.id] === size || (!selectedSizes[item.id] && size === item.availableSizes[0])
                              ? 'bg-black text-white border-black' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2.5 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag className="mr-2 w-4 h-4" />
            Continue Shopping
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 