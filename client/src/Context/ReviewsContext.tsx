import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'helpful' | 'notHelpful' | 'createdAt'>) => void;
  getProductReviews: (productId: string) => Review[];
  getProductRating: (productId: string) => { averageRating: number; totalReviews: number };
  markHelpful: (reviewId: string, isHelpful: boolean) => void;
  deleteReview: (reviewId: string) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviewsContext = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviewsContext must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reviews from localStorage on component mount
  useEffect(() => {
    try {
      const savedReviews = localStorage.getItem('productReviews');
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        if (Array.isArray(parsedReviews)) {
          setReviews(parsedReviews);
        }
      } else {
        // Initialize with some sample reviews for demonstration
        const sampleReviews: Review[] = [
          {
            id: 'review_1',
            productId: '1',
            userId: 'user_1',
            userName: 'Sarah Johnson',
            rating: 5,
            title: 'Love this shirt!',
            comment: 'Perfect fit and great quality. The material is soft and comfortable. Would definitely buy again!',
            helpful: 12,
            notHelpful: 1,
            verified: true,
            createdAt: '2024-01-15T10:30:00.000Z'
          },
          {
            id: 'review_2',
            productId: '1',
            userId: 'user_2',
            userName: 'Mike Davis',
            rating: 4,
            title: 'Good quality',
            comment: 'Nice shirt, fits as expected. Only minor issue is that it wrinkles easily.',
            helpful: 8,
            notHelpful: 0,
            verified: true,
            createdAt: '2024-01-12T14:20:00.000Z'
          },
          {
            id: 'review_3',
            productId: '2',
            userId: 'user_3',
            userName: 'Emily Chen',
            rating: 5,
            title: 'Excellent shoes!',
            comment: 'These shoes are incredibly comfortable and stylish. Perfect for both work and casual wear.',
            helpful: 15,
            notHelpful: 0,
            verified: true,
            createdAt: '2024-01-14T09:45:00.000Z'
          },
          {
            id: 'review_4',
            productId: '3',
            userId: 'user_4',
            userName: 'David Wilson',
            rating: 4,
            title: 'Great accessory',
            comment: 'Well-made and looks exactly like the pictures. Delivery was fast too.',
            helpful: 6,
            notHelpful: 1,
            verified: true,
            createdAt: '2024-01-13T16:15:00.000Z'
          }
        ];
        setReviews(sampleReviews);
      }
    } catch (error) {
      console.error('Failed to parse reviews from localStorage:', error);
      localStorage.removeItem('productReviews');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('productReviews', JSON.stringify(reviews));
        console.log('Reviews saved to localStorage:', reviews.length, 'reviews');
      } catch (error) {
        console.error('Failed to save reviews to localStorage:', error);
      }
    }
  }, [reviews, isLoaded]);

  const addReview = (reviewData: Omit<Review, 'id' | 'helpful' | 'notHelpful' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString()
    };

    setReviews(prevReviews => [newReview, ...prevReviews]);
    console.log('New review added:', newReview.title);
  };

  const getProductReviews = (productId: string): Review[] => {
    return reviews.filter(review => review.productId === productId);
  };

  const getProductRating = (productId: string): { averageRating: number; totalReviews: number } => {
    const productReviews = getProductReviews(productId);
    const totalReviews = productReviews.length;
    
    if (totalReviews === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10; // Round to 1 decimal place

    return { averageRating, totalReviews };
  };

  const markHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              helpful: isHelpful ? review.helpful + 1 : review.helpful,
              notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
            }
          : review
      )
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    console.log('Review deleted:', reviewId);
  };

  const value: ReviewsContextType = {
    reviews,
    addReview,
    getProductReviews,
    getProductRating,
    markHelpful,
    deleteReview
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}; 