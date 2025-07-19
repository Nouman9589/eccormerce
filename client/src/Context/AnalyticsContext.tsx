import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import { useAuth } from './AuthContext';

interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'purchase' | 'wishlist_add' | 'search' | 'user_signup' | 'user_login';
  userId?: string;
  userEmail?: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  category?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  productViews: number;
  conversionRate: number;
  averageCartValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    views: number;
    addedToCart: number;
    purchases: number;
    revenue: number;
    image: string;
  }>;
  recentActivity: Array<{
    id: string;
    customer: string;
    action: string;
    product?: string;
    timestamp: string;
    value?: number;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    customers: number;
    revenue: number;
    orders: number;
  }>;
  topCustomers: Array<{
    id: string;
    email: string;
    name: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

interface AnalyticsContextType {
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => Promise<void>;
  trackPurchase: (orderDetails: {
    total: number;
    items: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      category?: string;
    }>;
    paymentMethod: string;
  }) => Promise<void>;
  trackProductView: (productId: string, productName: string, price: number, category?: string) => Promise<void>;
  trackAddToCart: (productId: string, productName: string, price: number, quantity: number) => Promise<void>;
  trackSearch: (searchTerm: string, results: number) => Promise<void>;
  getAnalyticsData: () => Promise<AnalyticsData>;
  loading: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());

  // Track event to Firestore
  const trackEvent = async (eventData: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>): Promise<void> => {
    try {
      const event: AnalyticsEvent = {
        ...eventData,
        userId: user?.id,
        userEmail: user?.email,
        timestamp: new Date(),
        sessionId
      };

      await addDoc(collection(db, 'analytics_events'), {
        ...event,
        timestamp: Timestamp.fromDate(event.timestamp)
      });

      // Update daily aggregates
      await updateDailyAggregates(event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Track purchase with detailed items
  const trackPurchase = async (orderDetails: {
    total: number;
    items: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      category?: string;
    }>;
    paymentMethod: string;
  }): Promise<void> => {
    try {
      // Track main purchase event
      await trackEvent({
        type: 'purchase',
        value: orderDetails.total,
        metadata: {
          itemCount: orderDetails.items.length,
          paymentMethod: orderDetails.paymentMethod,
          items: orderDetails.items
        }
      });

      // Track individual product purchases
      for (const item of orderDetails.items) {
        await trackEvent({
          type: 'purchase',
          productId: item.productId,
          productName: item.productName,
          productPrice: item.price,
          category: item.category,
          value: item.price * item.quantity,
          metadata: {
            quantity: item.quantity,
            paymentMethod: orderDetails.paymentMethod
          }
        });
      }
    } catch (error) {
      console.error('Error tracking purchase:', error);
    }
  };

  // Track product view
  const trackProductView = async (productId: string, productName: string, price: number, category?: string): Promise<void> => {
    await trackEvent({
      type: 'product_view',
      productId,
      productName,
      productPrice: price,
      category,
      value: price
    });
  };

  // Track add to cart
  const trackAddToCart = async (productId: string, productName: string, price: number, quantity: number): Promise<void> => {
    await trackEvent({
      type: 'add_to_cart',
      productId,
      productName,
      productPrice: price,
      value: price * quantity,
      metadata: { quantity }
    });
  };

  // Track search
  const trackSearch = async (searchTerm: string, results: number): Promise<void> => {
    await trackEvent({
      type: 'search',
      metadata: {
        searchTerm,
        resultCount: results
      }
    });
  };

  // Update daily aggregates for better performance
  const updateDailyAggregates = async (_event: AnalyticsEvent): Promise<void> => {
    try {
      // This would be better implemented with Cloud Functions for atomic updates
      // For now, we'll keep it simple with the events collection
    } catch (error) {
      console.error('Error updating daily aggregates:', error);
    }
  };

  // Get comprehensive analytics data
  const getAnalyticsData = async (): Promise<AnalyticsData> => {
    setLoading(true);
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get recent events
      const eventsQuery = query(
        collection(db, 'analytics_events'),
        where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo)),
        orderBy('timestamp', 'desc'),
        limit(1000)
      );

      const eventsSnapshot = await getDocs(eventsQuery);
      const events: AnalyticsEvent[] = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as AnalyticsEvent[];

      // Calculate metrics
      const purchaseEvents = events.filter(e => e.type === 'purchase');
      const productViewEvents = events.filter(e => e.type === 'product_view');

      // Total revenue from purchases
      const totalRevenue = purchaseEvents.reduce((sum, event) => sum + (event.value || 0), 0);
      
      // Get unique orders (purchases without productId are order-level events)
      const orderEvents = purchaseEvents.filter(e => !e.productId);
      const totalOrders = orderEvents.length;

      // Calculate conversion rate
      const uniqueViews = new Set(productViewEvents.map(e => `${e.userId}-${e.productId}`)).size;
      const uniquePurchases = new Set(purchaseEvents.filter(e => e.productId).map(e => `${e.userId}-${e.productId}`)).size;
      const conversionRate = uniqueViews > 0 ? (uniquePurchases / uniqueViews) * 100 : 0;

      // Average cart value
      const averageCartValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top products analytics
      const productStats = new Map<string, {
        id: string;
        name: string;
        views: number;
        addedToCart: number;
        purchases: number;
        revenue: number;
      }>();

      // Count product interactions
      events.forEach(event => {
        if (event.productId && event.productName) {
          const key = event.productId;
          const current = productStats.get(key) || {
            id: event.productId,
            name: event.productName,
            views: 0,
            addedToCart: 0,
            purchases: 0,
            revenue: 0
          };

          if (event.type === 'product_view') current.views++;
          if (event.type === 'add_to_cart') current.addedToCart++;
          if (event.type === 'purchase' && event.productId) {
            current.purchases++;
            current.revenue += (event.value || 0);
          }

          productStats.set(key, current);
        }
      });

      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(product => ({
          ...product,
          image: `https://ui-avatars.com/api/?name=${product.name}&background=random`
        }));

      // Recent activity
      const recentActivity = events
        .slice(0, 20)
        .map(event => ({
          id: event.id || '',
          customer: event.userEmail || 'Anonymous',
          action: getActionDescription(event),
          product: event.productName,
          timestamp: formatTimestamp(event.timestamp),
          value: event.value
        }));

      // Monthly stats (last 6 months)
      const monthlyStats = generateMonthlyStats(events);

      // Top customers
      const customerStats = new Map<string, {
        id: string;
        email: string;
        name: string;
        totalSpent: number;
        orderCount: number;
      }>();

      orderEvents.forEach(event => {
        if (event.userEmail) {
          const current = customerStats.get(event.userEmail) || {
            id: event.userId || '',
            email: event.userEmail,
            name: event.userEmail.split('@')[0],
            totalSpent: 0,
            orderCount: 0
          };

          current.totalSpent += (event.value || 0);
          current.orderCount++;
          customerStats.set(event.userEmail, current);
        }
      });

      const topCustomers = Array.from(customerStats.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      return {
        totalRevenue,
        totalOrders,
        totalProducts: topProducts.length,
        totalCustomers: new Set(events.map(e => e.userEmail).filter(Boolean)).size,
        productViews: productViewEvents.length,
        conversionRate: Number(conversionRate.toFixed(2)),
        averageCartValue: Number(averageCartValue.toFixed(2)),
        topProducts,
        recentActivity,
        monthlyStats,
        topCustomers
      };

    } catch (error) {
      console.error('Error getting analytics data:', error);
      return getEmptyAnalyticsData();
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getActionDescription = (event: AnalyticsEvent): string => {
    switch (event.type) {
      case 'purchase': return 'Made a purchase';
      case 'product_view': return 'Viewed product';
      case 'add_to_cart': return 'Added to cart';
      case 'remove_from_cart': return 'Removed from cart';
      case 'wishlist_add': return 'Added to wishlist';
      case 'search': return `Searched for "${event.metadata?.searchTerm}"`;
      case 'user_signup': return 'Signed up';
      case 'user_login': return 'Logged in';
      default: return 'Unknown action';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const generateMonthlyStats = (events: AnalyticsEvent[]) => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthEvents = events.filter(e => 
        e.timestamp >= monthStart && e.timestamp <= monthEnd
      );

      const monthViews = monthEvents.filter(e => e.type === 'product_view').length;
      const monthCustomers = new Set(monthEvents.map(e => e.userEmail).filter(Boolean)).size;
      const monthRevenue = monthEvents
        .filter(e => e.type === 'purchase')
        .reduce((sum, e) => sum + (e.value || 0), 0);
      const monthOrders = monthEvents
        .filter(e => e.type === 'purchase' && !e.productId).length;

      months.push({
        month: monthName,
        views: monthViews,
        customers: monthCustomers,
        revenue: monthRevenue,
        orders: monthOrders
      });
    }

    return months;
  };

  const getEmptyAnalyticsData = (): AnalyticsData => ({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    productViews: 0,
    conversionRate: 0,
    averageCartValue: 0,
    topProducts: [],
    recentActivity: [],
    monthlyStats: [],
    topCustomers: []
  });

  // Track user login/signup
  useEffect(() => {
    if (user) {
      trackEvent({
        type: 'user_login'
      });
    }
  }, [user]);

  const value: AnalyticsContextType = {
    trackEvent,
    trackPurchase,
    trackProductView,
    trackAddToCart,
    trackSearch,
    getAnalyticsData,
    loading
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}; 