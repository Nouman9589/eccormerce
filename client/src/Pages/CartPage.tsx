import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../Context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, Heart, Tag, ShoppingCart} from "lucide-react";

interface PayPalLink {
  rel: string;
  href: string;
  method: string;
}

interface PayPalPayment {
  id: string;
  intent: string;
  state: string;
  payer: object;
  transactions: object[];
  links: PayPalLink[];
  create_time: string;
}

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    savedItems, 
    cartSummary, 
    removeItemFromCart, 
    clearCart, 
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyPromoCode,
    removePromoCode
  } = useCartContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handlePromoCode = () => {
    setPromoError('');
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const success = applyPromoCode(promoCode.trim());
    if (success) {
      setPromoCode('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code or minimum amount not met');
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Send cart data to your backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const payment: PayPalPayment = await response.json();

      // Find the approval link from the PayPal response
      const approvalLink = payment.links.find(
        (link: PayPalLink) => link.rel === "approval_url"
      )?.href;

      if (approvalLink) {
        // Redirect the user to the PayPal approval page
        window.location.href = approvalLink;
      } else {
        throw new Error("PayPal approval URL not found");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Failed to process checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(cartItems);
  

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-4">
          Looks like you haven't added anything to your cart yet
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                     transition-colors duration-200 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  // If cart is empty but there are saved items, show them
  if (cartItems.length === 0 && savedItems.length > 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 mb-4">
            But you have some items saved for later!
          </p>
        </div>

        {/* Saved Items for Empty Cart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Saved for Later ({savedItems.length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                
                <p className="font-semibold text-gray-900 mb-4">
                  USD {item.price.toFixed(2)}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item.id, item.size)}
                    className="flex-1 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => removeSavedItem(item.id, item.size)}
                    className="p-2 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100
                         hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="w-24 h-32 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.title}
                    </h3>
                    <p className="font-semibold text-gray-800">
                      USD {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-gray-500 text-sm mt-1">
                    Size: {item.size}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                                          <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-600 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => saveForLater(item.id, item.size)}
                          className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Save for Later
                        </button>

                        <button
                          onClick={() => removeItemFromCart(item.id, item.size)}
                          className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm">
                     USD {item.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Saved for Later Section */}
        {savedItems.length > 0 && (
          <div className="lg:col-span-8 mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Saved for Later ({savedItems.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-w-3 aspect-h-4 mb-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                    
                    <p className="font-semibold text-gray-900 mb-3">
                      USD {item.price.toFixed(2)}
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToCart(item.id, item.size)}
                        className="flex-1 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                      </button>
                      
                      <button
                        onClick={() => removeSavedItem(item.id, item.size)}
                        className="p-2 border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Promo Code Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handlePromoCode()}
                />
                <button
                  onClick={handlePromoCode}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-xs mt-1">{promoError}</p>
              )}
              {cartSummary.appliedPromo && (
                <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded-lg">
                  <span className="text-green-700 text-xs font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {cartSummary.appliedPromo.code} Applied
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-green-600 hover:text-green-800 text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <p>Try: SAVE10, SAVE20, WELCOME, or FREE5</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>USD {cartSummary.subtotal.toFixed(2)}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({cartSummary.appliedPromo?.code})</span>
                  <span>-USD {cartSummary.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>USD {cartSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
             hover:bg-blue-700 transition-colors duration-200
             flex items-center justify-center font-medium
             disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
              <button
                onClick={clearCart}
                className="w-full border border-gray-300 text-gray-600 py-3 px-4
               rounded-lg hover:bg-gray-50 transition-colors duration-200
               flex items-center justify-center font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

