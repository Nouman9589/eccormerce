import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useAnalytics } from '../Context/AnalyticsContext';
import AnalyticsDashboard from '../Components/AnalyticsDashboard';
import { Navigate } from 'react-router-dom';
import { RefreshCw, TrendingUp, Calendar, Users, ShoppingBag } from 'lucide-react';

const Analytics: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { getAnalyticsData, loading } = useAnalytics();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const loadAnalyticsData = async () => {
    try {
      setRefreshing(true);
      const data = await getAnalyticsData();
      setAnalyticsData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return `Last updated: ${lastUpdated.toLocaleString()}`;
  };

  if (!analyticsData && (loading || refreshing)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Gathering your business insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                  Analytics Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive business insights and performance metrics
                </p>
                {lastUpdated && (
                  <p className="mt-1 text-sm text-gray-500">{formatLastUpdated()}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={loadAnalyticsData}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {analyticsData && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-sm opacity-90">Revenue</p>
                    <p className="text-lg font-semibold">${analyticsData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-sm opacity-90">Orders</p>
                    <p className="text-lg font-semibold">{analyticsData.totalOrders.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-sm opacity-90">Customers</p>
                    <p className="text-lg font-semibold">{analyticsData.totalCustomers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  <div>
                    <p className="text-sm opacity-90">Conversion</p>
                    <p className="text-lg font-semibold">{analyticsData.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Analytics Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analyticsData ? (
          <>
            <AnalyticsDashboard data={analyticsData} />
            
            {/* Additional Admin Insights */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
              {analyticsData.topCustomers && analyticsData.topCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Customer</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Total Spent</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Orders</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-500">Avg Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topCustomers.slice(0, 5).map((customer: any) => (
                        <tr key={customer.id} className="border-b border-gray-100">
                          <td className="py-3">
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </td>
                          <td className="py-3 font-semibold text-green-600">
                            ${customer.totalSpent.toLocaleString()}
                          </td>
                          <td className="py-3 text-gray-900">
                            {customer.orderCount}
                          </td>
                          <td className="py-3 text-gray-900">
                            ${(customer.totalSpent / customer.orderCount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No customer data available yet</p>
                  <p className="text-sm text-gray-400 mt-2">Customer analytics will appear after purchases are made</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h2>
            <p className="text-gray-600 mb-4">
              Analytics data will appear once customers start interacting with your store.
            </p>
            <p className="text-sm text-gray-500">
              Track product views, cart additions, and purchases to see comprehensive insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 