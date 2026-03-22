import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Orders.css';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        items:order_items (
          quantity,
          product:products (name, image_url, price)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    }

    setOrders(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="orders-container">

      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 && (
        <div className="orders-empty">No orders found</div>
      )}

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">

            {/* HEADER */}
            <div className="order-header">
              <div>
                <p className="order-id">Order ID: {order.id}</p>
                <p className="order-date">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="order-item">

                  {/* IMAGE */}
                  <div className="order-img">
                    <img
                      src={
                        item.product?.image_url ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/100";
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="order-info">
                    <p className="item-name">
                      {item.product?.name}
                    </p>
                    <p className="item-qty">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="item-price">
                    ₹{item.product?.price || 0}
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}