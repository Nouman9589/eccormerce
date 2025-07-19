// types.ts
export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
    size: string;
  }
  
  export interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeItemFromCart: (id: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
  }
  
  // CartContext.tsx
  import React, { createContext, useContext, useState, useEffect } from 'react';
  // import { CartContextType, CartItem } from './types';
  
  const CartContext = createContext<CartContextType | undefined>(undefined);
  
  export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
  };
  
  export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
    useEffect(() => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart items from localStorage:', error);
        }
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
  
    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
      setCartItems((prevItems) => {
        const itemExists = prevItems.find(item => item.id === product.id);
        if (itemExists) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      });
    };
  
    const updateQuantity = (id: string, quantity: number) => {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0)
      );
    };
  
    const removeItemFromCart = (id: string) => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };
  
    const clearCart = () => {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    };
  
    return (
      <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeItemFromCart, 
        clearCart,
        updateQuantity 
      }}>
        {children}
      </CartContext.Provider>
    );
  };