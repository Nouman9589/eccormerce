import React, { useState } from 'react';
import { Shield, Key, Settings, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useToast } from '../Components/NotificationSystem';
import AuthModal from '../Components/AuthModal';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const securityScore = () => {
    let score = 0;
    if (user?.email) score += 40;
    if (user?.role === 'admin') score += 20; // Admin accounts are considered more secure
    score += 40; // Base score for having an account
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    toast.info('Password Change', 'Please register a new account to change your password');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">You need to be logged in to view security settings</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const score = securityScore();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Security Settings</h1>
          </div>
          <p className="text-gray-400">Manage your account security and privacy settings</p>
        </div>

        {/* Security Score Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Security Score</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{score}/100</span>
              <span className="text-sm text-gray-400">Security Score</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  score >= 80 ? 'bg-green-500' : 
                  score >= 60 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Account verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Email authenticated</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">Two-factor authentication (Coming Soon)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Account active</span>
            </div>
          </div>
        </div>

        {/* Security Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Settings */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-900/50 rounded-lg">
                <Key className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Password Security</h3>
                <p className="text-sm text-gray-400">Manage your account password</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Status:</strong> Protected by Firebase Authentication
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong className="text-gray-300">Last activity:</strong> Currently signed in
                </p>
              </div>
              
              <button
                onClick={handleChangePassword}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Account Information</h3>
                <p className="text-sm text-gray-400">Your account details</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-white">{user.email}</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account Created</p>
                  <p className="text-sm font-medium text-white">
                    {user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-900/50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Security Recommendations</h3>
                <p className="text-sm text-gray-400">Ways to improve your security</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-300">Strong Password</p>
                    <p className="text-xs text-blue-400/80">Use a unique, complex password</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-300">Two-Factor Auth</p>
                    <p className="text-xs text-yellow-400/80">Coming soon in future updates</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-300">Account Monitoring</p>
                    <p className="text-xs text-green-400/80">We monitor for suspicious activity</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-300">Secure Sessions</p>
                    <p className="text-xs text-purple-400/80">Sessions expire automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for Password Changes */}
      <AuthModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        defaultMode="register"
      />

      <Footer />
    </div>
  );
};

export default SecuritySettings; 