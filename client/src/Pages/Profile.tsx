import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera,
  ShoppingBag,
  Heart,
  Star,
  Calendar,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Components/NotificationSystem';

const Profile: React.FC = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile Updated', 'Your profile has been updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-500 mb-2">{user.email}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {user.role === 'admin' ? '👑 Administrator' : '🛍️ Customer'}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div>
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-gray-500">Favorites</p>
                </div>
                <div>
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since {user.createdAt?.getFullYear() || new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Account Settings</span>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Notifications</span>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <Heart className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">My Wishlist</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your full name"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                          <User className="text-gray-400 w-5 h-5 mr-3" />
                          <span className="text-gray-900">{user.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <Mail className="text-gray-400 w-5 h-5 mr-3" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                          <Phone className="text-gray-400 w-5 h-5 mr-3" />
                          <span className="text-gray-900">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                  <div className="space-y-4">
                    {/* Street Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      {isEditing ? (
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, street: e.target.value }
                            })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your street address"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                          <MapPin className="text-gray-400 w-5 h-5 mr-3" />
                          <span className="text-gray-900">{user.address?.street || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, city: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="City"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{user.address?.city || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, state: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="State"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{user.address?.state || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              address: { ...formData.address, zipCode: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ZIP"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-gray-900">{user.address?.zipCode || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.address.country}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            address: { ...formData.address, country: e.target.value }
                          })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Country"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-900">{user.address?.country || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 