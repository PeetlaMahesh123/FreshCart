import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          quantity,
          product:products (name, image_url)
        )
      `)
      .eq('user_id', user.id);

    setOrders(data || []);
  };

  return (
    <div>
      <h1>Orders</h1>

      {orders.map(order => (
        <div key={order.id}>

          <h3>{order.id}</h3>

          {order.items.map((item: any, i: number) => (
            <div key={i}>

              {/* ✅ FIXED IMAGE */}
              <img
                src={item.product?.image_url || "https://via.placeholder.com/100"}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/100";
                }}
              />

              <p>{item.product?.name}</p>
              <p>Qty: {item.quantity}</p>

            </div>
          ))}

        </div>
      ))}
    </div>
  );
}