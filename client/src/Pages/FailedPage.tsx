import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, Home, MessageCircle, AlertTriangle } from 'lucide-react';

const FailedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full">
          {/* Error Animation Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <XCircle className="w-16 h-16 text-white animate-bounce" />
              </div>
              
              {/* Warning indicators */}
              <div className="absolute -top-4 -right-4 animate-bounce delay-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-bounce delay-300">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-pulse">
              😞 Payment Failed
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              We couldn't process your payment
            </p>
            <p className="text-lg text-gray-500">
              Don't worry, your cart items are still saved. Please try again.
            </p>
          </div>

          {/* Error Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl">
                <MessageCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What Went Wrong?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-red-600 font-bold">💳</span>
                  </div>
                  <p className="font-medium">Card Issue</p>
                  <p className="text-xs mt-1">Check your card details</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-orange-600 font-bold">🔒</span>
                  </div>
                  <p className="font-medium">Network Error</p>
                  <p className="text-xs mt-1">Connection timeout</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-yellow-600 font-bold">⚡</span>
                  </div>
                  <p className="font-medium">Server Error</p>
                  <p className="text-xs mt-1">Temporary issue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/cart" 
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </Link>
            
            <Link 
              to="/" 
              className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Additional Help */}
          <div className="text-center mt-8 text-gray-500">
            <p className="text-sm mb-2">
              Need help with your payment?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <a href="mailto:support@mendeez.com" className="text-blue-600 hover:text-blue-700 font-medium">
                📧 Email Support
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-medium">
                📞 Call Support
              </a>
              <span className="hidden sm:inline">•</span>
              <Link to="/help" className="text-blue-600 hover:text-blue-700 font-medium">
                ❓ Help Center
              </Link>
            </div>
          </div>

          {/* Floating error indicators */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-2 h-2 bg-red-400 rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-orange-400 rounded-full animate-ping delay-2000"></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-3000"></div>
            <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-red-400 rounded-full animate-ping delay-1500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedPage;
