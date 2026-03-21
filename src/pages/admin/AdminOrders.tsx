import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Search } from 'lucide-react';
import '../../styles/pages/AdminOrders.css';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  } | null;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles!orders_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const filtered = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      (o.user?.full_name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || o.status === statusFilter)
    );
  });

  if (loading) return <div className="loader"></div>;

  return (
    <div className="orders-container">

      <div className="orders-header">
        <h1>Orders</h1>
        <div className="orders-count">
          <Package size={18} />
          {orders.length} Orders
        </div>
      </div>

      {/* SEARCH */}
      <div className="orders-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td>{o.id.slice(0, 6)}</td>
                <td>
                  <strong>{o.user?.full_name}</strong><br />
                  <span>{o.user?.email}</span>
                </td>
                <td>₹{o.total_amount}</td>

                <td>
                  <span className={`status ${o.status}`}>
                    {o.status}
                  </span>
                </td>

                <td>{new Date(o.created_at).toLocaleDateString()}</td>

                <td>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}