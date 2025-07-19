import React, { useState } from 'react';
import { Shield, Info, Copy, Check } from 'lucide-react';

const AdminInfo: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const adminEmail = 'admin@mendeez.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(adminEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Admin Access</h4>
          <p className="text-sm text-blue-700 mb-3">
            To get admin privileges, register with an email containing "admin" or use:
          </p>
          
          <div className="flex items-center gap-2 bg-white rounded-md p-2 border">
            <span className="text-sm font-mono text-gray-800 flex-1">{adminEmail}</span>
            <button
              onClick={copyEmail}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="mt-3 text-xs text-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Admin Features:</span>
            </div>
            <ul className="ml-6 space-y-1 text-blue-600">
              <li>• Add, edit, and delete products</li>
              <li>• Access analytics dashboard</li>
              <li>• Manage customer reviews</li>
              <li>• View detailed product metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo; 