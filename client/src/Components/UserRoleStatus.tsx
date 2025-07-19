import React, { useState } from 'react';
import { Shield, User, Crown, Settings, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const UserRoleStatus: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600 z-40">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm">Not logged in</span>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`bg-white rounded-lg shadow-lg border-2 p-4 transition-all duration-200 ${
        isAdmin ? 'border-blue-500' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <Crown className="w-5 h-5 text-blue-600" />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
            <span className={`font-semibold ${isAdmin ? 'text-blue-900' : 'text-gray-900'}`}>
              {user.name}
            </span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isAdmin 
            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          <Shield className="w-3 h-3 mr-1" />
          {isAdmin ? 'Admin User' : 'Customer'}
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <div className="text-xs text-gray-600">
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>ID:</strong> {user.id.substring(0, 8)}...</div>
            </div>

            {isAdmin && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-100">
                <div className="flex items-center gap-1 text-blue-800 text-xs font-medium mb-1">
                  <Settings className="w-3 h-3" />
                  Admin Features Available
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Product management</li>
                  <li>• Dashboard analytics</li>
                  <li>• Review moderation</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleStatus; 