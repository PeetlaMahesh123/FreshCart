import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingBag, Tag } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminUsers } from './admin/AdminUsers';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export function Admin({ onNavigate }: AdminProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to access this page</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => onNavigate('home')}
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <nav className="space-y-1 p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
          </div>
        </div>
      </div>
    </div>
  );
}
