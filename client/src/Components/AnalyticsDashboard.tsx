import React from 'react';
import {
  TrendingUp,
  Package,
  Users,
  Eye,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
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
    image: string;
  }>;
  recentActivity: Array<{
    id: string;
    customer: string;
    action: string;
    product?: string;
    timestamp: string;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    customers: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 bg-blue-50',
    green: 'from-green-500 to-green-600 bg-green-50',
    purple: 'from-purple-500 to-purple-600 bg-purple-50',
    orange: 'from-orange-500 to-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toLocaleString()}`}
          change="+12%"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={data.totalProducts.toLocaleString()}
          change="+5%"
          icon={<Package className="w-6 h-6 text-white" />}
          color="green"
        />
        <StatCard
          title="Total Customers"
          value={data.totalCustomers.toLocaleString()}
          change="+8%"
          icon={<Users className="w-6 h-6 text-white" />}
          color="purple"
        />
        <StatCard
          title="Product Views"
          value={data.productViews.toLocaleString()}
          change="+15%"
          icon={<Eye className="w-6 h-6 text-white" />}
          color="orange"
        />
      </div>

      {/* Charts and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-gray-900">{data.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${data.conversionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Average Cart Value</span>
                <span className="font-semibold text-gray-900">${data.averageCartValue}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((data.averageCartValue / 1000) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$1000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Activity Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <div className="h-40 flex items-end justify-between space-x-2">
            {data.monthlyStats.map((stat) => (
              <div key={stat.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                  style={{ height: `${(stat.views / 1000) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.views} views • {product.addedToCart} cart adds</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.views}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.customer}</p>
                    <p className="text-sm text-gray-500">{activity.action} {activity.product && `• ${activity.product}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 