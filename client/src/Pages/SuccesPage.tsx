import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, User, Sparkles, Heart } from 'lucide-react';
import { useCartContext } from '../Context/CartContext';
import { useAnalytics } from '../Context/AnalyticsContext';

const SuccessPage: React.FC = () => {
  const { cartItems, clearCart } = useCartContext();
  const { trackPurchase } = useAnalytics();
  const [hasTrackedPurchase, setHasTrackedPurchase] = useState(false);

  // Track purchase and clear cart on successful payment
  useEffect(() => {
    const trackPurchaseAndClearCart = async () => {
      if (!hasTrackedPurchase && cartItems.length > 0) {
        try {
          // Calculate total from cart items
          const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          // Track the purchase
          await trackPurchase({
            total,
            items: cartItems.map(item => ({
              productId: item.id,
              productName: item.title,
              price: item.price,
              quantity: item.quantity,
              category: 'Product' // You can enhance this based on your product categories
            })),
            paymentMethod: 'PayPal'
          });

          setHasTrackedPurchase(true);
          console.log('Purchase tracked successfully!');
        } catch (error) {
          console.error('Error tracking purchase:', error);
        }
      }
      
      // Clear cart after tracking (or immediately if no items)
      clearCart();
    };

    trackPurchaseAndClearCart();
  }, [cartItems, trackPurchase, clearCart, hasTrackedPurchase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          {/* Success Animation Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-16 h-16 text-white animate-bounce" />
              </div>
              
              {/* Floating sparkles */}
              <div className="absolute -top-4 -right-4 animate-bounce delay-100">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-bounce delay-300">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div className="absolute top-8 -left-8 animate-bounce delay-200">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Success Content */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-pulse">
              🎉 Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your purchase!
            </p>
            <p className="text-lg text-gray-500">
              Your order has been confirmed and is being processed.
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What's Next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-xs mt-1">Email sent to your inbox</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <p className="font-medium">Processing</p>
                  <p className="text-xs mt-1">2-3 business days</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-xs mt-1">5-7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link 
              to="/profile" 
              className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <User className="w-5 h-5 mr-2" />
              View Profile
            </Link>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@mendeez.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@mendeez.com
              </a>
            </p>
          </div>

          {/* Celebration Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-2000"></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping delay-3000"></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
