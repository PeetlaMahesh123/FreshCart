import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import '../../styles/pages/AdminDashboard.css';

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

      const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
      const totalOrders = orders.length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyRevenue = orders
        .filter(o => new Date(o.created_at) >= today)
        .reduce((sum, o) => sum + o.total_amount, 0);

      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthlyRevenue = orders
        .filter(o => new Date(o.created_at) >= thisMonth)
        .reduce((sum, o) => sum + o.total_amount, 0);

      const thisYear = new Date(today.getFullYear(), 0, 1);
      const yearlyRevenue = orders
        .filter(o => new Date(o.created_at) >= thisYear)
        .reduce((sum, o) => sum + o.total_amount, 0);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* STATS */}
      <div className="dashboard-grid">

        <div className="dashboard-card">
          <div className="card-content">
            <div>
              <p className="label">Users</p>
              <h2>{stats.totalUsers}</h2>
            </div>
            <div className="icon-box blue"><Users size={20} /></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <div>
              <p className="label">Orders</p>
              <h2>{stats.totalOrders}</h2>
            </div>
            <div className="icon-box green"><ShoppingBag size={20} /></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <div>
              <p className="label">Products</p>
              <h2>{stats.totalProducts}</h2>
            </div>
            <div className="icon-box orange"><Package size={20} /></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <div>
              <p className="label">Revenue</p>
              <h2>₹{stats.totalRevenue.toFixed(0)}</h2>
            </div>
            <div className="icon-box red"><DollarSign size={20} /></div>
          </div>
        </div>

      </div>

      {/* REVENUE */}
      <div className="revenue-grid">

        <div className="revenue-card blue">
          <p>Daily</p>
          <h2>₹{stats.dailyRevenue.toFixed(2)}</h2>
        </div>

        <div className="revenue-card green">
          <p>Monthly</p>
          <h2>₹{stats.monthlyRevenue.toFixed(2)}</h2>
        </div>

        <div className="revenue-card orange">
          <p>Yearly</p>
          <h2>₹{stats.yearlyRevenue.toFixed(2)}</h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="dashboard-table">
        <h2>Recent Orders</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td>{o.id.slice(0, 6)}</td>
                <td>{o.profiles?.full_name}</td>
                <td>₹{o.total_amount}</td>
                <td><span className={`status ${o.status}`}>{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}