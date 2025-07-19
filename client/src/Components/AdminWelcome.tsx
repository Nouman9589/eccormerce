import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Plus, BarChart3, Settings, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const AdminWelcome: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl mb-8 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome back, Admin {user.name}! 👋
                </h2>
                <p className="text-blue-100 text-lg">
                  Ready to manage your e-commerce empire?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Link
                to="/add-product"
                className="flex items-center gap-3 p-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all duration-200 group"
              >
                <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Add Products</h3>
                  <p className="text-blue-100 text-sm">Create new listings</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <Link
                to="/dashboard-items"
                className="flex items-center gap-3 p-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all duration-200 group"
              >
                <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Dashboard</h3>
                  <p className="text-blue-100 text-sm">Analytics & insights</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <div className="flex items-center gap-3 p-4 bg-white bg-opacity-10 rounded-lg">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Manage</h3>
                  <p className="text-blue-100 text-sm">Edit & delete items</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>You have full administrative privileges on this platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white bg-opacity-5 rounded-full"></div>
      <div className="absolute bottom-4 right-8 w-12 h-12 bg-white bg-opacity-5 rounded-full"></div>
    </div>
  );
};

export default AdminWelcome; 