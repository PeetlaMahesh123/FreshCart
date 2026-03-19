import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    dailyRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
      ]);

      const totalUsers = usersRes.count || 0;
      const totalProducts = productsRes.count || 0;
      const orders = ordersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const totalOrders = orders.length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dailyOrders = orders.filter(o => new Date(o.created_at) >= today);
      const dailyRevenue = dailyOrders.reduce((sum, order) => sum + order.total_amount, 0);

      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthlyOrders = orders.filter(o => new Date(o.created_at) >= thisMonth);
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total_amount, 0);

      const thisYear = new Date(today.getFullYear(), 0, 1);
      const yearlyOrders = orders.filter(o => new Date(o.created_at) >= thisYear);
      const yearlyRevenue = yearlyOrders.reduce((sum, order) => sum + order.total_amount, 0);

      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*, profiles:user_id(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
      });

      setRecentOrders(recentOrdersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5" />
            <p className="text-sm opacity-90">Daily Revenue</p>
          </div>
          <p className="text-3xl font-bold">₹{stats.dailyRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm opacity-90">Monthly Revenue</p>
          </div>
          <p className="text-3xl font-bold">₹{stats.monthlyRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm opacity-90">Yearly Revenue</p>
          </div>
          <p className="text-3xl font-bold">₹{stats.yearlyRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.profiles?.full_name || 'N/A'}
                    <br />
                    <span className="text-xs text-gray-500">{order.profiles?.email}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
