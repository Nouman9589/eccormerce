import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { useCartContext } from '../Context/CartContext';
import { useWishlistContext } from '../Context/WishlistContext';
import { useAnalytics } from '../Context/AnalyticsContext';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  currentPrice: number;
  originalPrice?: number;
  availableSizes: string[];
  currency?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  title,
  currentPrice,
  originalPrice,
  availableSizes = [],
  rating = 4.5,
  reviewCount = 0,
  isNew = false,
  discount
}) => {
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistContext();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  
  const isWishlisted = isInWishlist(id);

  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : discount;

  const handleQuickAdd = async () => {
    // const size = selectedSize || (availableSizes.length > 0 ? availableSizes[0] : 'One Size');
    
    // Track add to cart analytics
    await trackAddToCart(id, title, currentPrice, 1);
    
    if (availableSizes.length > 0) {
      if (!selectedSize) {
        // If no size selected, use the first available size or show selector
        const defaultSize = availableSizes[0];
        addToCart({
          id,
          title,
          price: currentPrice,
          imageUrl,
          size: defaultSize
        });
      } else {
        addToCart({
          id,
          title,
          price: currentPrice,
          imageUrl,
          size: selectedSize
        });
      }
    } else {
      // No sizes available, add with default size
      addToCart({
        id,
        title,
        price: currentPrice,
        imageUrl,
        size: 'One Size'
      });
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        title,
        price: currentPrice,
        originalPrice,
        imageUrl,
        availableSizes,
        rating,
        reviewCount
      });
    }
  };

  const handleMouseEnter = async () => {
    setIsHovered(true);
    
    // Track product view analytics (only once per product card instance)
    if (!hasTrackedView) {
      await trackProductView(id, title, currentPrice);
      setHasTrackedView(true);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Link to={`/product/${id}`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              NEW
            </span>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          
          <Link 
            to={`/product/${id}`}
            className="p-2 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500 rounded-full shadow-md transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add to Cart */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {availableSizes.length > 0 && showSizeSelector ? (
            <div className="bg-white rounded-lg p-2 shadow-lg border">
              <div className="grid grid-cols-3 gap-1 mb-2">
                {availableSizes.slice(0, 6).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeSelector(false);
                      handleQuickAdd();
                    }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-black hover:text-white rounded transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSizeSelector(false)}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={availableSizes.length > 1 ? () => setShowSizeSelector(true) : handleQuickAdd}
              className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {availableSizes.length > 1 ? 'Select Size' : 'Quick Add'}
              {availableSizes.length === 1 && (
                <span className="text-xs opacity-75">({availableSizes[0]})</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-gray-900 text-sm font-medium mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Available Sizes */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {availableSizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border"
              >
                {size}
              </span>
            ))}
            {availableSizes.length > 4 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{availableSizes.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
