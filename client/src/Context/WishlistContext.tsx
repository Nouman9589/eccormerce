import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  availableSizes: string[];
  rating?: number;
  reviewCount?: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist items from localStorage on component mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlistItems');
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          setWishlistItems(parsedWishlist);
        }
      }
    } catch (error) {
      console.error('Failed to parse wishlist items from localStorage:', error);
      localStorage.removeItem('wishlistItems');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save wishlist items to localStorage whenever wishlistItems changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        console.log('Wishlist saved to localStorage:', wishlistItems.length, 'items');
      } catch (error) {
        console.error('Failed to save wishlist items to localStorage:', error);
      }
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prevItems => {
      // Check if item already exists in wishlist
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        console.log('Item already in wishlist:', product.title);
        return prevItems;
      }
      
      console.log('Adding to wishlist:', product.title);
      return [...prevItems, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.id !== id);
      console.log('Removing from wishlist, remaining items:', filteredItems.length);
      return filteredItems;
    });
  };

  const isInWishlist = (id: string): boolean => {
    return wishlistItems.some(item => item.id === id);
  };

  const clearWishlist = () => {
    console.log('Clearing wishlist');
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 