import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
      <p className="text-gray-500 mb-4">Your payment was successful. Thank you for your purchase!</p>
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                   transition-colors duration-200"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default SuccessPage;
