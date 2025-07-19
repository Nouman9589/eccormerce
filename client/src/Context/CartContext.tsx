// types.ts
export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
    size: string;
  }

export interface SavedItem extends Omit<CartItem, 'quantity'> {
  savedAt: string;
}

export interface PromoCode {
  code: string;
  discount: number; // percentage
  discountType: 'percentage' | 'fixed';
  minAmount?: number;
  description?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  appliedPromo?: PromoCode;
}
  
  export interface CartContextType {
    cartItems: CartItem[];
    savedItems: SavedItem[];
    cartSummary: CartSummary;
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeItemFromCart: (id: string, size: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    saveForLater: (id: string, size: string) => void;
    moveToCart: (id: string, size: string) => void;
    removeSavedItem: (id: string, size: string) => void;
    applyPromoCode: (code: string) => boolean;
    removePromoCode: () => void;
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
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | undefined>(undefined);
    const [isLoaded, setIsLoaded] = useState(false);

    // Available promo codes
    const availablePromoCodes: PromoCode[] = [
      {
        code: 'SAVE10',
        discount: 10,
        discountType: 'percentage',
        description: '10% off your order'
      },
      {
        code: 'SAVE20',
        discount: 20,
        discountType: 'percentage',
        minAmount: 100,
        description: '20% off orders over $100'
      },
      {
        code: 'WELCOME',
        discount: 15,
        discountType: 'percentage',
        description: '15% off for new customers'
      },
      {
        code: 'FREE5',
        discount: 5,
        discountType: 'fixed',
        description: '$5 off your order'
      }
    ];
  
    // Load cart items, saved items, and promo from localStorage on component mount
    useEffect(() => {
      try {
        // Load cart items
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          }
        }

        // Load saved items
        const savedForLater = localStorage.getItem('savedItems');
        if (savedForLater) {
          const parsedSaved = JSON.parse(savedForLater);
          if (Array.isArray(parsedSaved)) {
            setSavedItems(parsedSaved);
          }
        }

        // Load applied promo
        const savedPromo = localStorage.getItem('appliedPromo');
        if (savedPromo) {
          const parsedPromo = JSON.parse(savedPromo);
          setAppliedPromo(parsedPromo);
        }
      } catch (error) {
        console.error('Failed to parse data from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('cartItems');
        localStorage.removeItem('savedItems');
        localStorage.removeItem('appliedPromo');
      } finally {
        setIsLoaded(true);
      }
    }, []);
  
    // Save data to localStorage whenever it changes (but only after initial load)
    useEffect(() => {
      if (!isLoaded) return;
      
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart items to localStorage:', error);
      }
    }, [cartItems, isLoaded]);

    useEffect(() => {
      if (!isLoaded) return;
      
      try {
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
      } catch (error) {
        console.error('Failed to save saved items to localStorage:', error);
      }
    }, [savedItems, isLoaded]);

    useEffect(() => {
      if (!isLoaded) return;
      
      try {
        if (appliedPromo) {
          localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo));
        } else {
          localStorage.removeItem('appliedPromo');
        }
      } catch (error) {
        console.error('Failed to save promo code to localStorage:', error);
      }
    }, [appliedPromo, isLoaded]);
  
    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
      setCartItems((prevItems) => {
        // Check if item with same ID and size already exists
        const itemExists = prevItems.find(item => 
          item.id === product.id && item.size === product.size
        );
        
        if (itemExists) {
          // Update quantity of existing item
          return prevItems.map(item =>
            item.id === product.id && item.size === product.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        // Add new item to cart
        return [...prevItems, { ...product, quantity: 1 }];
      });
    };
  
    const updateQuantity = (id: string, size: string, quantity: number) => {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
      );
    };
  
    const removeItemFromCart = (id: string, size: string) => {
      setCartItems(prevItems => 
        prevItems.filter(item => !(item.id === id && item.size === size))
      );
    };
  
    const clearCart = () => {
      setCartItems([]);
      setAppliedPromo(undefined);
      try {
        localStorage.removeItem('cartItems');
      } catch (error) {
        console.error('Failed to clear cart from localStorage:', error);
      }
    };

    // Calculate cart summary
    const cartSummary: CartSummary = React.useMemo(() => {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discount = 0;
      
      if (appliedPromo) {
        if (appliedPromo.discountType === 'percentage') {
          discount = (subtotal * appliedPromo.discount) / 100;
        } else {
          discount = appliedPromo.discount;
        }
      }
      
      const total = Math.max(0, subtotal - discount);
      
      return {
        subtotal,
        discount,
        total,
        appliedPromo
      };
    }, [cartItems, appliedPromo]);

    // Save for later functionality
    const saveForLater = (id: string, size: string) => {
      const item = cartItems.find(item => item.id === id && item.size === size);
      if (!item) return;

      const savedItem: SavedItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        size: item.size,
        savedAt: new Date().toISOString()
      };

      setSavedItems(prevSaved => [...prevSaved, savedItem]);
      removeItemFromCart(id, size);
    };

    const moveToCart = (id: string, size: string) => {
      const savedItem = savedItems.find(item => item.id === id && item.size === size);
      if (!savedItem) return;

      addToCart({
        id: savedItem.id,
        title: savedItem.title,
        price: savedItem.price,
        imageUrl: savedItem.imageUrl,
        size: savedItem.size
      });

      setSavedItems(prevSaved => 
        prevSaved.filter(item => !(item.id === id && item.size === size))
      );
    };

    const removeSavedItem = (id: string, size: string) => {
      setSavedItems(prevSaved => 
        prevSaved.filter(item => !(item.id === id && item.size === size))
      );
    };

    // Promo code functionality
    const applyPromoCode = (code: string): boolean => {
      const promo = availablePromoCodes.find(p => p.code.toLowerCase() === code.toLowerCase());
      
      if (!promo) {
        return false; // Invalid code
      }

      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (promo.minAmount && subtotal < promo.minAmount) {
        return false; // Minimum amount not met
      }

      setAppliedPromo(promo);
      return true; // Successfully applied
    };

    const removePromoCode = () => {
      setAppliedPromo(undefined);
    };
  
    return (
      <CartContext.Provider value={{ 
        cartItems,
        savedItems,
        cartSummary,
        addToCart, 
        removeItemFromCart, 
        clearCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        removeSavedItem,
        applyPromoCode,
        removePromoCode
      }}>
        {children}
      </CartContext.Provider>
    );
  };