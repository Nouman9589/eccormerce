import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Eye,
  Star,
  Calendar,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sold: number;
    revenue: number;
    image: string;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
  }>;
  salesData: Array<{
    month: string;
    sales: number;
    orders: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );

  const SimpleChart: React.FC<{ data: any[] }> = ({ data }) => (
    <div className="flex items-end justify-between h-40 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="bg-blue-500 rounded-t-sm mb-2 transition-all duration-300 hover:bg-blue-600"
            style={{
              height: `${(item.sales / Math.max(...data.map(d => d.sales))) * 120}px`,
              width: '20px',
            }}
          />
          <span className="text-xs text-gray-500 transform -rotate-45 origin-left">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders.toLocaleString()}
          change={8.2}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Products"
          value={data.totalProducts.toLocaleString()}
          change={-2.1}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Customers"
          value={data.totalCustomers.toLocaleString()}
          change={15.3}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts and Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <SimpleChart data={data.salesData} />
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-gray-900">{data.conversionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data.conversionRate}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-semibold text-gray-900">${data.averageOrderValue}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data.averageOrderValue / 200) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.sold} sold
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                  ${product.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">#{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${order.amount}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
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