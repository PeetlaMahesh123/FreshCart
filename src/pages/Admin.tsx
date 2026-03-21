import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingBag } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminUsers } from './admin/AdminUsers';
import { AdminProducts } from './admin/AdminProducts';
import { AdminOrders } from './admin/AdminOrders';
import '../styles/pages/Admin.css';

interface AdminProps {
  onNavigate?: (page: string) => void;
}

export function Admin({ onNavigate }: AdminProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (profile?.role !== 'admin') {
    return (
      <div className="admin-denied">
        <div className="denied-box">
          <h2>Access Denied</h2>
          <p>You do not have permission</p>
          <button onClick={() => onNavigate?.('home')}>
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
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={() => onNavigate?.('home')}>
          Back to Store
        </button>
      </div>

      <div className="admin-body">

        {/* SIDEBAR */}
        <div className="admin-sidebar">
          {tabs.map(tab => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
        </div>

      </div>
    </div>
  );
}