import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductContext } from '../Context/ProductContext';
import { useCartContext } from '../Context/CartContext';
import { useAnalytics } from '../Context/AnalyticsContext';
import { useToast } from '../Components/NotificationSystem';
import Footer from '../Components/Footer';
import ProductCard from '../Components/ProductCard';
import ReviewSection from '../Components/ReviewSection';
import Loader from '../Resusebles/Loader';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProductContext();
  const { addToCart } = useCartContext();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const toast = useToast();

  const product = products.find((product) => product.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Track product view when product loads
  useEffect(() => {
    const trackView = async () => {
      if (product && !hasTrackedView) {
        try {
          await trackProductView(
            product.id,
            product.title,
            parseFloat(product.price),
            product.category || 'Product'
          );
          setHasTrackedView(true);
        } catch (error) {
          console.error('Error tracking product view:', error);
        }
      }
    };

    trackView();
  }, [product, hasTrackedView, trackProductView]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className="text-center text-xl text-gray-600 mt-12">Product not found.</div>;
  }

  const sizes = product.availableSizes || ['40', '41', '42', '43', '44', '45'];

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.warning('Select a Size', 'Please select a size before adding to cart');
      return;
    }
    
    try {
      // Track analytics first
      await trackAddToCart(
        product.id,
        product.title,
        parseFloat(product.price),
        1 // quantity is always 1 from product details page
      );
      
      const cartItem = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        imageUrl: product.imageUrl,
        size: selectedSize,
      };
      
      addToCart(cartItem);
      toast.success('Added to Cart!', `${product.title} (Size: ${selectedSize}) has been added to your cart`, {
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      });
    } catch (error) {
      console.error('Error tracking add to cart:', error);
      // Still add to cart even if analytics fails
      const cartItem = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        imageUrl: product.imageUrl,
        size: selectedSize,
      };
      
      addToCart(cartItem);
      toast.success('Added to Cart!', `${product.title} (Size: ${selectedSize}) has been added to your cart`);
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <span>Home</span>
        <span>›</span>
        <span>{product.category}</span>
        <span>›</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full rounded-lg shadow-md object-cover bg-gray-100"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl text-red-500 font-semibold">
              ${parseFloat(product.price).toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-lg">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Category</h3>
            <span className="text-sm text-gray-600">{product.category}</span>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Available Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border rounded ${
                    selectedSize === size 
                      ? 'bg-black text-white border-black' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-700 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <ReviewSection productId={id || ''} />
      </div>

      {/* You May Also Like Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              imageUrl={relatedProduct.imageUrl}
              title={relatedProduct.title}
              currentPrice={parseFloat(relatedProduct.price)}
              originalPrice={relatedProduct.originalPrice}
              availableSizes={relatedProduct.availableSizes || []}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
