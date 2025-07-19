import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../Context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

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
  const { cartItems, removeItemFromCart, clearCart, updateQuantity } =
    useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Send cart data to your backend
      const response = await fetch("http://localhost:8000/payment", {
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
  

  if (cartItems.length === 0) {
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
                     transition-colors duration-200"
        >
          Continue Shopping
        </Link>
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
              key={item.id}
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
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
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

        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>USD {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>USD {totalPrice.toLocaleString()}</span>
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

