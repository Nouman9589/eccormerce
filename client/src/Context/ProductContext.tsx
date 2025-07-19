// src/Context/ProductContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';

// Define the Product type
interface Product {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  price: string;
  originalPrice?: number;
  availableSizes?: string[];
}

// Context type definition
interface ProductContextType {
  products: Product[];
  loading: boolean;
}

// Create the ProductContext
const ProductContext = createContext<ProductContextType | null>(null);

// Custom hook to use ProductContext
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

// Provider component
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().name || doc.data().title || 'Untitled Product', // Add title property
          ...doc.data(),
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};
