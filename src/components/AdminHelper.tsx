import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Shield } from 'lucide-react';

export function AdminHelper() {
  const { makeAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMakeAdmin = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await makeAdmin(email);
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(`Successfully made ${email} an admin!`);
        setEmail('');
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Crown className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Admin Helper</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Enter an email address to make that user an admin. This user must already be registered.
      </p>

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <button
          onClick={handleMakeAdmin}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Shield className="h-4 w-4" />
          <span>{loading ? 'Making Admin...' : 'Make Admin'}</span>
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Quick Test:</h4>
        <p className="text-sm text-yellow-700">
          Register with "admin@freshcart.com" then enter that email here to make it an admin account.
        </p>
      </div>
    </div>
  );
}
