import React, { useState } from 'react';
import { Shield, TestTube, Copy, Check, AlertCircle } from 'lucide-react';

const AdminTestHelper: React.FC = () => {
  const [showHelper, setShowHelper] = useState(false);
  const [copied, setCopied] = useState<string>('');

  const testAccounts = [
    {
      email: 'admin@mendeez.com',
      password: 'admin123',
      role: 'Admin',
      description: 'Full admin privileges'
    },
    {
      email: 'testadmin@gmail.com', 
      password: 'test123',
      role: 'Admin',
      description: 'Test admin account'
    },
    {
      email: 'customer@mendeez.com',
      password: 'test123', 
      role: 'Customer',
      description: 'Regular customer account'
    }
  ];

  const copyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 1500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!showHelper) {
    return (
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setShowHelper(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
          title="Show admin test helper"
        >
          <TestTube className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Test Accounts</h3>
        </div>
        <button
          onClick={() => setShowHelper(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {testAccounts.map((account, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                account.role === 'Admin' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <Shield className="w-3 h-3 mr-1" />
                {account.role}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[60px]">Email:</span>
                <code className="flex-1 bg-white px-2 py-1 rounded border text-xs">
                  {account.email}
                </code>
                <button
                  onClick={() => copyText(account.email, `email-${index}`)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Copy email"
                >
                  {copied === `email-${index}` ? 
                    <Check className="w-3 h-3 text-green-600" /> : 
                    <Copy className="w-3 h-3 text-gray-400" />
                  }
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 min-w-[60px]">Pass:</span>
                <code className="flex-1 bg-white px-2 py-1 rounded border text-xs">
                  {account.password}
                </code>
                <button
                  onClick={() => copyText(account.password, `pass-${index}`)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Copy password"
                >
                  {copied === `pass-${index}` ? 
                    <Check className="w-3 h-3 text-green-600" /> : 
                    <Copy className="w-3 h-3 text-gray-400" />
                  }
                </button>
              </div>
              
              <p className="text-xs text-gray-500">{account.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Quick Admin Access:</p>
            <p>Any email containing "admin" gets admin privileges automatically!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestHelper; 